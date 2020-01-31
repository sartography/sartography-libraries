import {HttpClient, HttpErrorResponse, HttpEvent, HttpParams, HttpResponse} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ApiError} from '../types/api';
import {AppEnvironment} from '../types/app-environment';
import {FileMeta} from '../types/file';
import {Study} from '../types/study';
import {Workflow, WorkflowSpec} from '../types/workflow';
import {WorkflowTask} from '../types/workflow-task';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiRoot: string;

  endpoints = {
    studyList: '/study',
    study: '/study/{study_id}',
    studyStatus: '/study-update/{study_id}',
    workflowListForStudy: '/study/{study_id}/workflows',
    workflowSpecList: '/workflow-specification',
    workflowSpec: '/workflow-specification/{spec_id}',
    fileList: '/file',
    file: '/file/{file_id}',
    fileData: '/file/{file_id}/data',
    workflow: '/workflow/{workflow_id}',
    taskListForWorkflow: '/workflow/{workflow_id}/tasks',
    taskForWorkflow: '/workflow/{workflow_id}/task/{task_id}',
    taskDataForWorkflow: '/workflow/{workflow_id}/task/{task_id}/data',
  };

  constructor(
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
    private httpClient: HttpClient
  ) {
    this.apiRoot = environment.api;
  }

  /** Get the string value from a given URL */
  getStringFromUrl(url: string): Observable<string> {
    return this.httpClient
      .get(url, {responseType: 'text'})
      .pipe(catchError(this._handleError));
  }

  /** Get all Studies */
  getStudies(): Observable<Study[]> {
    const url = this.apiRoot + this.endpoints.studyList;

    return this.httpClient
      .get<Study[]>(url)
      .pipe(catchError(this._handleError));
  }

  /** Add a Study */
  addStudy(study: Study): Observable<Study> {
    const url = this.apiRoot + this.endpoints.studyList;

    return this.httpClient
      .post<Study>(url, study)
      .pipe(catchError(this._handleError));
  }

  /** Get a specific Study */
  getStudy(studyId: number): Observable<Study> {
    const url = this.apiRoot + this.endpoints.study
      .replace('{study_id}', studyId.toString());

    return this.httpClient
      .get<Study>(url)
      .pipe(catchError(this._handleError));
  }

  /** Update a specific Study */
  updateStudy(studyId: number, study: Study): Observable<Study> {
    const url = this.apiRoot + this.endpoints.study
      .replace('{study_id}', studyId.toString());

    return this.httpClient
      .post<Study>(url, study)
      .pipe(catchError(this._handleError));
  }

  /** Get status of a specific Study */
  getStudyStatus(studyId: number): Observable<HttpResponse<any>> {
    const url = this.apiRoot + this.endpoints.studyStatus
      .replace('{study_id}', studyId.toString());

    return this.httpClient.get<HttpResponse<any>>(url, {observe: 'response'})
      .pipe(catchError(this._handleError));
  }

  /** Add a Workflow to a specific Study */
  addWorkflowForStudy(studyId: number, workflowSpecId: string): Observable<Workflow[]> {
    const url = this.apiRoot + this.endpoints.workflowListForStudy
      .replace('{study_id}', studyId.toString());

    return this.httpClient
      .post<Workflow[]>(url, {id: workflowSpecId})
      .pipe(catchError(this._handleError));
  }

  /** List all Workflows for a Study */
  getWorkflowListForStudy(studyId: number): Observable<Workflow[]> {
    const url = this.apiRoot + this.endpoints.workflowListForStudy
      .replace('{study_id}', studyId.toString());

    return this.httpClient
      .get<Workflow[]>(url)
      .pipe(catchError(this._handleError));
  }

  /** Get all Workflow Specifications */
  getWorkflowSpecList(): Observable<WorkflowSpec[]> {
    const url = this.apiRoot + this.endpoints.workflowSpecList;

    return this.httpClient
      .get<WorkflowSpec[]>(url)
      .pipe(catchError(this._handleError));
  }

  /** Add a Workflow Specification */
  addWorkflowSpecification(newSpec: WorkflowSpec): Observable<WorkflowSpec> {
    const url = this.apiRoot + this.endpoints.workflowSpecList;

    return this.httpClient
      .post<WorkflowSpec>(url, newSpec)
      .pipe(catchError(this._handleError));
  }

  /** Update a Workflow Specification */
  getWorkflowSpecification(specId: string): Observable<WorkflowSpec> {
    const url = this.apiRoot + this.endpoints.workflowSpec
      .replace('{spec_id}', specId);

    return this.httpClient
      .get<WorkflowSpec>(url)
      .pipe(catchError(this._handleError));
  }

  /** Update a Workflow Specification */
  updateWorkflowSpecification(specId: string, newSpec: WorkflowSpec): Observable<WorkflowSpec> {
    const url = this.apiRoot + this.endpoints.workflowSpec
      .replace('{spec_id}', specId);

    return this.httpClient
      .put<WorkflowSpec>(url, newSpec)
      .pipe(catchError(this._handleError));
  }

  /** Update a Workflow Specification */
  deleteWorkflowSpecification(specId: string): Observable<null> {
    const url = this.apiRoot + this.endpoints.workflowSpec
      .replace('{spec_id}', specId);

    return this.httpClient
      .delete<null>(url)
      .pipe(catchError(this._handleError));
  }

  /** Get all Files and their File Metadata for a Workflow Specification */
  listBpmnFiles(specId: string): Observable<FileMeta[]> {
    const url = this.apiRoot + this.endpoints.fileList;
    const params = new HttpParams().set('spec_id', specId);

    return this.httpClient
      .get<FileMeta[]>(url, {params})
      .pipe(catchError(this._handleError));
  }

  /** Add a File and its File Metadata to a Workflow Specification */
  addFileMeta(specId: string, fileMeta: FileMeta): Observable<FileMeta> {
    const url = this.apiRoot + this.endpoints.fileList;
    const params = new HttpParams().set('spec_id', specId);
    const formData = new FormData();
    formData.append('workflow_spec_id', fileMeta.workflow_spec_id);
    formData.append('file', fileMeta.file);

    return this.httpClient
      .post<FileMeta>(url, formData, {params})
      .pipe(catchError(this._handleError));
  }

  /** Update File Metadata */
  updateFileMeta(fileMeta: FileMeta): Observable<FileMeta> {
    const url = this.apiRoot + this.endpoints.file
      .replace('{file_id}', fileMeta.id.toString());

    // Don't send file data
    delete fileMeta.file;

    return this.httpClient
      .put<FileMeta>(url, fileMeta)
      .pipe(catchError(this._handleError));
  }

  deleteFileMeta(fileMetaId: number): Observable<null> {
    const url = this.apiRoot + this.endpoints.file
      .replace('{file_id}', fileMetaId.toString());

    return this.httpClient
      .delete<null>(url)
      .pipe(catchError(this._handleError));
  }

  /** Get the File Data for specific File Metadata */
  getFileData(fileId: number): Observable<Blob> {
    const url = this.apiRoot + this.endpoints.fileData
      .replace('{file_id}', fileId.toString());

    return this.httpClient
      .get(url, {responseType: 'blob'})
      .pipe(catchError(this._handleError));
  }

  /** Update the File Data for specific File Metadata */
  updateFileData(fileMeta: FileMeta): Observable<Blob> {
    const url = this.apiRoot + this.endpoints.fileData
      .replace('{file_id}', fileMeta.id.toString());
    const formData = new FormData();
    formData.append('file', fileMeta.file);

    return this.httpClient
      .put(url, formData, {responseType: 'blob'})
      .pipe(catchError(this._handleError));
  }

  /** Get a specific Workflow */
  getWorkflow(workflowId: number): Observable<Workflow> {
    const url = this.apiRoot + this.endpoints.workflow
      .replace('{workflow_id}', workflowId.toString());

    return this.httpClient
      .get<Workflow>(url)
      .pipe(catchError(this._handleError));
  }

  /** Get all Tasks for a Workflow */
  getTaskListForWorkflow(workflowId: number): Observable<WorkflowTask[]> {
    const url = this.apiRoot + this.endpoints.taskListForWorkflow
      .replace('{workflow_id}', workflowId.toString());

    return this.httpClient
      .get<WorkflowTask[]>(url)
      .pipe(catchError(this._handleError));
  }

  /** Get a specific Task for a Workflow */
  getTaskForWorkflow(workflowId: number, taskId: string): Observable<WorkflowTask> {
    const url = this.apiRoot + this.endpoints.taskForWorkflow
      .replace('{workflow_id}', workflowId.toString())
      .replace('{task_id}', taskId);

    return this.httpClient.get<WorkflowTask>(url)
      .pipe(catchError(this._handleError));
  }

  /** Update Task Data for a specific Workflow Task */
  updateTaskDataForWorkflow(workflowId: number, taskId: string, data: any): Observable<Workflow> {
    const url = this.apiRoot + this.endpoints.taskDataForWorkflow
      .replace('{workflow_id}', workflowId.toString())
      .replace('{task_id}', taskId);

    return this.httpClient.put<Workflow>(url, data)
      .pipe(catchError(this._handleError));
  }

  private _handleError(error: ApiError): Observable<never> {
    return throwError(error.message || 'Could not complete your request; please try again later.');
  }
}
