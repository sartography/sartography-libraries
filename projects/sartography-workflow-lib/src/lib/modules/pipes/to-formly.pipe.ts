import {Injectable, Pipe, PipeTransform} from '@angular/core';
import {FormlyFieldConfig} from '@ngx-formly/core';
import { cloneDeep } from 'lodash';
import {Observable, of, Subject, timer} from 'rxjs';
import {isIterable} from 'rxjs/internal-compatibility';
import {ApiService} from '../../services/api.service';
import {FileParams} from '../../types/file';
import {BpmnFormJsonField, BpmnFormJsonFieldEnumValue, BpmnFormJsonFieldProperty} from '../../types/json';
import isEqual from 'lodash.isequal';
import {catchError, debounceTime, mergeMap} from 'rxjs/operators';
import {ApiError} from '../../types/api';

export function checkNumeric(field,event){
  if (event.shiftKey){
    event.preventDefault();     // Prevent character input
  }

  if( !(event.keyCode == 9  //Tab!!
    || event.keyCode == 8    // backspace
    || event.keyCode == 46      // delete
    || (event.keyCode >= 35 && event.keyCode <= 40)     // arrow keys/home/end
    || (event.keyCode >= 48 && event.keyCode <= 57)     // numbers on keyboard
    || (event.keyCode >= 96 && event.keyCode <= 105))   // number on keypad
    ) {
        event.preventDefault();     // Prevent character input
  }
}

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
  key: string;
}

@Pipe({
  name: 'toFormly'
})
export class ToFormlyPipe implements PipeTransform {
  private defaultFileParams: FileParams = {};
  constructor(private apiService?: ApiService) {
  }

