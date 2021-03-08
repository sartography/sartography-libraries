import {Pipe, PipeTransform} from '@angular/core';
import {FormlyFieldConfig} from '@ngx-formly/core';
import createClone from 'rfdc';
import {Observable, of, Subject, timer} from 'rxjs';
import {isIterable} from 'rxjs/internal-compatibility';
import {ApiService} from '../../services/api.service';
import {FileParams} from '../../types/file';
import {BpmnFormJsonField, BpmnFormJsonFieldEnumValue, BpmnFormJsonFieldProperty} from '../../types/json';
import isEqual from 'lodash.isequal';
import {catchError, debounce, debounceTime, distinctUntilChanged, filter, map, switchMap} from 'rxjs/operators';
import {ApiError} from '../../types/api';

/***
 * Convert the given BPMN form JSON value to Formly JSON
 * Usage:
 *  value | toFormly
 *
 * Example:
 jsonValue = {
      field: [
        {
          id: 'should_ask_color',
          label: 'Does color affect your mood?',
          type: 'boolean',
          default_value: 'false',
          validation: [
            {name: 'required', config: 'true'}
          ]
        },
        {
          id: 'favorite_color',
          label: 'What is your favorite color?',
          type: 'enum',
          default_value: 'indigo',
          value: [
            {id: 'red', name: 'Red'},
            {id: 'orange', name: 'Orange'},
            ...
            {id: 'violet', name: 'Violet'},
            {id: 'other', name: 'Other'},
          ],
          properties: [
            {id: 'hide_expression', value: '!should_ask_color'},
            {id: 'description', value: '...'},
            {id: 'help', value: '...'},
          ]
        },
        {
          id: 'other_color',
          label: 'Enter other color',
          type: 'text',
          properties: [
            {id: 'hide_expression', value: '!(should_ask_color && (favorite_color === "other"))'},
            {id: 'required_expression', value: 'should_ask_color && (favorite_color === "other")'},
          ]
        }
      ]
    }

 {{ jsonValue | toFormly }}

 Outputs: {
      fields: [
        {
          key: 'should_ask_color',
          type: 'boolean',
          defaultValue: 'false',
          templateOptions: {
            label: 'Does color affect your mood?',
          },
        },
        {
          key: 'favorite_color',
          type: 'select',
          templateOptions: {
            label: 'What is your favorite color?',
            options: [
              {value: 'red', label: 'Red'},
              {value: 'orange', label: 'Orange'},
              ...
              {value: 'violet', label: 'Violet'},
              {value: 'other', label: 'Other'}
            ],
            hideExpression: '!(should_ask_color && (favorite_color === "other"))'
          },
        },
        {
          key: 'other_color',
          type: 'text',
          templateOptions: {
            label: 'Enter other color',
            hideExpression: '!(should_ask_color && (favorite_color === "other"))'
          }
          expressionProperties: {
            'templateOptions.required': 'should_ask_color && (favorite_color === "other")'
          }
        }
      ]
    }
 */
export interface PythonEvaluation {
  expression: string;
  data?: any;     // Lookup data object, populated by backend LookupService
}


@Pipe({
  name: 'toFormly'
})
export class ToFormlyPipe implements PipeTransform {
  constructor(private apiService?: ApiService) {
  }

