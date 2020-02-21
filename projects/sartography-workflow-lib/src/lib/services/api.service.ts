import {HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ApiError} from '../types/api';
import {AppEnvironment} from '../types/app-environment';
import {FileMeta, FileParams} from '../types/file';
import {Study} from '../types/study';
import {User, UserParams} from '../types/user';
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
    taskListAllForWorkflow: '/workflow/{workflow_id}/all_tasks',
    taskListForWorkflow: '/workflow/{workflow_id}/tasks',
    taskForWorkflow: '/workflow/{workflow_id}/task/{task_id}',
    taskDataForWorkflow: '/workflow/{workflow_id}/task/{task_id}/data',
    fakeSession: '/sso_backdoor',
    user: '/user',
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

  /** Get all File Metadata for a given Workflow Specification, Workflow Instance, Study, or Task */
  getFileMetas(fileParams: FileParams): Observable<FileMeta[]> {
    const url = this.apiRoot + this.endpoints.fileList;
    const params = this._fileParamsToHttpParams(fileParams);

    return this.httpClient
      .get<FileMeta[]>(url, {params})
      .pipe(catchError(this._handleError));
  }

  /** Get all Files and their File Metadata for a running workflow */
  listWorkflowFiles(workflowId: number): Observable<FileMeta[]> {
    const url = this.apiRoot + this.endpoints.fileList;
    const params = new HttpParams().set('workflow_id', workflowId.toString());
    return this.httpClient
      .get<FileMeta[]>(url, {params})
      .pipe(catchError(this._handleError));
  }

  /** Add a File and its File Metadata to a Workflow Specification */
  addFileMeta(fileParams: FileParams, fileMeta: FileMeta): Observable<FileMeta> {
    const url = this.apiRoot + this.endpoints.fileList;
    const params = this._fileParamsToHttpParams(fileParams);

    const formData = new FormData();
    formData.append('file', fileMeta.file);

    return this.httpClient
      .post<FileMeta>(url, formData, {params})
      .pipe(catchError(this._handleError));
  }

  /** Get metadata for one specific File */
  getFileMeta(fileMetaId: number): Observable<FileMeta> {
    const url = this.apiRoot + this.endpoints.file
      .replace('{file_id}', fileMetaId.toString());

    return this.httpClient
      .get<FileMeta>(url)
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

  /** getUser */
  public getUser(): Observable<User> {
    if (localStorage.getItem('token')) {
      return this.httpClient.get<User>(this.apiRoot + this.endpoints.user)
        .pipe(catchError(this._handleError));
    } else {
      return of(null);
    }
  }

  /** openSession */
  openSession(userParams: UserParams) {
    if (!this.environment.production) {
      const queryString = this._userParamsToQueryString(userParams);
      this._openUrl(this.apiRoot + this.endpoints.fakeSession + queryString);
    } else {
      return this.getUser();
    }
  }

  private _handleError(error: ApiError): Observable<never> {
    return throwError(error.message || 'Could not complete your request; please try again later.');
  }

  /** Construct HeaderParams from UserParams object. Only adds params that have been set. */
  private _userParamsToQueryString(userParams: UserParams): string {
    let queryString = '?';
    const keys = Object.keys(userParams);
    keys.forEach((k, i) => {
      const val = userParams[k];
      if ((val !== undefined) && (val !== null)) {
        queryString += k + '=' + encodeURIComponent(val.toString());
      }

      if (i < keys.length - 1) {
        queryString += '&';
      }
    });
    return queryString;
  }

  /** Construct HttpParams from FileParams object. Only adds params that have been set. */
  private _fileParamsToHttpParams(fileParams: FileParams): HttpParams {
    const paramsObject = {};
    Object.keys(fileParams).forEach(k => {
      const val = fileParams[k];
      if ((val !== undefined) && (val !== null)) {
        paramsObject[k] = val.toString();
      }
    });
    return new HttpParams({fromObject: paramsObject});
  }

  private _openUrl(url: string) {
    location.href = url;
  }
}