  transform(value: BpmnFormJsonField[], fileParams = this.defaultFileParams, model: []= [], ...args: any[]): FormlyFieldConfig[] {

    const result: FormlyFieldConfig[] = [];
    for (const field of value) {
      const resultField: FormlyFieldConfig = {
        key: field.id,
        templateOptions: {
          workflow_id: fileParams.workflow_id,
          study_id: fileParams.study_id,
          task_spec_name:fileParams.task_spec_name,
        },
        expressionProperties: {},
        modelOptions: {}
      };

      // Convert bpmnjs field type to Formly field type
      let def = {id: "default", value: field.default_value};
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
          this.setDefaultValue(model, resultField, field, def);
          break;
        case 'string':
          resultField.type = 'input';
          this.setDefaultValue(model, resultField, field, def);
          resultField.modelOptions.updateOn = 'blur'
          break;
        case 'textarea':
          resultField.type = 'textarea';
          this.setDefaultValue(model, resultField, field, def);
          resultField.templateOptions.rows = 5;
          resultField.modelOptions.updateOn = 'blur'
          break;
        case 'long':
          resultField.type = 'input';
          resultField.templateOptions.type = 'number';
          resultField.templateOptions.keydown= checkNumeric;
          resultField.templateOptions.attributes= { onpaste: 'return false;'};
          this.setDefaultValue(model, resultField, field, def);
          resultField.modelOptions.updateOn = 'blur'
          resultField.validators = {validation: ['number']};
          break;
        case 'url':
          resultField.type = 'input';
          resultField.templateOptions.type = 'url';
          resultField.modelOptions.updateOn = 'blur'
          this.setDefaultValue(model, resultField, field, def);
          resultField.validators = {validation: ['url']};
          break;
        case 'email':
          resultField.type = 'input';
          resultField.templateOptions.type = 'email';
          resultField.modelOptions.updateOn = 'blur'
          this.setDefaultValue(model, resultField, field, def);
          resultField.validators = {validation: ['email']};
          break;
        case 'tel':
          resultField.type = 'input';
          resultField.templateOptions.type = 'tel';
          resultField.modelOptions.updateOn = 'blur'
          this.setDefaultValue(model, resultField, field, def);
          resultField.validators = {validation: ['phone']};
          break;
        case 'boolean':
          if (field.properties.find(x => x.id === 'boolean_type' && x.value === 'checkbox')) {
            resultField.type = 'checkbox';
            resultField.templateOptions.indeterminate = false;
            resultField.validators = {validation: ['checked']};
          }
          else if (!field.properties.find(x => x.id === 'boolean_type')) {
            resultField.type = 'radio';
            resultField.templateOptions.options = [
              {value: true, label: 'Yes'},
              {value: false, label: 'No'},
            ];
          }
          this.setDefaultValue(model, resultField, field, def);
          break;
        case 'date':
          resultField.type = 'datepicker';
          resultField.modelOptions.updateOn = 'blur'
          if (field.default_value) {
            this.setDefaultValue(model, resultField, field, def);
            resultField.defaultValue = new Date(resultField.defaultValue);
          }
          resultField.templateOptions = {
            datepickerOptions : { datepickerTogglePosition: 'prefix'}
          };
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
          resultField.modelOptions.updateOn = 'blur'
          resultField.type = 'autocomplete';
          resultField.templateOptions.limit = this._getAutocompleteNumResults(field, 5);
          resultField.validators = {validation: ['autocomplete']};
          break;
        default:
          console.error('Field type is not supported.');
          resultField.type = field.type;
          break;
      }

      // Resolve the label
      if(field.label) {
        let label = {id: "label", value: field.label}
        resultField.templateOptions.label = ""
        resultField.expressionProperties['templateOptions.label'] =
          this.getPythonEvalFunction(field, label, '', null, true);
      }

      // Convert bpmnjs field validations to Formly field requirements
      if (field.validation && isIterable(field.validation) && (field.validation.length > 0)) {
        for (const v of field.validation) {
          switch (v.name) {
            case 'regex':
              console.log('regex case..');
              resultField.validation = {validation: ['regex']};
              break;
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
              let read_only = this._stringToBool(p.value);
              resultField.templateOptions.readonly = read_only;
              if (read_only) {
                resultField.templateOptions.floatLabel = 'always';
                resultField.className = this._addClassName(resultField, 'read-only should-float');
              }
              break;
            case 'placeholder':
              resultField.expressionProperties['templateOptions.placeholder'] = this.getPythonEvalFunction(field, p);
              break;
            case 'description':
              resultField.templateOptions.description = p.value;
              resultField.expressionProperties['templateOptions.description'] = this.getPythonEvalFunction(field, p);
              break;
            case 'help':
              resultField.templateOptions.help = p.value;
              resultField.expressionProperties['templateOptions.help'] = this.getPythonEvalFunction(field, p);
              break;
            case 'markdown_description':
              resultField.templateOptions.markdownDescription = p.value;
              resultField.expressionProperties['templateOptions.markdownDescription'] = this.getPythonEvalFunction(field, p);
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
            case 'label.column':
              resultField.templateOptions.label_column = p.value;
              break;
            case 'value.column':
              resultField.templateOptions.value_column = p.value;
              break;
            case 'enum_type':
              if (field.type === 'enum') {
                if (p.value === 'checkbox') {
                   resultField.modelOptions.updateOn = 'blur'
                  if (field.default_value) {
                    this.setDefaultValue(model, resultField, field, def);
                    resultField.defaultValue = new Array(resultField.defaultValue);
                  } else {
                    resultField.defaultValue = [];
                  }
                  resultField.type = 'select';
                  resultField.templateOptions.multiple = true;
                  resultField.templateOptions.selectAllOption = 'Select All';
                  resultField.className = this._addClassName(resultField, 'vertical-checkbox-group');
                }
                if (p.value === 'radio') {
                  resultField.type = 'radio_data';
                  resultField.className = this._addClassName(resultField, 'vertical-radio-group');
                }
              }
              break;
            case 'doc_code':
              resultField.expressionProperties['templateOptions.doc_code'] = this.getPythonEvalFunction(field, p);
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

  protected setDefaultValue(model: any, resultField: FormlyFieldConfig, field: BpmnFormJsonField, def: any) {
    let model_value = resultField.key.toString().split('.').reduce((o,i)=> o[i], model);
    if (def.value == null || (model_value !== undefined && model_value !== null)) {
      return;
    }

    try {
      resultField.defaultValue = this.javascriptEval(def.value, model)
    } catch(e) {
      // If this is a hide expression, stop here and report an error.
      resultField.expressionProperties['model.' + field.id] = this.getPythonEvalFunction(field, def, resultField.defaultValue);
    }
  }

  /**
   * Expressions should be evaluated as python, but it is very expensive to call the backend
   * to make these calculations.  Whenever possible, evaluate the expression in the browser
   * instead.
    * @protected
   */
  protected javascriptEval(expression, model, defaultResult="no_default") {
    expression = expression.trim()

    // If this is True or False, just return that.
    if (expression === 'True') return true;
    if (expression === 'False') return false;

    // If this is just a quoted string, evaluate it to handle any escaped quotes.
    let match = expression.match(/^(["'])(.*?(?<!\\)(\\\\)*)\1$/is)
    if (match) {
      return eval(expression);
    }

    // If this is a single world (no spaces) and is a variable in the model, return it.
    // Also, handle any dot notation in the process.
    if(expression.match(/^[\w_\-.]+$/) && model.hasOwnProperty(expression)) {
      return expression.split('.').reduce((o,i)=> o[i], model)
    }

    // If this is an expression that matches not XXX or not(XXX), where XXX is in the model, eval that.
    let not_match = expression.match(/^not[ \(](\w+)\)?$/)
    if(not_match && model.hasOwnProperty(not_match[1])) {
      return !(this.javascriptEval(not_match[1], model))
    }

    // If this contains a comparison, split, eval each side, and compare the two.
    let compare_match = expression.match(/(.*) ?(==|!=| and | or ) ?(.*)$/)
    if(compare_match) {
      let arg1 = this.javascriptEval(compare_match[1], model)
      let arg2 = this.javascriptEval(compare_match[3], model)
      let comp = compare_match[2]
      if (comp == '!=')
        return arg1 !== arg2
      else if (comp == '==')
        return arg1 === arg2
      else if (comp == 'and')
        return arg1 && arg2
      else if (comp == 'or')
        return arg1 || arg2
    }
    if (defaultResult === "no_default") {
      throw SyntaxError("unable to evaluate expression " + expression)
    }
  }

  /** Returns a function that can be used in template options and hide expressions that will
   * evaluate a python expression using an api endpoint eventually updating the assigned variable
   * to the correct value.
   * You can pass an optional method, which should be called when the result completes.
   */
  protected getPythonEvalFunction(field: BpmnFormJsonField, p: BpmnFormJsonFieldProperty,
                                  defaultValue:any = false, method = null, oneTime=false) {

    // Establish some variables to be added to the form state.
    const variableKey = p.value;  // The actual value we want to return
    const variableSubjectKey = p.value + '_subject'; // A subject to add api calls to.
    const variableSubscriptionKey = p.value + '_subscription'; // a subscription.
    const varLastFormState = p.value + '_LAST_STATE'

    // Here is the function to execute to get the value.
    return (model: any, formState: any, fieldConfig: FormlyFieldConfig) => {

      if (!formState) {
        formState = {};
      }

      if(oneTime && formState[variableKey] != null  && formState[variableKey] != undefined) {
        return formState[variableKey]['oneTime']
      }

      // A bit of code to warn us when we are calling this 1000's of times.
      const c_key = 'total_python_eval_count';
      if(!(c_key in formState)) {
        formState[c_key] = 0;
      } else {
        formState[c_key] += 1;
        if (formState[c_key] % 10000 === 0) {
          console.warn("WARNING!  The Python Eval Function is being called excessively.  " +
            "Current count " + formState[c_key] )
        }
      }

      // Do this only the first time it is called to establish some subjects and subscriptions.
      // Set up a variable that can be returned, and a variable subject that can be debounced,
      // calls to the api will eventually end up in the formState[variable]
      if (!(formState.hasOwnProperty(variableKey))) {
        formState[variableKey] = {};
        formState[variableKey].default = defaultValue;
        formState[variableSubjectKey] = new Subject<PythonEvaluation>();  // To debounce on this function
        formState[variableSubscriptionKey] = formState[variableSubjectKey].pipe(
          mergeMap((subj: PythonEvaluation) => this.apiService.eval(subj.expression, subj.data, subj.key)))
          .pipe(
            // If the api service gets an error, handle it here, but don't error out our subscribers, so we
            // can make subsequent calls.
            catchError(err => of([]))
          )
          .subscribe(
            response => {
              // wrap the assignment to the variable in a promise - so that it gets evaluated as a part
              // of angular's next round of DOM updates, so we avoid modifying the state in the middle of a call.
              // If there is no error, update the value.
              if (!response.hasOwnProperty('error')) {
                Promise.resolve(null).then(() => {
                  if(response.result != formState[variableKey][response.key]) {
                    // The last successful evaluation becomes the new default, this keeps things from flickering.
                    formState[variableKey].default = response.result;
                    formState[variableKey][response.key] = response.result;
                    // Assure that the field is updated in the display with the new information.
                    fieldConfig.formControl.updateValueAndValidity({onlySelf: true, emitEvent: true});
                  }
                });
              }
            },
            (error: ApiError) => {
              console.warn(`Failed to update field ${field.id} unable to process expression. ${error.message}`);
              formState[variableKey] = 'error';
            },
            () => {
              if (method) {
                method()
              }
            });
      }

      let data = cloneDeep(model);
      delete data[field.id];  // eDeep(model);do not consider the current field when calculating the data model hash.\

      // Give fields a default value of None (so they can be used in dynamic expressions)
      for (let field of fieldConfig.parent.fieldGroup) {
        if (field.key && !(field.key.toString() in data)){
           data[field['key']] = null;
        }
      }

      // Field parent.parent (repeats, groups)
      if (fieldConfig.parent.parent) {
        for (let field of fieldConfig.parent.parent.fieldGroup) {
          if (field.key && !(field.key.toString() in data)) {
            data[field['key']] = null;
          }
        }
      }

      // Establish the data model that the evaluation will be based upon.  This may be
      // 'mainModel', if this is being handled in a form that was created in a repeat section, or it
      // may include the data extracted from a great grandparent, if one exists, which will happen in
      // repeat sections, where the parent is fieldArray, and the grandparent is a list of field arrays,
      // and the great grandparent is the original form field.  I AM SORRY, if you are here trying to
      // debug this.
      if (formState.hasOwnProperty('mainModel')) {
        data = {...formState.mainModel, ...data};
      } else if ("parent" in fieldConfig.parent && "parent" in fieldConfig.parent.parent) {
        data = {...fieldConfig.parent.parent.parent.model, ...data};
      }

      let key = 'oneTime'
      if (!oneTime) {
        key = this.hashCode(JSON.stringify(data));
      }

      // If we can evaluate the method locally, do so rather than calling the back end.
      try {
        formState[variableKey][key] = this.javascriptEval(p.value, data)
        return formState[variableKey][key]
      } catch(e) {
        // If this is a hide expression, stop here and report an error.
        if(p.id == 'hide_expression') {
          console.log("Unable to evaluate the hide expression.", p.value)
        }
      }

      if (!(key in formState[variableKey])) {
        formState[variableKey][key] = formState[variableKey].default;
        formState[variableSubjectKey].next({expression: p.value, data, key});
      }
      // We immediately return the variable, but it might change due to the above observable.
      return formState[variableKey][key];

    };

  }

  private  hashCode(str) {
    /* eslint-disable no-bitwise */
    return str.split('').reduce((prevHash, currVal) =>
      (((prevHash << 5) - prevHash) + currVal.charCodeAt(0)) | 0, 0);
    /* eslint-enable no-bitwise */
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
    return Array.from(new Set(oldClasses.concat(newClasses))).join(' ');
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
