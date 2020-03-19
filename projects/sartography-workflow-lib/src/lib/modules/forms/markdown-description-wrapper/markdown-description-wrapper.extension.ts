import {FormlyFieldConfig} from '@ngx-formly/core';

export function markdownDescriptionWrapperExtension(field: FormlyFieldConfig) {
  if (!field.templateOptions || (field.wrappers && field.wrappers.indexOf('markdown_description') !== -1)) {
    return;
  }

  if (field.templateOptions.markdownDescription) {
    if (field.wrappers && (field.wrappers.length > 0)) {
      const panelIndex = field.wrappers.findIndex(w => w === 'panel');

      if (panelIndex === -1) {
        // Put it at the beginning
        field.wrappers.unshift('markdown_description');
      } else {
        // Insert it just after the panel
        field.wrappers.splice(panelIndex + 1, 0, 'markdown_description');
      }
    } else {
      // Wrappers is empty. Just set it
      field.wrappers = ['markdown_description'];
    }
  }
}
