import {markdownDescriptionWrapperExtension} from './markdown-description-wrapper.extension';
import {FormlyFieldConfig} from '@ngx-formly/core';
import * as cloneDeep from 'lodash/cloneDeep';
import {clone} from '@ngx-formly/core/lib/utils';

describe('markdownDescriptionWrapperExtension', () => {

  it('should not extend a form control that has no markdownDescription option', () => {
    const field: FormlyFieldConfig = {
      key: 'field_without_markdown_description',
      type: 'text'
    };
    const before = cloneDeep(field);

    markdownDescriptionWrapperExtension(before);
    expect(field).toEqual(before);
  });

  it('should extend a form control that has a markdownDescription option', () => {
    const field: FormlyFieldConfig = {
      key: 'field_with_markdown_description',
      type: 'text',
      templateOptions: {
        markdownDescription: 'whatever',
      }
    };
    const before = cloneDeep(field);

    markdownDescriptionWrapperExtension(field);
    expect(field).not.toEqual(before);
    expect(field.wrappers).toContain('markdown_description');
  });

  it('should add markdownDescription just after the panel', () => {
    const field: FormlyFieldConfig = {
      key: 'field_with_markdown_description',
      type: 'text',
      templateOptions: {
        markdownDescription: 'whatever',
      },
      wrappers: ['panel', 'form-field', 'help']
    };
    const before = cloneDeep(field);

    markdownDescriptionWrapperExtension(field);
    expect(field).not.toEqual(before);
    expect(field.wrappers).toContain('markdown_description');
    expect(field.wrappers[1]).toEqual('markdown_description');
  });

  it('should add markdownDescription at the beginning if no panel', () => {
    const field: FormlyFieldConfig = {
      key: 'field_with_markdown_description',
      type: 'text',
      templateOptions: {
        markdownDescription: 'whatever',
      },
      wrappers: ['form-field', 'help']
    };
    const before = cloneDeep(field);

    markdownDescriptionWrapperExtension(field);
    expect(field).not.toEqual(before);
    expect(field.wrappers).toContain('markdown_description');
    expect(field.wrappers[0]).toEqual('markdown_description');
  });
});
