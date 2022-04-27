import {Injectable, Pipe, PipeTransform} from '@angular/core';
import {FormlyFieldConfig} from '@ngx-formly/core';
import { cloneDeep } from 'lodash';
import {defer, from, Observable, of, Subject, timer} from 'rxjs';
import {isIterable} from 'rxjs/internal-compatibility';
import {FileParams} from '../../types/file';
import {BpmnFormJsonField, BpmnFormJsonFieldEnumValue, BpmnFormJsonFieldProperty} from '../../types/json';
import isEqual from 'lodash.isequal';
import {catchError, debounceTime, mergeMap} from 'rxjs/operators';
import {ApiError} from '../../types/api';
import {ScriptService} from '../../services/script.service';
import {PythonService} from '../../services/python.service';

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

  /**
   * For evaluations to work correctly, the python service must be loaded, and ready to execute at the time of construction.
   * @param apiService
   * @param pythonService
   */
  constructor(private pythonService?: PythonService) {
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
          this.setDefaultValue(model, resultField, field, field.default_value);
          break;
        case 'string':
          resultField.type = 'input';
          this.setDefaultValue(model, resultField, field, field.default_value);
          resultField.modelOptions.updateOn = 'blur';
          break;
        case 'textarea':
          resultField.type = 'textarea';
          this.setDefaultValue(model, resultField, field, field.default_value);
          resultField.templateOptions.rows = 5;
          resultField.modelOptions.updateOn = 'blur'
          break;
        case 'long':
          resultField.type = 'input';
          resultField.templateOptions.type = 'number';
          resultField.templateOptions.keydown= checkNumeric;
          resultField.templateOptions.attributes= { onpaste: 'return false;'};
          this.setDefaultValue(model, resultField, field, field.default_value);
          resultField.modelOptions.updateOn = 'blur'
          resultField.validators = {validation: ['number']};
          break;
        case 'url':
          resultField.type = 'input';
          resultField.templateOptions.type = 'url';
          resultField.modelOptions.updateOn = 'blur'
          this.setDefaultValue(model, resultField, field, field.default_value);
          resultField.validators = {validation: ['url']};
          break;
        case 'email':
          resultField.type = 'input';
          resultField.templateOptions.type = 'email';
          resultField.modelOptions.updateOn = 'blur'
          this.setDefaultValue(model, resultField, field, field.default_value);
          resultField.validators = {validation: ['email']};
          break;
        case 'tel':
          resultField.type = 'input';
          resultField.templateOptions.type = 'tel';
          resultField.modelOptions.updateOn = 'blur'
          this.setDefaultValue(model, resultField, field, field.default_value);
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
          this.setDefaultValue(model, resultField, field, field.default_value);
          break;
        case 'date':
          resultField.type = 'datepicker';
          resultField.modelOptions.updateOn = 'blur'
          if (field.default_value) {
            this.setDefaultValue(model, resultField, field, field.default_value);
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
          fieldFileParams.irb_doc_code = field.id;
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
        resultField.templateOptions.label = ""
        resultField.expressionProperties['templateOptions.label'] =
          this.getPythonEvalFunction(field, field.label, '');
      }

      // Convert bpmnjs field validations to Formly field requirements
      if (field.validation && isIterable(field.validation) && (field.validation.length > 0)) {
        for (const v of field.validation) {
          switch (v.name) {
            case 'regex':
              resultField.validators = {validation: [{name: 'regex', options: {regex: v.config}}]};
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
              resultField.templateOptions.repeatSectionHideExpression = this.getPythonEvalFunction(field, p.value);
              break;
            case 'hide_expression':
              resultField.hideExpression = this.getPythonEvalFunction(field, p.value);
              break;
            case 'value_expression':
              resultField.expressionProperties['model.' + field.id] = this.getPythonEvalFunction(field, p.value);
              break;
            case 'repeat_required_expression':
              resultField.templateOptions.repeatSectionRequiredExpression = this.getPythonEvalFunction(field, p.value);
              break;
            case 'required_expression':
              resultField.expressionProperties['templateOptions.required'] = this.getPythonEvalFunction(field, p.value);
              break;
            case 'read_only_expression':
              resultField.expressionProperties['templateOptions.readonly'] = this.getPythonEvalFunction(field, p.value, false);
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
              resultField.expressionProperties['templateOptions.placeholder'] = this.getPythonEvalFunction(field, p.value);
              break;
            case 'description':
              resultField.templateOptions.description = p.value;
              resultField.expressionProperties['templateOptions.description'] = this.getPythonEvalFunction(field, p.value);
              break;
            case 'help':
              resultField.templateOptions.help = p.value;
              resultField.expressionProperties['templateOptions.help'] = this.getPythonEvalFunction(field, p.value);
              break;
            case 'markdown_description':
              resultField.templateOptions.markdownDescription = p.value;
              resultField.expressionProperties['templateOptions.markdownDescription'] = this.getPythonEvalFunction(field, p.value);
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
                    this.setDefaultValue(model, resultField, field, field.default_value);
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
              resultField.expressionProperties['templateOptions.doc_code'] = this.getPythonEvalFunction(field, p.value);
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

  protected setDefaultValue(model: any, resultField: FormlyFieldConfig, field: BpmnFormJsonField, def_value: any) {
    let model_value = resultField.key.toString().split('.').reduce((o,i)=> o[i], model);
    if (def_value == null || (model_value !== undefined && model_value !== null)) {
      return;
    }
    resultField.defaultValue = this.pythonService.eval(def_value, model)
  }


  protected getPythonEvalFunction(field: BpmnFormJsonField, expression: string, defaultValue:any = false) {
    // We return a function that can be called many times.
    return (model: any, formState: any, fieldConfig: FormlyFieldConfig): any => {
      let data = this.getEvalContext(model, formState, fieldConfig)
      if (this.pythonService.isReady()) {
        return this.pythonService.eval(expression, data, defaultValue);
      } else {
        return defaultValue;
      }
    }
  }

  /**
   * The context for any python evaluation will be the model.  But repeating sections really only have a porition of
   * the model to reference in Formly, so we have to add the parent models context back in so we can make reference
   * to other data in the model/task.data
   * @private
   */
  private getEvalContext(model:any, formState: any, fieldConfig: FormlyFieldConfig) {
    let data = cloneDeep(model);

    // Give fields a default value of None (so they can be used in dynamic expressions, and dont error out)
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

    return data
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
