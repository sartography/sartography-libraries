import {HttpHeaders} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {ActivatedRoute, convertToParamMap, Router} from '@angular/router';
import {FormlyConfig, FormlyFormBuilder, FormlyModule} from '@ngx-formly/core';
import {FormlyFieldConfigCache} from '@ngx-formly/core/lib/components/formly.field.config';
import {FileSystemFileEntry, NgxFileDropEntry, NgxFileDropModule} from 'ngx-file-drop';
import {of} from 'rxjs';
import {ApiService} from '../../../services/api.service';
import {MockEnvironment} from '../../../testing/mocks/environment.mocks';
import {mockFileMeta0, mockFileMetas} from '../../../testing/mocks/file.mocks';
import {FileUploadComponent} from './file-upload.component';
import {APP_BASE_HREF} from '@angular/common';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let httpMock: HttpTestingController;
  let builder: FormlyFormBuilder;
  let form: FormGroup;
  let field: FormlyFieldConfigCache;
  let config: FormlyConfig;
  const mockRouter = {navigate: jasmine.createSpy('navigate')};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormlyModule.forRoot({
          types: [
            {name: 'files', component: FileUploadComponent, wrappers: ['form-field']},
          ],
        }),
        FormsModule,
        HttpClientTestingModule,
        MatBottomSheetModule,
        MatFormFieldModule,
        MatIconModule,
        MatTableModule,
        NgxFileDropModule,
        ReactiveFormsModule,
      ],
      declarations: [
        FileUploadComponent,
      ],
      providers: [
        ApiService,
        {
          provide: ActivatedRoute,
          useValue: {paramMap: of(convertToParamMap({study_id: '0', workflow_id: '0', task_id: '0'}))},
        },
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
      defaultValue: 'Hello there.'
    };
    builder.buildForm(form, [field], {}, {});
  }));

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    component.field = field;
    (component as any).data = {
      hi: 123,
    };
    fixture.detectChanges();

    const fmsReq = httpMock.expectOne('apiRoot/file?study_id=0&workflow_id=0&task_id=0&form_field_key=hi');
    expect(fmsReq.request.method).toEqual('GET');
    fmsReq.flush(mockFileMetas);

    mockFileMetas.forEach((fm, i) => {
      const fReq = httpMock.expectOne(`apiRoot/file/${fm.id}/data`);
      expect(fReq.request.method).toEqual('GET');
      const mockHeaders = new HttpHeaders()
        .append('last-modified', mockFileMetas[i].file.lastModified.toString())
        .append('content-type', mockFileMetas[i].file.type);
      fReq.flush(new ArrayBuffer(8), {headers: mockHeaders});
    });

    expect((component as any).fileMetas).toEqual(new Set(mockFileMetas));
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle a dropped file', () => {
    const addFileSpy = spyOn(component, 'addFile').and.stub();
    const updateFileListSpy = spyOn(component, 'updateFileList').and.stub();
    const files: NgxFileDropEntry[] = mockFileMetas.map(fm => {
      const fileEntry: FileSystemFileEntry = {
        name: fm.name,
        isDirectory: false,
        isFile: true,
        file: (callback: (file: File) => void): void => {
          callback(fm.file);
        },
      };
      return new NgxFileDropEntry(fm.name, fileEntry);
    });

    component.dropped(files);

    mockFileMetas.forEach(fm => expect(addFileSpy).toHaveBeenCalledWith(fm.file));
    expect(updateFileListSpy).toHaveBeenCalled();
  });

  it('should highlight drop zone on hover', () => {
    expect(component.dropZoneHover).toEqual(false);

    component.fileOver(new Event('hover'));
    expect(component.dropZoneHover).toEqual(true);

    component.fileLeave(new Event('hover'));
    expect(component.dropZoneHover).toEqual(false);
  });

  it('should display file size in human-readable units', () => {

    // 1 kilobyte (K / Kb) = 2^10 bytes = 1,024 bytes
    expect(component.formatSize(128, 1)).toEqual('0.1 KB');
    expect(component.formatSize(128, 2)).toEqual('0.13 KB');
    expect(component.formatSize(128, 3)).toEqual('0.125 KB');
    expect(component.formatSize(1024, 3)).toEqual('1.000 KB');

    // 1 megabyte (M / MB) = 2^20 bytes = 1,048,576 bytes
    expect(component.formatSize(1048576, 3)).toEqual('1.000 MB');

    // 1 gigabyte (G / GB) = 2^30 bytes = 1,073,741,824 bytes
    expect(component.formatSize(1073741824, 3)).toEqual('1.000 GB');

    // 1 terabyte (T / TB) = 2^40 bytes = 1,099,511,627,776 bytes
    expect(component.formatSize(1099511627776, 3)).toEqual('1.000 TB');
  });

  it('should truncate long strings', () => {
    expect(component.truncate('1234567890ABCDEFG', 9)).toEqual('123456789...');
    expect(component.truncate('1234567890', 9)).toEqual('123456789...');
    expect(component.truncate('12345678', 9)).toEqual('12345678');
    expect(component.truncate('false', 9)).toEqual('false');
    expect(component.truncate(undefined, 9)).toEqual('');
    expect(component.truncate(null, 9)).toEqual('');
  });

  it('should add a file', () => {
    spyOn((component as any).api, 'addFileMeta').and.returnValue(of(mockFileMeta0));
    const updateFileListSpy = spyOn(component, 'updateFileList').and.stub();
    component.addFile(mockFileMeta0.file);
    expect(component.fileMetas.has(mockFileMeta0)).toEqual(true);
    expect(updateFileListSpy).toHaveBeenCalled();
  });

  it('should remove a file', () => {
    spyOn((component as any).api, 'deleteFileMeta').and.returnValue(of(null));
    const updateFileListSpy = spyOn(component, 'updateFileList').and.stub();
    component.fileMetas.add(mockFileMeta0);
    expect(component.fileMetas.has(mockFileMeta0)).toEqual(true);

    component.removeFile(new Event('click'), mockFileMeta0);
    expect(component.fileMetas.has(mockFileMeta0)).toEqual(false);
    expect(updateFileListSpy).toHaveBeenCalled();
  });
});

