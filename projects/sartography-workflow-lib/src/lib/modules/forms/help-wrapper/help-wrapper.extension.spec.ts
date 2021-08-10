import {helpWrapperExtension} from './help-wrapper.extension';
import {FormlyFieldConfig} from '@ngx-formly/core';
import * as cloneDeep from "lodash/cloneDeep";

describe('helpWrapperExtension', () => {

  it('should not extend a form control that has no help option', () => {
    const field: FormlyFieldConfig = {
      key: 'field_without_help',
      type: 'text'
    };
    const before = cloneDeep(field);

    helpWrapperExtension(before);
    expect(field).toEqual(before);
  });

  it('should extend a form control that has a help option', () => {
    const field: FormlyFieldConfig = {
      key: 'field_with_help',
      type: 'text',
      templateOptions: {
        help: 'whatever',
      }
    };
    const before = cloneDeep(field);

    helpWrapperExtension(field);
    expect(field).not.toEqual(before);
    expect(field.wrappers).toContain('help');
  });
});
