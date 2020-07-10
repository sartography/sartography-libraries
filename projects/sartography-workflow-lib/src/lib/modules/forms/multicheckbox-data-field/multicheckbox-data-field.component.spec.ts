import {MatCheckboxModule} from '@angular/material/checkbox';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormlyFieldConfig, FormlyModule} from '@ngx-formly/core';
import {FormlySelectModule} from '@ngx-formly/core/select';
import {FormlyMatFormFieldModule} from '@ngx-formly/material/form-field';
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
}

describe('MulticheckboxDataFieldComponent', () => {
  it('should render multicheckbox type', () => {
    const component = renderComponent({
      key: 'checkbox_field',
      type: 'multicheckbox_data',
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
      model: {
        checkbox_field: [
          {value: 'b', label: 'Option B', data: {short_name: 'b', long_name: 'Option B', description: 'B is for blandiloquent'}},
          {value: 'e', label: 'Option E', data: {short_name: 'e', long_name: 'Option E', description: 'E is for endemoniasmic'}},
        ]
      }
    });

    expect(component.query('lib-multicheckbox-data-field')).not.toBeNull();
    const checkboxes = component.queryAll('mat-checkbox');
    expect(checkboxes.length).toEqual(6);

    const value = component.field.form.value;
    expect(value).toEqual(jasmine.objectContaining({
      checkbox_field: [
        {value: 'b', label: 'Option B', data: {short_name: 'b', long_name: 'Option B', description: 'B is for blandiloquent'}},
        {value: 'e', label: 'Option E', data: {short_name: 'e', long_name: 'Option E', description: 'E is for endemoniasmic'}},
      ]
    }));
  });
});
