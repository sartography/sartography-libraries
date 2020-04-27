import {HttpHeaders, HttpResponse} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import createClone from 'rfdc';
import {MockEnvironment} from '../testing/mocks/environment.mocks';
import {mockFileMeta0, mockFileMetas, mockFileMetaTask0} from '../testing/mocks/file.mocks';
import {mockWorkflowStats0} from '../testing/mocks/stats.mocks';
import {mockErrorResponse, mockUpdatingResponse} from '../testing/mocks/study-status.mocks';
import {mockStudies, mockStudy0, newRandomStudy} from '../testing/mocks/study.mocks';
import {mockUser} from '../testing/mocks/user.mocks';
import {mockWorkflowSpecCategories, mockWorkflowSpecCategory0} from '../testing/mocks/workflow-spec-category.mocks';
import {mockWorkflowSpec0, mockWorkflowSpecs} from '../testing/mocks/workflow-spec.mocks';
import {mockWorkflowTask0} from '../testing/mocks/workflow-task.mocks';
import {mockWorkflow0} from '../testing/mocks/workflow.mocks';
import {FileMeta, FileParams} from '../types/file';
import {Study} from '../types/study';
import {UserParams} from '../types/user';
import {WorkflowSpec, WorkflowSpecCategory} from '../types/workflow';
import {ApiService} from './api.service';

