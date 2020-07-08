import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {FormGroup} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormlyConfig, FormlyFormBuilder, FormlyModule} from '@ngx-formly/core';
import {FormlyFieldConfigCache} from '@ngx-formly/core/lib/components/formly.field.config';
import {FormlySelectModule} from '@ngx-formly/core/select';
import {MulticheckboxDataFieldComponent} from './multicheckbox-data-field.component';


describe('MulticheckboxDataFieldComponent', () => {
  let component: MulticheckboxDataFieldComponent;
  let fixture: ComponentFixture<MulticheckboxDataFieldComponent>;
  let builder: FormlyFormBuilder;
  let form: FormGroup;
  let field: FormlyFieldConfigCache;
  let config: FormlyConfig;
  let model: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCheckboxModule,
        FormlySelectModule,
        FormlyModule.forRoot({
          types: [
            {name: 'multicheckbox_data', component: MulticheckboxDataFieldComponent},
          ],
        }),
      ],
      declarations: [MulticheckboxDataFieldComponent]
    }).compileComponents();
  }));

  beforeEach(inject([FormlyFormBuilder, FormlyConfig], (formlyBuilder: FormlyFormBuilder, formlyConfig: FormlyConfig) => {
    form = new FormGroup({});
    config = formlyConfig;
    builder = formlyBuilder;
    field = {
      key: 'checkbox_field',
      type: 'multicheckbox_data',
      templateOptions: {
        label: 'Multicheckbox Data Field',
        options: [
          {label: 'Option A', value: 'a', data: {short_name: 'a', long_name: 'Option A', description: 'A is for apoplanesic'}},
          {label: 'Option B', value: 'b', data: {short_name: 'b', long_name: 'Option B', description: 'B is for blandiloquent'}},
          {label: 'Option C', value: 'c', data: {short_name: 'c', long_name: 'Option C', description: 'C is for catachthonic'}},
          {label: 'Option D', value: 'd', data: {short_name: 'd', long_name: 'Option D', description: 'D is for didaskaleinophobic'}},
          {label: 'Option E', value: 'e', data: {short_name: 'e', long_name: 'Option E', description: 'E is for endemoniasmic'}},
          {label: 'Option F', value: 'f', data: {short_name: 'f', long_name: 'Option F', description: 'F is for fanfaronic'}},
        ]
      }
    };

    model = {
      checkbox_field: [
        {label: 'Option B', value: 'b', data: {short_name: 'b', long_name: 'Option B', description: 'B is for blandiloquent'}},
        {label: 'Option E', value: 'e', data: {short_name: 'e', long_name: 'Option E', description: 'E is for endemoniasmic'}},
      ]
    };
    builder.buildForm(form, [field], [model], {});
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MulticheckboxDataFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
