import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {mockStudies, mockStudy0} from '../testing/mocks/study.mocks';
import {mockTask0} from '../testing/mocks/task.mocks';
import {mockWorkflowSpecs} from '../testing/mocks/workflow-spec.mocks';
import {mockWorkflowTasks} from '../testing/mocks/workflow-task.mocks';
import {mockWorkflow0, mockWorkflows} from '../testing/mocks/workflow.mocks';
import {AppEnvironment} from '../types/app-environment';

import {ApiService} from './api.service';

class MockEnvironment implements AppEnvironment {
  production = false;
  api = 'apiRoot';
  googleAnalyticsKey = '';
  irbUrl = '';
}

describe('ApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment}
      ]
    });
  });

  afterEach(() => {
    const httpMock = TestBed.get(HttpTestingController);
    httpMock.verify();
  });

  it('should be created', () => {
    const service: ApiService = TestBed.get(ApiService);
    expect(service).toBeTruthy();
  });

  it('should get studies', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);

    service.getStudies().subscribe(data => {
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].title).toEqual(mockStudies[0].title);
      expect(data[1].title).toEqual(mockStudies[1].title);
    });

    const req = httpMock.expectOne(`apiRoot/study`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockStudies);
  });

  it('should get one study', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);
    const studyId = 0;

    service.getStudy(studyId).subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.id).toEqual(studyId);
    });

    const req = httpMock.expectOne(`apiRoot/study/${studyId}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockStudy0);
  });

  it('should get tasks for a given workflow', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);
    const workflowId = 0;

    service.getTaskListForWorkflow(workflowId).subscribe(data => {
      expect(data.length).toBeGreaterThan(0);
      data.forEach(t => expect(t).toBeDefined());
    });

    const req = httpMock.expectOne(`apiRoot/workflow/${workflowId}/tasks`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockWorkflowTasks);
  });


  it('should get one task', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);
    const workflowId = 0;
    const taskId = mockTask0.id;

    service.getTaskForWorkflow(workflowId, taskId).subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.name).toEqual(mockTask0.name);
    });

    const req = httpMock.expectOne(`apiRoot/workflow/${workflowId}/task/${taskId}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockTask0);
  });

  it('should get workflow specs', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);

    service.getWorkflowSpecList().subscribe(data => {
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].display_name).toEqual(mockWorkflowSpecs[0].display_name);
      expect(data[1].display_name).toEqual(mockWorkflowSpecs[1].display_name);
    });

    const req = httpMock.expectOne(`apiRoot/workflow-specification`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockWorkflowSpecs);
  });

  it('should get workflows for a given study', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);
    const studyId = 0;

    service.getWorkflowListForStudy(studyId).subscribe(data => {
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].id).toEqual(mockWorkflows[0].id);
      expect(data[0].workflow_spec_id).toEqual(mockWorkflows[0].workflow_spec_id);
    });

    const req = httpMock.expectOne(`apiRoot/study/${studyId}/workflows`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockWorkflows);
  });

  it('should get one workflow', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);
    const workflowId = 0;

    service.getWorkflow(workflowId).subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.id).toEqual(workflowId);
    });

    const req = httpMock.expectOne(`apiRoot/workflow/${workflowId}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockWorkflow0);
  });

  it('should return an error if an invalid endpoint is requested', () => {
    const service: ApiService = TestBed.get(ApiService);
    expect(_ => (service as any)._endpointUrl('bogus_name')).toThrowError();
  });
});
