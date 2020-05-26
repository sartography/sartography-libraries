import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {FormGroup} from '@angular/forms';
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
      ],
      declarations: [FileBaseComponent],
      providers: [
        ApiService,
        {
          provide: ActivatedRoute,
          useValue: {paramMap: of(convertToParamMap({study_id: '0', workflow_id: '0', task_id: 'whatever'}))},
        },
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
        {provide: Router, useValue: mockRouter},
        {provide: APP_BASE_HREF, useValue: ''},
      ]
    })
      .compileComponents();
  }));

  beforeEach(inject([FormlyFormBuilder, FormlyConfig], (formlyBuilder: FormlyFormBuilder, formlyConfig: FormlyConfig) => {
    form = new FormGroup({});
    config = formlyConfig;
    builder = formlyBuilder;
    field = {
      key: 'hi'
    };
    builder.buildForm(form, [field], {hi: 123}, {});
  }));

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(FileBaseComponent);
    component = fixture.componentInstance;
    component.field = {key: 'hi'};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.key).toEqual('hi');
    expect((component as any).fileId).toEqual(null);

    const fp = (component as any).fileParams;
    expect(fp).toBeTruthy();
    expect(fp.study_id).toEqual(0);
    expect(fp.workflow_id).toEqual(0);
    expect(fp.form_field_key).toEqual('hi');
  });

});
