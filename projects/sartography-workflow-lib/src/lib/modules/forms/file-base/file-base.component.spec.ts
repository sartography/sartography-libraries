import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {FormGroup} from '@angular/forms';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {ActivatedRoute, convertToParamMap, Router} from '@angular/router';
import {FormlyConfig, FormlyFormBuilder, FormlyModule} from '@ngx-formly/core';
import {FormlyFieldConfigCache} from '@ngx-formly/core/lib/components/formly.field.config';
import {of} from 'rxjs';
import {ApiService} from '../../../services/api.service';
import {MockEnvironment} from '../../../testing/mocks/environment.mocks';
import {FileBaseComponent} from './file-base.component';
import {APP_BASE_HREF} from '@angular/common';

describe('FileBaseComponent', () => {
  let component: FileBaseComponent;
  let fixture: ComponentFixture<FileBaseComponent>;
  let httpMock: HttpTestingController;
  let builder: FormlyFormBuilder;
  let form: FormGroup;
  let field: FormlyFieldConfigCache;
  let config: FormlyConfig;
  const mockRouter = {navigate: jasmine.createSpy('navigate')};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormlyModule.forRoot(),
        HttpClientTestingModule,
        MatBottomSheetModule,
      ],
      declarations: [FileBaseComponent],
      providers: [
        ApiService,
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
        {provide: Router, useValue: mockRouter},
        {provide: APP_BASE_HREF, useValue: '/'},
      ]
    })
      .compileComponents();
  }));

  beforeEach(inject([FormlyFormBuilder, FormlyConfig], (formlyBuilder: FormlyFormBuilder, formlyConfig: FormlyConfig) => {
    form = new FormGroup({});
    config = formlyConfig;
    builder = formlyBuilder;
    field = {
      key: 'hi',
      templateOptions:
        { workflow_id: 10,
          study_id: 9,
          workflow_spec_id: 'specName',
        },
      expressionProperties:
        {
          doc_code: () => 'my_doc_code' // doc_code should override the field key
        }
    };
    builder.buildForm(form, [field], {hi: 123}, {});
  }));

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(FileBaseComponent);
    component = fixture.componentInstance;
    component.field = field;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.key).toEqual('hi');
    component.ngOnInit();
    const fp = (component as any).fileParams;
    expect(fp).toBeTruthy();
    expect(fp.study_id).toEqual(9);
    expect(fp.workflow_id).toEqual(10);
    expect(fp.form_field_key).toEqual('hi');
  });

});
