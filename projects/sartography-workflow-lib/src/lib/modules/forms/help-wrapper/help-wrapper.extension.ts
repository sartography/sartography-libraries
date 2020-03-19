import {FormlyFieldConfig} from '@ngx-formly/core';

export function helpWrapperExtension(field: FormlyFieldConfig) {
  if (!field.templateOptions || (field.wrappers && field.wrappers.indexOf('help') !== -1)) {
    return;
  }

  if (field.templateOptions.help) {
    field.wrappers = field.wrappers || [];
    field.wrappers.push('help');
  }
}
