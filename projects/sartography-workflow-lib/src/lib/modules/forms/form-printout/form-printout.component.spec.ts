import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {FormGroup} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {FormlyConfig, FormlyFormBuilder, FormlyModule} from '@ngx-formly/core';
import {FormlyFieldConfigCache} from '@ngx-formly/core/lib/components/formly.field.config';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {FormlyMatDatepickerModule} from '@ngx-formly/material/datepicker';
import {TruncateModule} from '@yellowspot/ng-truncate';
import {mockFormlyFieldConfig, mockFormlyFieldModel} from '../../../testing/mocks/form.mocks';
import {FormPrintoutComponent} from './form-printout.component';
import {FileUploadComponent} from '../file-upload/file-upload.component';
import {FileFieldComponent} from '../file-field/file-field.component';
import {MockEnvironment} from '../../../testing/mocks/environment.mocks';
import {APP_BASE_HREF} from '@angular/common';
import {HttpClientTestingModule} from '@angular/common/http/testing';

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
        FormlyModule.forRoot({
          types: [
            {name: 'file', component: FileFieldComponent, wrappers: ['form-field']},
          ],
        }),
        FormlyMaterialModule,
        FormlyMatDatepickerModule,
        MatNativeDateModule,
        TruncateModule,
        HttpClientTestingModule,
      ],
      declarations: [FormPrintoutComponent],
      providers: [
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
        {provide: APP_BASE_HREF, useValue: '/'},
        ]
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

  it('should display the file name for an uploaded file', () => {
    expect(component).toBeTruthy();
    expect(component.getModelValue('fifth_field')).toEqual({ id: 101, name: 'bob.txt' });
  });
});