describe('ApiService', () => {
  let httpMock: HttpTestingController;
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ApiService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get XML string from a URL', () => {
    const xmlString = '<xml></xml>';
    service.getStringFromUrl('http://some-url.com').subscribe(data => {
      expect(data).toEqual(xmlString);
    });

    const req = httpMock.expectOne(`http://some-url.com`);
    expect(req.request.method).toEqual('GET');
    req.flush(xmlString);
  });

  it('should get studies', () => {
    service.getStudies().subscribe(data => {
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].title).toEqual(mockStudies[0].title);
      expect(data[1].title).toEqual(mockStudies[1].title);
    });

    const req = httpMock.expectOne(`apiRoot/study`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockStudies);
  });

  it('should add a study', () => {
    const newStudy = newRandomStudy();

    service.addStudy(newStudy).subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.id).toEqual(newStudy.id);
    });

    const req = httpMock.expectOne(`apiRoot/study`);
    expect(req.request.method).toEqual('POST');
    req.flush(newStudy);
  });

  it('should get one study', () => {
    service.getStudy(mockStudy0.id).subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.id).toEqual(mockStudy0.id);
    });

    const req = httpMock.expectOne(`apiRoot/study/${mockStudy0.id}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockStudy0);
  });

  it('should update a study', () => {
    const modifiedStudy: Study = createClone()(mockStudy0);
    modifiedStudy.title = 'New title';

    service.updateStudy(mockStudy0.id, modifiedStudy).subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.id).toEqual(mockStudy0.id);
      expect(data.title).toEqual(modifiedStudy.title);
    });

    const req = httpMock.expectOne(`apiRoot/study/${mockStudy0.id}`);
    expect(req.request.method).toEqual('POST');
    req.flush(modifiedStudy);
  });

  it('should get updating study status', () => {
    service.getStudyStatus(mockStudy0.id).subscribe(response => {
      expect(response.status).toEqual(mockUpdatingResponse.status);
      expect(response.statusText).toEqual(mockUpdatingResponse.statusText);
    });

    const req = httpMock.expectOne(`apiRoot/study-update/${mockStudy0.id}`);
    expect(req.request.method).toEqual('GET');
    req.flush(null, mockUpdatingResponse);
  });

  it('should get tasks for a given workflow', () => {
    service.getWorkflow(mockWorkflow0.id).subscribe(data => {
      expect(data.user_tasks.length).toBeGreaterThan(0);
      data.user_tasks.forEach(t => expect(t).toBeDefined());
    });

    const req = httpMock.expectOne(`apiRoot/workflow/${mockWorkflow0.id}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockWorkflow0);
  });

  it('should get one task', () => {
    const workflowId = mockWorkflow0.id;
    const taskId = mockWorkflowTask0.id;

    service.getTaskForWorkflow(workflowId, taskId).subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.name).toEqual(mockWorkflowTask0.name);
    });

    const req = httpMock.expectOne(`apiRoot/workflow/${workflowId}/task/${taskId}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockWorkflowTask0);
  });

  it('should list workflow specifications', () => {
    service.getWorkflowSpecList().subscribe(data => {
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].display_name).toEqual(mockWorkflowSpecs[0].display_name);
      expect(data[1].display_name).toEqual(mockWorkflowSpecs[1].display_name);
    });

    const req = httpMock.expectOne(`apiRoot/workflow-specification`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockWorkflowSpecs);
  });

  it('should get one workflow', () => {
    const workflowId = 0;

    service.getWorkflow(workflowId).subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.id).toEqual(workflowId);
    });

    const req = httpMock.expectOne(`apiRoot/workflow/${workflowId}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockWorkflow0);
  });

  it('should get stats for one workflow', () => {
    const workflowId = 0;

    service.getWorkflowStats(workflowId).subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.id).toEqual(workflowId);
    });

    const req = httpMock.expectOne(`apiRoot/workflow/${workflowId}/stats`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockWorkflowStats0);
  });

  it('should get one workflow specification', () => {
    service.getWorkflowSpecification(mockWorkflowSpec0.id).subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.id).toEqual(mockWorkflowSpec0.id);
    });

    const req = httpMock.expectOne(`apiRoot/workflow-specification/${mockWorkflowSpec0.id}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockWorkflowSpec0);
  });

  it('should add a workflow specification', () => {
    service.addWorkflowSpecification(mockWorkflowSpec0).subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.id).toEqual(mockWorkflowSpec0.id);
    });

    const req = httpMock.expectOne(`apiRoot/workflow-specification`);
    expect(req.request.method).toEqual('POST');
    req.flush(mockWorkflowSpec0);
  });

  it('should update a workflow specification', () => {
    const modifiedSpec: WorkflowSpec = createClone()(mockWorkflowSpec0);
    modifiedSpec.display_name = 'New name';

    service.updateWorkflowSpecification(mockWorkflowSpec0.id, modifiedSpec).subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.id).toEqual(mockWorkflowSpec0.id);
      expect(data.display_name).toEqual(modifiedSpec.display_name);
    });

    const req = httpMock.expectOne(`apiRoot/workflow-specification/${mockWorkflowSpec0.id}`);
    expect(req.request.method).toEqual('PUT');
    req.flush(modifiedSpec);
  });

  it('should delete a workflow specification', () => {
    service.deleteWorkflowSpecification(mockWorkflowSpec0.id).subscribe(data => {
      expect(data).toBeNull();
    });

    const req = httpMock.expectOne(`apiRoot/workflow-specification/${mockWorkflowSpec0.id}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);
  });

  it('should get files for a given workflow specification', () => {
    service.getFileMetas({workflow_spec_id: mockWorkflowSpec0.id}).subscribe(data => {
      expect(data.length).toBeGreaterThan(0);

      for (const fileMeta of data) {
        expect(fileMeta.workflow_spec_id).toEqual(mockWorkflowSpec0.id);
      }
    });

    const req = httpMock.expectOne(`apiRoot/file?workflow_spec_id=${mockWorkflowSpec0.id}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockFileMetas);
  });

  it('should get files for a given study', () => {
    service.getFileMetas({study_id: mockStudy0.id}).subscribe(data => {
      expect(data.length).toBeGreaterThan(0);

      for (const fileMeta of data) {
        expect(fileMeta.study_id).toEqual(mockStudy0.id);
      }
    });

    const req = httpMock.expectOne(`apiRoot/file?study_id=${mockStudy0.id}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockFileMetas);
  });

  it('should get files for a given workflow task', () => {
    const params: FileParams = {
      study_id: mockStudy0.id,
      workflow_id: mockWorkflow0.id,
      task_id: mockWorkflowTask0.id
    };
    service.getFileMetas(params).subscribe(data => {
      expect(data.length).toBeGreaterThan(0);

      for (const fileMeta of data) {
        expect(fileMeta.task_id).toEqual(mockWorkflowTask0.id);
      }
    });

    const queryString = `study_id=${mockStudy0.id}&workflow_id=${mockWorkflow0.id}&task_id=${mockWorkflowTask0.id}`;
    const req = httpMock.expectOne('apiRoot/file?' + queryString);
    expect(req.request.method).toEqual('GET');
    req.flush(mockFileMetas);
  });

  it('should get files for a given running workflow', () => {
    service.listWorkflowFiles(mockWorkflow0.id).subscribe(data => {
      expect(data.length).toBeGreaterThan(0);
      for (const fileMeta of data) {
        expect(fileMeta.workflow_id).toEqual(mockWorkflow0.id);
        expect(fileMeta.study_id).toEqual(mockWorkflow0.study_id);
        expect(fileMeta.task_id).toEqual(mockWorkflowTask0.id);
      }
    });

    const req = httpMock.expectOne(`apiRoot/file?workflow_id=${mockWorkflow0.id}`);
    expect(req.request.method).toEqual('GET');
    req.flush([mockFileMetaTask0]);
  });

  it('should add a file for a given workflow specification', () => {
    service.addFileMeta({workflow_spec_id: mockWorkflowSpec0.id}, mockFileMeta0).subscribe(data => {
      expect(data.workflow_spec_id).toEqual(mockFileMeta0.workflow_spec_id);
      expect(data.name).toEqual(mockFileMeta0.name);
      expect(data.content_type).toEqual(mockFileMeta0.content_type);
    });

    const req = httpMock.expectOne(`apiRoot/file?workflow_spec_id=${mockFileMeta0.workflow_spec_id}`);
    expect(req.request.method).toEqual('POST');
    req.flush(mockFileMeta0);
  });

  it('should add a file for a given workflow task', () => {
    const params: FileParams = {
      study_id: mockStudy0.id,
      workflow_id: mockWorkflow0.id,
      task_id: mockWorkflowTask0.id
    };
    service.addFileMeta(params, mockFileMeta0).subscribe(data => {
      expect(data.workflow_spec_id).toEqual(mockFileMeta0.workflow_spec_id);
      expect(data.name).toEqual(mockFileMeta0.name);
      expect(data.content_type).toEqual(mockFileMeta0.content_type);
    });

    const queryString = `study_id=${mockStudy0.id}&workflow_id=${mockWorkflow0.id}&task_id=${mockWorkflowTask0.id}`;
    const req = httpMock.expectOne('apiRoot/file?' + queryString);
    expect(req.request.method).toEqual('POST');
    req.flush(mockFileMeta0);
  });

  it('should update file metadata', () => {
    const modifiedFileMeta: FileMeta = {
      id: mockFileMeta0.id,
      content_type: mockFileMeta0.content_type,
      name: 'one-fish-v2.bpmn',
      file: new File(['new file bits'], 'one-fish-v2.bpmn'),
      type: mockFileMeta0.type,
      workflow_spec_id: mockFileMeta0.workflow_spec_id,
    };

    service.updateFileMeta(modifiedFileMeta).subscribe(data => {
      expect(data.workflow_spec_id).toEqual(modifiedFileMeta.workflow_spec_id);
      expect(data.name).toEqual(modifiedFileMeta.name);
      expect(data.content_type).toEqual(modifiedFileMeta.content_type);
    });

    const req = httpMock.expectOne(`apiRoot/file/${mockFileMeta0.id}`);
    expect(req.request.method).toEqual('PUT');
    req.flush(modifiedFileMeta);
  });

  it('should get file metadata for a given file', () => {
    service.getFileMeta(mockFileMeta0.id).subscribe((data: FileMeta) => {
      expect(data.id).toEqual(mockFileMeta0.id);
      expect(data.type).toEqual(mockFileMeta0.type);
      expect(data.name).toEqual(mockFileMeta0.name);
    });

    const req = httpMock.expectOne(`apiRoot/file/${mockFileMeta0.id}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockFileMeta0);
  });

  it('should get file data for a given file', () => {
    service.getFileData(mockFileMeta0.id).subscribe((response: HttpResponse<ArrayBuffer>) => {
      expect(response.headers.get('content-type')).toEqual(mockFileMeta0.file.type);
      expect(response.headers.get('last-modified')).toEqual(mockFileMeta0.file.lastModified.toString());
    });

    const req = httpMock.expectOne(`apiRoot/file/${mockFileMeta0.id}/data`);
    expect(req.request.method).toEqual('GET');
    const mockHeaders = new HttpHeaders()
      .append('last-modified', mockFileMeta0.file.lastModified.toString())
      .append('content-type', mockFileMeta0.file.type);
    req.flush(new ArrayBuffer(8), {headers: mockHeaders});
  });

  it('should update file data for a given file', () => {
    const modifiedFileMeta: FileMeta = {
      id: mockFileMeta0.id,
      content_type: mockFileMeta0.content_type,
      name: 'one-fish-v2.bpmn',
      file: new File(['new file bits'], 'one-fish-v2.bpmn', {type: 'text/xml'}),
      type: mockFileMeta0.type,
      workflow_spec_id: mockFileMeta0.workflow_spec_id,
    };

    service.updateFileData(modifiedFileMeta).subscribe(data => {
      const file = data as FileMeta;
      expect(file.name).toEqual(modifiedFileMeta.name);
      expect(file.type).toEqual(modifiedFileMeta.content_type);
    });

    const req = httpMock.expectOne(`apiRoot/file/${mockFileMeta0.id}/data`);
    expect(req.request.method).toEqual('PUT');
    req.event(new HttpResponse<File>({body: modifiedFileMeta.file}));
  });

  it('should delete a given file', () => {
    service.deleteFileMeta(mockFileMeta0.id).subscribe(data => {
      expect(data).toBeNull();
    });

    const req = httpMock.expectOne(`apiRoot/file/${mockFileMeta0.id}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);
  });

  it('should update Task data for a given Workflow', () => {
    const newData = {process_id: 'abc123'};
    service.updateTaskDataForWorkflow(mockWorkflow0.id, mockWorkflowTask0.id, newData).subscribe(workflow => {
      expect(workflow.id).toEqual(mockWorkflow0.id);
      expect(workflow.status).toEqual(mockWorkflow0.status);
    });

    const req = httpMock.expectOne(`apiRoot/workflow/${mockWorkflow0.id}/task/${mockWorkflowTask0.id}/data`);
    expect(req.request.method).toEqual('PUT');
    req.flush(mockWorkflow0);
  });

  it('should open a new session when testing', () => {
    localStorage.removeItem('token');
    const userParams: UserParams = {
      uid: 'bbf2f',
      first_name: 'Babu',
      last_name: 'Frik',
      email_address: 'bbf2f@droidsmithery.anzelia.edu',
    };
    const queryString = '?uid=bbf2f&first_name=Babu&last_name=Frik&email_address=bbf2f%40droidsmithery.anzelia.edu';
    const queryStringSpy = spyOn((service as any), '_paramsToQueryString').and.callThrough();
    const openUrlSpy = spyOn(service, 'openUrl').and.stub();
    service.openSession(userParams);
    expect(queryStringSpy).toHaveBeenCalledWith(userParams);
    expect(openUrlSpy).toHaveBeenCalledWith('apiRoot/sso_backdoor' + queryString);
  });

  it('should get user from existing session on production', () => {
    const queryStringSpy = spyOn((service as any), '_paramsToQueryString').and.stub();
    const openUrlSpy = spyOn(service, 'openUrl').and.stub();
    (service as any).environment.production = true;
    service.openSession(mockUser);
    expect(queryStringSpy).not.toHaveBeenCalled();
    expect(openUrlSpy).not.toHaveBeenCalled();
  });

  it('should get user', () => {
    localStorage.setItem('token', 'some_token');
    service.getUser().subscribe(result => expect(result).toEqual(mockUser));
    const req = httpMock.expectOne(`apiRoot/user`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockUser);
    localStorage.removeItem('token');
  });

  it('should return null if no user token', () => {
    localStorage.removeItem('token');
    service.getUser().subscribe(result => expect(result).toBeNull());
    httpMock.expectNone(`apiRoot/user`);
  });

  it('should throw an error', () => {
    const badId = 666;
    service.getStudy(badId).subscribe(
      data => expect(data).toBeNull(),
      err => expect(err).toEqual('Http failure response for apiRoot/study/666: 42 waaaa')
    );

    const req = httpMock.expectOne(`apiRoot/study/${badId}`);
    expect(req.request.method).toEqual('GET');
    req.error(mockErrorResponse, {status: 42, statusText: 'waaaa'});
  });

  it('should list workflow spec categories', () => {
    service.getWorkflowSpecCategoryList().subscribe(data => {
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].display_name).toEqual(mockWorkflowSpecCategories[0].display_name);
      expect(data[1].display_name).toEqual(mockWorkflowSpecCategories[1].display_name);
    });

    const req = httpMock.expectOne(`apiRoot/workflow-specification-category`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockWorkflowSpecCategories);
  });

  it('should get one workflow spec category', () => {
    service.getWorkflowSpecCategory(mockWorkflowSpecCategory0.id).subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.id).toEqual(mockWorkflowSpecCategory0.id);
    });

    const req = httpMock.expectOne(`apiRoot/workflow-specification-category/${mockWorkflowSpecCategory0.id}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockWorkflowSpecCategory0);
  });

  it('should add a workflow spec category', () => {
    service.addWorkflowSpecCategory(mockWorkflowSpecCategory0).subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.id).toEqual(mockWorkflowSpecCategory0.id);
    });

    const req = httpMock.expectOne(`apiRoot/workflow-specification-category`);
    expect(req.request.method).toEqual('POST');
    req.flush(mockWorkflowSpecCategory0);
  });

  it('should update a workflow spec category', () => {
    const modifiedCat: WorkflowSpecCategory = createClone()(mockWorkflowSpecCategory0);
    modifiedCat.display_name = 'New name';

    service.updateWorkflowSpecCategory(mockWorkflowSpecCategory0.id, modifiedCat).subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.id).toEqual(mockWorkflowSpecCategory0.id);
      expect(data.display_name).toEqual(modifiedCat.display_name);
    });

    const req = httpMock.expectOne(`apiRoot/workflow-specification-category/${mockWorkflowSpecCategory0.id}`);
    expect(req.request.method).toEqual('PUT');
    req.flush(modifiedCat);
  });

  it('should delete a workflow spec category', () => {
    service.deleteWorkflowSpecCategory(mockWorkflowSpecCategory0.id).subscribe(data => {
      expect(data).toBeNull();
    });

    const req = httpMock.expectOne(`apiRoot/workflow-specification-category/${mockWorkflowSpecCategory0.id}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);
  });


});
