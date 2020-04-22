import {Pipe, PipeTransform} from '@angular/core';
import {FormlyFieldConfig} from '@ngx-formly/core';
import {isIterable} from 'rxjs/internal-compatibility';
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

  transform(value: BpmnFormJsonField[], ...args: any[]): FormlyFieldConfig[] {
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
          break;
        case 'string':
          resultField.type = 'input';
          resultField.defaultValue = field.default_value;
          break;
        case 'textarea':
          resultField.type = 'textarea';
          resultField.defaultValue = field.default_value;
          break;
        case 'long':
          resultField.type = 'input';
          resultField.templateOptions.type = 'number';
          resultField.defaultValue = parseInt(field.default_value, 10);
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
          break;
        case 'file':
          resultField.type = 'file';
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
          if (v.name === 'required') {
            resultField.templateOptions.required = this._stringToBool(v.config);
          }
        }
      }

      // Convert bpmnjs field properties to Formly template options.
      if (field.properties && isIterable(field.properties) && (field.properties.length > 0)) {
        for (const p of field.properties) {
          switch (p.id) {
            case 'max_length':
              resultField.templateOptions.maxLength = parseInt(p.value, 10);
              break;
            case 'min_length':
              resultField.templateOptions.minLength = parseInt(p.value, 10);
              break;
            case 'max':
              resultField.templateOptions.max = parseInt(p.value, 10);
              break;
            case 'min':
              resultField.templateOptions.min = parseInt(p.value, 10);
              break;
            case 'group':
              resultField.templateOptions.groupName = p.value;
              break;
            case 'repeat':
              resultField.templateOptions.repeatSectionName = p.value;
              break;
            case 'hide_expression':
              resultField.hideExpression = p.value;
              break;
            case 'label_expression':
              resultField.expressionProperties['templateOptions.label'] = p.value;
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
            key: this._toSnakeCase(groupName),
            templateOptions: {
              label: groupName,
            },
            fieldGroup: [field],
            wrappers: ['panel'],
          };

          if (field.templateOptions.repeatSectionName) {
            newGroup.templateOptions.repeatSectionName = field.templateOptions.repeatSectionName;
            delete field.templateOptions.repeatSectionName;
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
      if (field.templateOptions.repeatSectionName) {

        // look for existing group
        const repeatSectionName = field.templateOptions.repeatSectionName;
        const group = grouped.find(g => g.templateOptions.repeatSectionName === repeatSectionName);

        if (group) {
          group.fieldArray.fieldGroup.push(field);
        } else {
          // if not found, add the group, then add it to the grouped array
          const newGroup: FormlyFieldConfig = {
            key: this._toSnakeCase(repeatSectionName),
            type: 'repeat',
            templateOptions: {
              label: repeatSectionName,
            },
            fieldArray: {
              fieldGroup: [field],
            },
            wrappers: ['panel'],
          };

          newGroup.templateOptions.repeatSectionName = repeatSectionName;
          delete field.templateOptions.repeatSectionName;
          grouped.push(newGroup);
        }
      } else {
        // Field has no group name. Just add it.
        grouped.push(field);
      }
    });

    grouped.forEach(field => {
      if (field.templateOptions.repeatSectionName) {
        delete field.templateOptions.repeatSectionName;
      }
    });

    return grouped;
  }


  private _toSnakeCase(str: string): string {
    return !str ? '' : String(str)
      .trim()
      .replace(/\W+/gi, '_')
      .toLowerCase();
  }
}
