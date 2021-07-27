import {MatCheckboxModule} from '@angular/material/checkbox';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormlyFieldConfig, FormlyModule} from '@ngx-formly/core';
import {FormlySelectModule} from '@ngx-formly/core/select';
import {FormlyMatFormFieldModule} from '@ngx-formly/material/form-field';
import * as createClone from 'rfdc';
import {createFormlyFieldComponent} from '../../../testing/formly/component-factory';
import {MulticheckboxDataFieldComponent} from './multicheckbox-data-field.component';


const renderComponent = (field: FormlyFieldConfig) => {
  return createFormlyFieldComponent(field, {
    declarations: [
      MulticheckboxDataFieldComponent,
    ],
    imports: [
      FormlyModule.forRoot({
        types: [
          {name: 'multicheckbox_data', component: MulticheckboxDataFieldComponent, wrappers: ['form-field']},
        ]
      }),
      FormlyMatFormFieldModule,
      FormlySelectModule,
      MatCheckboxModule,
      NoopAnimationsModule,
    ],
  });
};

describe('MulticheckboxDataFieldComponent', () => {
  const mockModel = {
    checkbox_field: [
      {value: 'b', label: 'Option B', data: {short_name: 'b', long_name: 'Option B', description: 'B is for blandiloquent'}},
      {value: 'e', label: 'Option E', data: {short_name: 'e', long_name: 'Option E', description: 'E is for endemoniasmic'}},
    ]
  };

  const mockField = {
    key: 'checkbox_field',
    type: 'multicheckbox_data',
    defaultValue: [{value: 'a', label: 'Option A', data: {short_name: 'a', long_name: 'Option A', description: 'A is for apoplanesic'}}],
    templateOptions: {
      label: 'Multicheckbox Data Field',
      type: 'array',
      options: [
        {value: 'a', label: 'Option A', data: {short_name: 'a', long_name: 'Option A', description: 'A is for apoplanesic'}},
        {value: 'b', label: 'Option B', data: {short_name: 'b', long_name: 'Option B', description: 'B is for blandiloquent'}},
        {value: 'c', label: 'Option C', data: {short_name: 'c', long_name: 'Option C', description: 'C is for catachthonic'}},
        {value: 'd', label: 'Option D', data: {short_name: 'd', long_name: 'Option D', description: 'D is for didaskaleinophobic'}},
        {value: 'e', label: 'Option E', data: {short_name: 'e', long_name: 'Option E', description: 'E is for endemoniasmic'}},
        {value: 'f', label: 'Option F', data: {short_name: 'f', long_name: 'Option F', description: 'F is for fanfaronic'}},
      ],
    },
    model: null,
  };

  it('should render multicheckbox type with default value', () => {
    const component = renderComponent(mockField);

    expect(component.query('lib-multicheckbox-data-field')).not.toBeNull();
    const checkboxes = component.queryAll('mat-checkbox');
    expect(checkboxes.length).toEqual(6);
    expect(component.field.form.value).toEqual(jasmine.objectContaining({
      checkbox_field: [
        {value: 'a', label: 'Option A', data: {short_name: 'a', long_name: 'Option A', description: 'A is for apoplanesic'}},
      ]
    }));
  });

  it('should render multicheckbox type with previously-selected values', () => {
    const mockFieldWithModel = createClone()(mockField);
    mockFieldWithModel.model = createClone()(mockModel);
    const component = renderComponent(mockFieldWithModel);

    expect(component.query('lib-multicheckbox-data-field')).not.toBeNull();
    const checkboxes = component.queryAll('mat-checkbox');
    expect(checkboxes.length).toEqual(6);
    expect(component.field.form.value).toEqual(jasmine.objectContaining(mockModel));

    // The 2nd and 5th items should be selected.
    expect(component.field.form.value.checkbox_field.length).toEqual(2);

    // Click the 1st item.
    const checkbox1 = checkboxes[0].query(By.css('input'));
    checkbox1.nativeElement.click();
    component.fixture.detectChanges();
    expect(component.field.form.value.checkbox_field.length).toEqual(3, 'checkbox should be checked.');

    // Click the 2nd item.
    const checkbox2 = checkboxes[0].query(By.css('input'));
    checkbox2.nativeElement.click();
    component.fixture.detectChanges();
    expect(component.field.form.value.checkbox_field.length).toEqual(2, 'checkbox should be unchecked.');
  });

  it('should render multicheckbox type with only one value', () => {
    const mockFieldSingle = {
      key: 'checkbox_field',
      type: 'multicheckbox_data',
      defaultValue: [{
        value: 'a',
        label: 'Option A',
        data: {short_name: 'a', long_name: 'Option A', description: 'A is for apoplanesic'}
      }],
      templateOptions: {
        label: 'Multicheckbox Data Field',
        type: 'array',
        options: [
          {
            value: 'a',
            label: 'Option A',
            data: {short_name: 'a', long_name: 'Option A', description: 'A is for apoplanesic'}
          }
        ]
      }
    };

    const component = renderComponent(mockFieldSingle);
    expect(component.query('lib-multicheckbox-data-field')).not.toBeNull();
    const checkboxes = component.queryAll('mat-checkbox');
    expect(checkboxes.length).toEqual(1);
    expect(component.field.form.value).toEqual(jasmine.objectContaining({
      checkbox_field: [
        {value: 'a', label: 'Option A', data: {short_name: 'a', long_name: 'Option A', description: 'A is for apoplanesic'}},
      ]
    }));
  });



});
