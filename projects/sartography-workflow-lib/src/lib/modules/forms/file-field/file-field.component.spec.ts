import {HttpHeaders, HttpResponse} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute, convertToParamMap, Router} from '@angular/router';
import {FormlyConfig, FormlyFormBuilder, FormlyModule} from '@ngx-formly/core';
import {FormlyFieldConfigCache} from '@ngx-formly/core/lib/components/formly.field.config';
import {of} from 'rxjs';
import {ApiService} from '../../../services/api.service';
import {MockEnvironment} from '../../../testing/mocks/environment.mocks';
import {mockFile0, mockFile1, mockFileMeta0, mockFileMeta1} from '../../../testing/mocks/file.mocks';
import {FileBaseComponent} from '../file-base/file-base.component';
import {FileValueAccessorDirective} from '../file-upload/file-value-accessor.directive';
import {FileFieldComponent} from './file-field.component';
import {APP_BASE_HREF} from '@angular/common';

describe('FileFieldComponent', () => {
  let component: FileFieldComponent;
  let fixture: ComponentFixture<FileFieldComponent>;
  let httpMock: HttpTestingController;
  let builder: FormlyFormBuilder;
  let form: FormGroup;
  let field: FormlyFieldConfigCache;
  let config: FormlyConfig;
  const mockRouter = {navigate: jasmine.createSpy('navigate')};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormlyModule.forRoot({
          types: [
            {name: 'file', component: FileFieldComponent, wrappers: ['form-field']},
          ],
        }),
        FormsModule,
        HttpClientTestingModule,
        MatBottomSheetModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      declarations: [
        FileBaseComponent,
        FileFieldComponent,
        FileValueAccessorDirective,
      ],
      providers: [
        ApiService,
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: Router, useValue: mockRouter},
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
      defaultValue: mockFile1
    };
    builder.buildForm(form, [field], {hi: mockFileMeta0}, {});
  }));

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(FileFieldComponent);
    component = fixture.componentInstance;
    component.field = field;
    fixture.detectChanges();

    expect(component.selectedFile).toEqual(mockFile1);

    const fmsReq = httpMock.expectOne('apiRoot/file/' + mockFileMeta0.id);
    // const fmsReq = httpMock.expectOne(`apiRoot/file?workflow_spec_id=${mockWorkflowSpec0.id}&form_field_key=hi`);
    expect(fmsReq.request.method).toEqual('GET');
    fmsReq.flush(mockFileMeta0);

    const mockHeaders = new HttpHeaders()
      .append('last-modified', mockFileMeta0.last_modified.toString())
      .append('content-type', mockFileMeta0.type);

    expect(component.selectedFile).toEqual(mockFile0);
    expect(component.selectedFileMeta).toEqual(mockFileMeta0);
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select a file', () => {
    const addFileSpy = spyOn(component, 'addFile').and.stub();
    const eventWithFile = {target: {files: [mockFile0]}};
    (component as any).onFileSelected(eventWithFile);
    expect(component.selectedFile).toEqual(mockFile0);
    expect(addFileSpy).toHaveBeenCalledWith(mockFile0);

/*  I do not think this is necessary anymore, because we NEVEr put the file inside the meta
    // Should get file from selectedFileMeta if it's not in the file field
    addFileSpy.calls.reset();
    component.selectedFile = undefined;
    component.selectedFileMeta = mockFileMeta0;
    const eventNoFile = {target: {files: []}};
    (component as any).onFileSelected(eventNoFile);
    expect(component.selectedFile).toEqual(mockFile0);
    expect(addFileSpy).not.toHaveBeenCalled();
*/
  });

  it('should add a file', () => {
    // as a file is defined by default, it should attempt to delete it before adding the new one.
    spyOn((component as any).api, 'deleteFileMeta').and.returnValue(of(null));
    spyOn((component as any).api, 'addFile').and.returnValue(of(mockFileMeta0));
    component.addFile(mockFile0);
    expect(component.selectedFile).toEqual(mockFile0);
    expect(component.selectedFileMeta).toEqual(mockFileMeta0);
  });

  it('should remove a file', () => {
    spyOn((component as any).api, 'deleteFileMeta').and.returnValue(of(null));
    component.selectedFileMeta = mockFileMeta0;
    component.selectedFile = mockFile0;

    component.removeFile();
    expect(component.selectedFileMeta).toBeUndefined();
    expect(component.selectedFile).toBeUndefined();
  });

  it('should set default value', () => {
    expect(component.selectedFile).toEqual(mockFile0);
  });
});