  transform(value: BpmnFormJsonField[], fileParams?: FileParams, ...args: any[]): FormlyFieldConfig[] {
    const result: FormlyFieldConfig[] = [];
    for (const field of value) {
      const resultField: FormlyFieldConfig = {
        key: field.id,
        templateOptions: {},
        expressionProperties: {},
      };

      // Convert bpmnjs field type to Formly field type
      switch (field.type) {
        case 'enum':
          resultField.type = 'select';
          resultField.templateOptions.options = field.options.map((v: BpmnFormJsonFieldEnumValue) => {
            // Include lookup data object, if available
            const option: any = {value: v.id, label: v.name};
            if (v.hasOwnProperty('data')) {
              option.data = v.data;
            }
            return option;
          });

          // Store entire options object as default value
          if (field.hasOwnProperty('default_value')) {
            if (resultField.templateOptions.options instanceof Observable) {
              resultField.templateOptions.options.subscribe(options => {
                resultField.defaultValue = options.find(o => o.value === field.default_value);
              });
            } else if (resultField.templateOptions.options instanceof Array) {
              resultField.defaultValue = resultField.templateOptions.options.find(o => {
                return o.value === field.default_value;
              });
            }
          }

          // Store the entire option object as the value of the select field, but, when comparing
          // the control, Formly will look into the value attribute of the option object, rather than
          // the value attribute of the field. Yes, it's confusing, but it allows us to access the label
          // of the option so we can display it later.
          resultField.templateOptions.valueProp = (option) => option;
          resultField.templateOptions.compareWith = (o1, o2) => isEqual(o1, o2);
          break;
        case 'string':
          resultField.type = 'input';
          resultField.defaultValue = field.default_value;
          break;
        case 'textarea':
          resultField.type = 'textarea';
          resultField.defaultValue = field.default_value;
          resultField.templateOptions.rows = 5;
          break;
        case 'long':
          resultField.type = 'input';
          resultField.templateOptions.type = 'number';
          resultField.defaultValue = parseInt(field.default_value, 10);
          resultField.validators = {validation: ['number']};
          break;
        case 'url':
          resultField.type = 'input';
          resultField.templateOptions.type = 'url';
          resultField.defaultValue = field.default_value;
          resultField.validators = {validation: ['url']};
          break;
        case 'email':
          resultField.type = 'input';
          resultField.templateOptions.type = 'email';
          resultField.defaultValue = field.default_value;
          resultField.validators = {validation: ['email']};
          break;
        case 'tel':
          resultField.type = 'input';
          resultField.templateOptions.type = 'tel';
          resultField.defaultValue = field.default_value;
          resultField.validators = {validation: ['phone']};
          break;
        case 'boolean':
          resultField.type = 'radio';
          if (field.default_value !== undefined && field.default_value !== null && field.default_value !== '') {
            resultField.defaultValue = this._stringToBool(field.default_value);
          }
          resultField.templateOptions.options = [
            {value: true, label: 'Yes'},
            {value: false, label: 'No'},
          ];
          break;
        case 'date':
          resultField.type = 'datepicker';
          if (field.default_value) {
            resultField.defaultValue = new Date(field.default_value);
          }
          break;
        case 'files':
          resultField.type = 'files';
          resultField.validators = {validation: ['files']};
          break;
        case 'file':
          resultField.type = 'file';
          resultField.validators = {validation: ['file']};
          break;
        case 'autocomplete':
          const fieldFileParams = Object.assign({}, fileParams || {});
          fieldFileParams.form_field_key = field.id;
          console.log('The params for a search are: ', fieldFileParams);
          resultField.type = 'autocomplete';
          const limit = this._getAutocompleteNumResults(field, 5);
          resultField.templateOptions.filter = (query: string) => this.apiService
            .lookupFieldOptions(query, fieldFileParams, limit);
          resultField.validators = {validation: ['autocomplete']};
          break;
        default:
          console.error('Field type is not supported.');
          resultField.type = field.type;
          break;
      }

      resultField.templateOptions.label = field.label;

      // Convert bpmnjs field validations to Formly field requirements
      if (field.validation && isIterable(field.validation) && (field.validation.length > 0)) {
        for (const v of field.validation) {
          switch (v.name) {
            case 'required':
              resultField.templateOptions.required = this._stringToBool(v.config);
              break;
            case 'repeat_required':
              resultField.templateOptions.repeatSectionRequired = this._stringToBool(v.config);
              break;
            case 'max_length':
              resultField.templateOptions.maxLength = parseInt(v.config, 10);
              break;
            case 'min_length':
              resultField.templateOptions.minLength = parseInt(v.config, 10);
              break;
            case 'max':
              resultField.templateOptions.max = parseInt(v.config, 10);
              break;
            case 'min':
              resultField.templateOptions.min = parseInt(v.config, 10);
              break;
          }
        }
      }

      // Convert bpmnjs field properties to Formly template options.
      if (field.properties && isIterable(field.properties) && (field.properties.length > 0)) {
        for (const p of field.properties) {
          switch (p.id) {
            case 'group':
              resultField.templateOptions.groupName = p.value;
              break;
            case 'repeat':
              resultField.templateOptions.repeatSectionKey = p.value;
              break;
            case 'repeat_title':
              resultField.templateOptions.repeatSectionTitle = p.value;
              break;
            case 'repeat_button_label':
              resultField.templateOptions.repeatSectionButtonLabel = p.value;
              break;
            case 'repeat_edit_only':
              resultField.templateOptions.repeatSectionEditOnly = this._stringToBool(p.value);
              break;
            case 'repeat_hide_expression':
              resultField.templateOptions.repeatSectionHideExpression = this.getPythonEvalFunction(field, p);
              break;
            case 'hide_expression':
              resultField.hideExpression = this.getPythonEvalFunction(field, p);
              // Hidden field values will be removed on save.
              // // Clears value when hidden (will be the default in Formly v6?)
              // (resultField as any).autoClear = true;
              break;
            case 'value_expression':
              resultField.hooks = {
                onInit(myField) {
                  const control = myField.formControl;
                  if (control.value === null && p.value in myField.model) {
                    control.setValue(myField.model[p.value]);
                  }
                }
              };
              break;
            case 'label_expression':
              resultField.expressionProperties['templateOptions.label'] = this.getPythonEvalFunction(field, p);
              break;
            case 'repeat_required_expression':
              resultField.templateOptions.repeatSectionRequiredExpression = this.getPythonEvalFunction(field, p);
              break;
            case 'required_expression':
              resultField.expressionProperties['templateOptions.required'] = this.getPythonEvalFunction(field, p);
              break;
            case 'read_only_expression':
              resultField.expressionProperties['templateOptions.readonly'] = this.getPythonEvalFunction(field, p);
              resultField.expressionProperties['templateOptions.floatLabel'] = `field.templateOptions.readonly ? 'always' : ''`;
              resultField.expressionProperties.className = this._readonlyClassName;
              break;
            case 'read_only':
              resultField.templateOptions.readonly = this._stringToBool(p.value);
              resultField.templateOptions.floatLabel = 'always';
              resultField.className = this._addClassName(resultField, 'read-only should-float');
              break;
            case 'placeholder':
              resultField.templateOptions.placeholder = p.value;
              break;
            case 'description':
              resultField.templateOptions.description = p.value;
              break;
            case 'help':
              resultField.templateOptions.help = p.value;
              break;
            case 'markdown_description':
              resultField.templateOptions.markdownDescription = p.value;
              break;
            case 'autosize':
              resultField.templateOptions.autosize = this._stringToBool(p.value);
              break;
            case 'rows':
              resultField.templateOptions.rows = parseInt(p.value, 10);
              resultField.templateOptions.minRows = parseInt(p.value, 10);
              resultField.templateOptions.autosizeMinRows = parseInt(p.value, 10);
              break;
            case 'cols':
              resultField.className = this._addClassName(resultField, 'textarea-cols');
              resultField.templateOptions.cols = parseInt(p.value, 10);
              break;
            case 'enum_type':
              if (field.type === 'enum') {
                if (p.value === 'checkbox') {
                  resultField.type = 'multicheckbox_data';
                  resultField.validators = {validation: ['multicheckbox_data']};
                  resultField.templateOptions.type = 'array';
                  resultField.className = this._addClassName(resultField, 'vertical-checkbox-group');

                  // Wrap default value in an array.
                  if (resultField.hasOwnProperty('defaultValue')) {
                    const defaultValue = createClone()(resultField.defaultValue);
                    resultField.defaultValue = [defaultValue];
                  }
                }

                if (p.value === 'radio') {
                  resultField.type = 'radio_data';
                  resultField.className = this._addClassName(resultField, 'vertical-radio-group');
                }
              }
              break;
            default:
              break;
          }
        }
      }

      result.push(resultField);
    }

    return this._makeRepeats(this._makeGroups(result));
  }

