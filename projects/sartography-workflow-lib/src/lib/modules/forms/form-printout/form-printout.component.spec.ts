import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {FormGroup} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {FormlyConfig, FormlyFormBuilder, FormlyModule} from '@ngx-formly/core';
import {FormlyFieldConfigCache} from '@ngx-formly/core/lib/components/formly.field.config';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {FormlyMatDatepickerModule} from '@ngx-formly/material/datepicker';
import {mockFormlyFieldConfig, mockFormlyFieldModel} from '../../../testing/mocks/form.mocks';
import {FormPrintoutComponent} from './form-printout.component';

describe('FormPrintoutComponent', () => {
  let component: FormPrintoutComponent;
  let fixture: ComponentFixture<FormPrintoutComponent>;
  let builder: FormlyFormBuilder;
  let form: FormGroup;
  let field: FormlyFieldConfigCache;
  let config: FormlyConfig;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormlyModule.forRoot(),
        FormlyMaterialModule,
        FormlyMatDatepickerModule,
        MatNativeDateModule,
      ],
      declarations: [FormPrintoutComponent]
    })
      .compileComponents();
  }));

  beforeEach(inject([FormlyFormBuilder, FormlyConfig], (formlyBuilder: FormlyFormBuilder, formlyConfig: FormlyConfig) => {
    form = new FormGroup({});
    config = formlyConfig;
    builder = formlyBuilder;
    field = mockFormlyFieldConfig;
    builder.buildForm(form, [field], mockFormlyFieldModel, {});
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(FormPrintoutComponent);
    component = fixture.componentInstance;
    component.field = field;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
