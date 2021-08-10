import {ReactiveFormsModule} from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormlyFieldConfig, FormlyModule} from '@ngx-formly/core';
import {FormlySelectModule} from '@ngx-formly/core/select';
import {FormlyMatFormFieldModule} from '@ngx-formly/material/form-field';
import {createFormlyFieldComponent} from '../../../testing/formly/component-factory';
import {RadioDataFieldComponent} from './radio-data-field.component';


const renderComponent = (field: FormlyFieldConfig) => {
  return createFormlyFieldComponent(field, {
    declarations: [
      RadioDataFieldComponent,
    ],
    imports: [
      FormlyMatFormFieldModule,
      FormlyModule.forRoot({
        types: [
          {name: 'radio_data', component: RadioDataFieldComponent, wrappers: ['form-field']},
        ]
      }),
      FormlySelectModule,
      MatRadioModule,
      NoopAnimationsModule,
      ReactiveFormsModule,
    ],
  });
};

describe('RadioDataFieldComponent', () => {
  it('should render radio buttons with data', () => {
    const component = renderComponent({
      key: 'radio_field',
      type: 'radio_data',
      templateOptions: {
        label: 'Radio Data Field',
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
        radio_field: {value: 'c', label: 'Option C', data: {short_name: 'c', long_name: 'Option C', description: 'C is for catachthonic'}},
      }
    });

    expect(component).toBeTruthy();
    expect(component.query('lib-radio-data-field')).not.toBeNull();
    const radioButtons = component.queryAll('mat-radio-button');
    expect(radioButtons.length).toEqual(6);

    const value = component.field.form.value;
    expect(value).toEqual(jasmine.objectContaining({
      radio_field: {value: 'c', label: 'Option C', data: {short_name: 'c', long_name: 'Option C', description: 'C is for catachthonic'}},
    }));
  });
});