  private _stringToBool(s: string) {
    return s.toLowerCase() === 'true';
  }

  /** Convert group names into actual Formly fieldGroups */
  private _makeGroups(fields: FormlyFieldConfig[]) {
    const grouped: FormlyFieldConfig[] = [];

    fields.forEach(field => {

      // If the field has a group name, add it to its group
      if (field.templateOptions.groupName) {

        // look for existing group
        const groupName = field.templateOptions.groupName;
        const group = grouped.find(g => g.templateOptions.groupName === groupName);

        if (group) {
          group.fieldGroup.push(field);
        } else {
          // if not found, add the group, then add it to the grouped array
          const newGroup: FormlyFieldConfig = {

            // Leaving key off so Formly doesn't wrap the group model in a nested object
            // key: groupName,

            templateOptions: {
              label: groupName,
            },
            fieldGroup: [field],
            wrappers: ['panel'],
          };

          // Move repeat section properties (if any) and group name out of the field and into the new group
          const keys = [
            'repeatSectionKey',
            'repeatSectionTitle',
            'repeatSectionButtonLabel',
            'repeatSectionEditOnly',
            'repeatSectionHideExpression',
            'repeatSectionRequired',
            'repeatSectionRequiredExpression',
            'groupName',
          ];

          keys.forEach(k => {
            if (field.templateOptions.hasOwnProperty(k)) {
              newGroup.templateOptions[k] = field.templateOptions[k];
              delete field.templateOptions[k];
            }
          });

          grouped.push(newGroup);
        }
      } else {
        // Field has no group name. Just add it.
        grouped.push(field);
      }
    });

    grouped.forEach(field => {
      if (field.templateOptions.groupName) {
        delete field.templateOptions.groupName;
      }
    });

    return grouped;
  }

