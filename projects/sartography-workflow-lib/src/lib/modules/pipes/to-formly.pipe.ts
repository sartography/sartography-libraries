import {Pipe, PipeTransform} from '@angular/core';
import {FormlyFieldConfig} from '@ngx-formly/core';
import {isIterable} from 'rxjs/internal-compatibility';
import {ApiService} from '../../services/api.service';
import {FileParams} from '../../types/file';
import {BpmnFormJsonField} from '../../types/json';


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
          resultField.defaultValue = field.default_value;
          resultField.templateOptions.options = field.options.map(v => {
            return {value: v.id, label: v.name};
          });

          // TODO: REVISIT THIS SOMETIME WHEN WE CAN TEST IT MORE THOROUGHLY
          // // Store the entire option object as the value of the select field, but, when comparing
          // // the control, Formly will look into the value attribute of the option object, rather than
          // // the value attribute of the field. Yes, it's confusing, but it allows us to access the label
          // // of the option so we can display it later.
          // resultField.templateOptions.valueProp = (option) => option;
          // resultField.templateOptions.compareWith = (o1, o2) => o1.value === o2.value;
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
              resultField.templateOptions.repeatSectionHideExpression = p.value;
              break;
            case 'hide_expression':
              resultField.hideExpression = p.value;
              break;
            case 'value_expression':
              const modelKey = `model.${resultField.key}`
              resultField.expressionProperties[modelKey] = `${modelKey} || (${p.value})`;
              break;
            case 'label_expression':
              resultField.expressionProperties['templateOptions.label'] = p.value;
              break;
            case 'repeat_required_expression':
              resultField.templateOptions.repeatSectionRequiredExpression = p.value;
              break;
            case 'required_expression':
              resultField.expressionProperties['templateOptions.required'] = p.value;
              break;
            case 'read_only':
              resultField.templateOptions.readonly = this._stringToBool(p.value);
              resultField.templateOptions.floatLabel = 'always';
              resultField.className = 'read-only should-float';
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
              resultField.className = 'textarea-cols';
              resultField.templateOptions.cols = parseInt(p.value, 10);
              break;
            case 'enum_type':
              if (field.type === 'enum') {
                if (p.value === 'checkbox') {
                  resultField.type = 'multicheckbox';
                  resultField.className = 'vertical-checkbox-group';

                  // TODO: REVISIT THIS SOMETIME WHEN WE CAN TEST IT MORE THOROUGHLY
                  // // valueProp and compareWith don't work with multicheckbox the same way select does
                  // delete resultField.templateOptions.valueProp;  
                  // delete resultField.templateOptions.compareWith;

                  if (resultField.templateOptions.required) {
                    resultField.validators = {validation: ['multicheckbox']};
                  }
                }

                if (p.value === 'radio') {
                  resultField.type = 'radio';
                  resultField.className = 'vertical-radio-group';
                }

                resultField.templateOptions.options = field.options.map(v => {
                  return {value: v.id, label: v.name};
                });
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
            key: groupName,
            templateOptions: {
              label: groupName,
            },
            fieldGroup: [field],
            wrappers: ['panel'],
          };

          if (field.templateOptions.repeatSectionKey) {
            // Move the repeat section (if any) out of the field and into the new group
            newGroup.templateOptions.repeatSectionKey = field.templateOptions.repeatSectionKey;
            newGroup.templateOptions.repeatSectionTitle = field.templateOptions.repeatSectionTitle;
            newGroup.templateOptions.repeatSectionButtonLabel = field.templateOptions.repeatSectionButtonLabel;
            newGroup.templateOptions.repeatSectionEditOnly = field.templateOptions.repeatSectionEditOnly;
            newGroup.templateOptions.repeatSectionHideExpression = field.templateOptions.repeatSectionHideExpression;
            newGroup.templateOptions.repeatSectionRequired = field.templateOptions.repeatSectionRequired;
            newGroup.templateOptions.repeatSectionRequiredExpression = field.templateOptions.repeatSectionRequiredExpression;
            delete field.templateOptions.repeatSectionKey;
            delete field.templateOptions.repeatSectionTitle;
            delete field.templateOptions.repeatSectionButtonLabel;
            delete field.templateOptions.repeatSectionHideExpression;
            delete field.templateOptions.repeatSectionRequired;
            delete field.templateOptions.repeatSectionRequiredExpression;
          }

          newGroup.templateOptions.groupName = groupName;
          delete field.templateOptions.groupName;
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

          newGroup.fieldGroup[0].expressionProperties = {
            'templateOptions.required': field.templateOptions.repeatSectionRequiredExpression,
          }
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
}
