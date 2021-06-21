import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {FormGroup, FormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatNativeDateModule} from '@angular/material/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormlyConfig, FormlyFormBuilder, FormlyModule} from '@ngx-formly/core';
import {FormlyFieldConfigCache} from '@ngx-formly/core/lib/components/formly.field.config';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {FormlyMatDatepickerModule} from '@ngx-formly/material/datepicker';
import {DeviceDetectorService} from 'ngx-device-detector';
import {mockFormlyFieldConfig, mockFormlyFieldModel} from '../../../testing/mocks/form.mocks';
import {FormPrintoutComponent} from '../form-printout/form-printout.component';
import {PanelWrapperComponent} from '../panel-wrapper/panel-wrapper.component';
import {RepeatSectionComponent} from '../repeat-section/repeat-section.component';
import {RepeatSectionDialogComponent} from './repeat-section-dialog.component';
import {FileFieldComponent} from '../file-field/file-field.component';
import {MockEnvironment} from '../../../testing/mocks/environment.mocks';
import {ActivatedRoute, convertToParamMap, Router} from '@angular/router';
import {of} from 'rxjs';
import {APP_BASE_HREF} from '@angular/common';
import {ApiService} from '../../../services/api.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('RepeatSectionDialogComponent', () => {
  let component: RepeatSectionDialogComponent;
  let fixture: ComponentFixture<RepeatSectionDialogComponent>;
  let builder: FormlyFormBuilder;
  let form: FormGroup;
  let field: FormlyFieldConfigCache;
  let config: FormlyConfig;
  const mockEnvironment = new MockEnvironment();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormlyMatDatepickerModule,
        FormlyModule.forRoot({
          types: [
            {name: 'repeat', component: RepeatSectionComponent},
            {name: 'file', component: FileFieldComponent, wrappers: ['form-field']},
          ],
          wrappers: [
            {name: 'panel', component: PanelWrapperComponent},
          ],
        }),
        FormlyMaterialModule,
        FormsModule,
        HttpClientTestingModule,
        MatCardModule,
        MatDialogModule,
        MatIconModule,
        MatNativeDateModule,
        NoopAnimationsModule,
      ],
      declarations: [
        FormPrintoutComponent,
        PanelWrapperComponent,
        RepeatSectionComponent,
        RepeatSectionDialogComponent,
      ],
      providers: [
        ApiService,
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
        {provide: APP_BASE_HREF, useValue: '/'},
        DeviceDetectorService,
        {
          provide: MatDialogRef, useValue: {
            close: () => {
            }
          }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            title: 'Happy Little Title',
            fields: [mockFormlyFieldConfig],
            model: mockFormlyFieldModel
          }
        },
      ],
    })
      .compileComponents();
  }));

  beforeEach(inject([FormlyFormBuilder, FormlyConfig], (formlyBuilder: FormlyFormBuilder, formlyConfig: FormlyConfig) => {
    form = new FormGroup({});
    config = formlyConfig;
    builder = formlyBuilder;
    field = mockFormlyFieldConfig;
    builder.buildForm(form, [field], [mockFormlyFieldModel], {});
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatSectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog on no click', () => {

    // Return nothing if no initial model is empty
    const closeDialogSpy = spyOn(component.dialogRef, 'close').and.stub();
    component.initialModel = {};
    component.data.model = {blah: 'fnord'};
    component.onNoClick();
    expect(closeDialogSpy).toHaveBeenCalledWith(undefined);

    // Return initial model if it has been edited
    closeDialogSpy.calls.reset();
    component.initialModel = {blort: 'glop'};
    component.data.model = {blort: 'I have been modified!'};
    component.onNoClick();
    expect(closeDialogSpy).toHaveBeenCalledWith({blort: 'glop'});
  });

  it('should highlight required fields', () => {
    const updateDisableSaveSpy = spyOn(component, 'updateDisableSave').and.stub();
    component.highlightRequiredFields(field.fieldGroup);
    expect(updateDisableSaveSpy).toHaveBeenCalled();
  });
});