  /** Convert repeating section names into actual Formly repeating sections */
  private _makeRepeats(fields: FormlyFieldConfig[]) {
    const grouped: FormlyFieldConfig[] = [];

    fields.forEach(field => {

      // If the field has a group name, add it to its group
      if (field.templateOptions.repeatSectionKey) {

        // look for existing group
        const repeatSectionKey = field.templateOptions.repeatSectionKey;
        const group = grouped.find(g => {
          const to = (g.fieldGroup && g.fieldGroup[0] && g.fieldGroup[0].templateOptions);
          return (to && to.repeatSectionKey === repeatSectionKey);
        });

        if (group) {
          group.fieldGroup[0].fieldArray.fieldGroup.push(field);
        } else {
          // if not found, add the group, then add it to the grouped array
          const newGroup: FormlyFieldConfig = {
            fieldGroup: [
              {
                key: repeatSectionKey,
                wrappers: ['panel'],
                type: 'repeat',
                templateOptions: {
                  label: field.templateOptions.repeatSectionTitle,
                  buttonLabel: field.templateOptions.repeatSectionButtonLabel,
                  editOnly: field.templateOptions.repeatSectionEditOnly,
                },
                validators: {validation: ['repeat']},
                fieldArray: {fieldGroup: [field]},
              }
            ]
          };
          delete field.templateOptions.repeatSectionKey;
          delete field.templateOptions.repeatSectionTitle;
          delete field.templateOptions.repeatSectionButtonLabel;
          delete field.templateOptions.repeatSectionEditOnly;

          newGroup.hideExpression = field.templateOptions.repeatSectionHideExpression;
          delete field.templateOptions.repeatSectionHideExpression;

          // Hidden field values will be removed on save.
          // // Clears value when hidden (will be the default in Formly v6?)
          // (newGroup as any).autoClear = true;

          newGroup.fieldGroup[0].expressionProperties = {
            'templateOptions.required': field.templateOptions.repeatSectionRequiredExpression,
          };
          delete field.templateOptions.repeatSectionRequiredExpression;

          newGroup.fieldGroup[0].templateOptions.required = field.templateOptions.repeatSectionRequired;
          delete field.templateOptions.repeatSectionRequired;

          newGroup.fieldGroup[0].templateOptions.repeatSectionKey = repeatSectionKey;
          delete field.templateOptions.repeatSectionKey;
          grouped.push(newGroup);
        }
      } else {
        // Field has no group name. Just add it.
        grouped.push(field);
      }
    });

    grouped.forEach(field => {
      if (field.templateOptions && field.templateOptions.repeatSectionKey) {
        delete field.templateOptions.repeatSectionKey;
      }
    });

    return grouped;
  }

  /** Returns a function that can be used in template options and hide expressions that will
   * evaluate a python expression using an api endpoint eventually updating the assigned variable
   * to the correct value.
   * You can pass an optional method, which should be called when the result completes.
   */
  private getPythonEvalFunction(field: BpmnFormJsonField, p: BpmnFormJsonFieldProperty, defaultValue = false,
                                method = null) {
    return (model: any, formState: any, fieldConfig: FormlyFieldConfig) => {

      // Establish some variables to be added to the form state.
      const variableKey = field.id + '_' + p.id;  // The actual value we want to return
      const variableSubjectKey = field.id + '_' + p.id + '_subject'; // A subject to add api calls to.
      const variableSubscriptionKey = field.id + '_' + p.id + '_subscription'; // a debounced subscription.
      const dataStateKey = field.id + '_' + p.id + '_data';

      // Do this only the first time it is called to establish some subjects and subscriptions.
      // Set up a variable that can be returned, and a variable subject that can be debounced,
      // calls to the api will eventually end up in the formState[variable]
      if (!(formState.hasOwnProperty(variableKey))) {
        formState[variableKey] = defaultValue;
        formState[variableSubjectKey] = new Subject<PythonEvaluation>();  // To debounce on this function
        formState[variableSubscriptionKey] = formState[variableSubjectKey].pipe(
          debounceTime(250),
          switchMap((subj: PythonEvaluation) => this.apiService.eval(subj.expression, subj.data)))
          .pipe(
            // If the api service gets an error, handle it here, but don't error out our subscribers, so we
            // can make subsequent calls.
            catchError(err => of([]))
          )
          .subscribe(
            data => {
              console.log('Updating Variable to ', data.result);
              // wrap the assignment to the variable in a promise - so that it gets evaluated as a part
              // of angular's next round of DOM updates, so we avoid modifying the state in the middle of a call.
              Promise.resolve(null).then(() => formState[variableKey] = data.result);
            },
            (error: ApiError) => {
              console.log(`Failed to update field ${field.id} unable to process expression. ${error.message}`);
              formState[variableKey] = 'error'
            }
            );
      }

      // We need this check so that we don't repeatedly query the api if the data model changed and we have
      // new information to act upon.
      if (formState[dataStateKey] !== JSON.stringify(model) ) {
        formState[dataStateKey] = JSON.stringify(model);  // Deep copy of model and store it for comparison
        // TODO: Augment the model with all current form field keys and values
        // loop through fieldConfig.parent.fieldGroup
        // Get keys for all fields.
        // Look in model to see if they are there yet.
        // If not, add them to the model with value of null.


        formState[variableSubjectKey].next({expression: p.value, data: model});
        console.log('model', JSON.stringify(model, null, '    '));
      }
      // We immediately return the variable, but it might change due to the above observable.
      return formState[variableKey]
    };
  }

  /** Get num_results property from given field, or return the given default if no num_results property found. */
  private _getAutocompleteNumResults(field: BpmnFormJsonField, defaultNum: number): number {
    if (field.properties && isIterable(field.properties) && (field.properties.length > 0)) {
      const numResultsProperty = field.properties.find(p => p.id === 'autocomplete_num');
      if (numResultsProperty) {
        return parseInt(numResultsProperty.value, 10);
      }
    }

    return defaultNum;
  }

  // Returns the className string for the given field, with the given className(s) added
  private _addClassName(field: FormlyFieldConfig, className: string): string {
    const newClasses = className ? className.split(' ') : [];
    const oldClasses = field.className ? field.className.split(' ') : [];
    return Array.from(new Set(oldClasses.concat(newClasses))).join(' ')
  }

  // Returns the appropriate className string for the given field, depending on its read-only state
  private _readonlyClassName(model: any, formState: any, field: FormlyFieldConfig) {
    const readOnlyClasses = ['read-only', 'should-float'];
    const oldClasses = field.className ? field.className.split(' ') : [];
    let classes;

    if (field.templateOptions.readonly) {
      // Add the classes
      classes = oldClasses.concat(readOnlyClasses);
    } else {
      // Remove the classes
      classes = oldClasses.filter(c => !readOnlyClasses.includes(c));
    }

    // Convert to set and back again to remove duplicates
    return Array.from(new Set(classes)).join(' ');
  }
}
