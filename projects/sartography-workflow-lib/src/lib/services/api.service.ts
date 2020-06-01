import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ApiError} from '../types/api';
import {AppEnvironment} from '../types/app-environment';
import {FileMeta, FileParams, LookupData} from '../types/file';
import {ScriptInfo} from '../types/script-info';
import {WorkflowStats} from '../types/stats';
import {Study} from '../types/study';
import {Approval} from '../types/approval';
import {User, UserParams} from '../types/user';
import {Workflow, WorkflowResetParams, WorkflowSpec, WorkflowSpecCategory} from '../types/workflow';
import {WorkflowTask} from '../types/workflow-task';
import {isSignedIn} from '../util/is-signed-in';
import {Router, UrlSerializer} from '@angular/router';
import {APP_BASE_HREF, Location} from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiRoot: string;

  endpoints = {
    // Files
    fileList: '/file',
    file: '/file/{file_id}',
    fileData: '/file/{file_id}/data',
    referenceFileList: '/reference_file',
    referenceFile: '/reference_file/{name}',

    // Configurator Tools
    scriptList: '/list_scripts',
    renderDocx: '/render_docx',
    renderMarkdown: '/render_markdown',

    // Users
    fakeSession: '/sso_backdoor',
    realSession: '/login',
    user: '/user',

    // Studies
    studyList: '/study',
    study: '/study/{study_id}',
    studyApprovals: '/study/{study_id}/approvals',

    // Approvals
    approvalList: '/approval',
    approval: '/approval/{approval_id}',

    // Workflow Specifications
    workflowSpecList: '/workflow-specification',
    workflowSpec: '/workflow-specification/{spec_id}',
    workflowSpecValidate: '/workflow-specification/{spec_id}/validate',

    // Workflow Specification Category
    workflowSpecCategoryList: '/workflow-specification-category',
    workflowSpecCategory: '/workflow-specification-category/{cat_id}',

    // Workflows and Tasks
    workflow: '/workflow/{workflow_id}',
    workflowStats: '/workflow/{workflow_id}/stats',
    taskForWorkflow: '/workflow/{workflow_id}/task/{task_id}',
    taskDataForWorkflow: '/workflow/{workflow_id}/task/{task_id}/data',
    setCurrentTaskForWorkflow: '/workflow/{workflow_id}/task/{task_id}/set_token',
    fieldOptionsLookup: '/workflow/{workflow_id}/lookup/{field_id}',
  };

  constructor(
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
    @Inject(APP_BASE_HREF) public baseHref: string,
    private httpClient: HttpClient,
    private router: Router,
    private location: Location) {
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

  /** Get a specific Study */
  getStudyApprovals(studyId: number): Observable<Approval[]> {
    const url = this.apiRoot + this.endpoints.studyApprovals
      .replace('{study_id}', studyId.toString());

    return this.httpClient
      .get<Approval[]>(url)
      .pipe(catchError(this._handleError));
  }

  /** Get all Approvals */
  getApprovals(): Observable<Approval[]> {
    const url = this.apiRoot + this.endpoints.approvalList;

    return this.httpClient
      .get<Approval[]>(url)
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

  /** Get a Workflow Specification */
  getWorkflowSpecification(specId: string): Observable<WorkflowSpec> {
    const url = this.apiRoot + this.endpoints.workflowSpec
      .replace('{spec_id}', specId);

    return this.httpClient
      .get<WorkflowSpec>(url)
      .pipe(catchError(this._handleError));
  }

  /** Validate a Workflow Specification */
  validateWorkflowSpecification(specId: string): Observable<ApiError[]> {
    const url = this.apiRoot + this.endpoints.workflowSpecValidate
      .replace('{spec_id}', specId);

    return this.httpClient
      .get<ApiError[]>(url)
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

  /** Delete a Workflow Specification */
  deleteWorkflowSpecification(specId: string): Observable<null> {
    const url = this.apiRoot + this.endpoints.workflowSpec
      .replace('{spec_id}', specId);

    return this.httpClient
      .delete<null>(url)
      .pipe(catchError(this._handleError));
  }

  /** Get all Workflow Spec Categories */
  getWorkflowSpecCategoryList(): Observable<WorkflowSpecCategory[]> {
    const url = this.apiRoot + this.endpoints.workflowSpecCategoryList;

    return this.httpClient
      .get<WorkflowSpecCategory[]>(url)
      .pipe(catchError(this._handleError));
  }

  /** Add a Workflow Specification */
  addWorkflowSpecCategory(newCat: WorkflowSpecCategory): Observable<WorkflowSpecCategory> {
    const url = this.apiRoot + this.endpoints.workflowSpecCategoryList;

    return this.httpClient
      .post<WorkflowSpecCategory>(url, newCat)
      .pipe(catchError(this._handleError));
  }

  /** Get a Workflow Spec Category */
  getWorkflowSpecCategory(catId: number): Observable<WorkflowSpecCategory> {
    const url = this.apiRoot + this.endpoints.workflowSpecCategory
      .replace('{cat_id}', catId.toString());

    return this.httpClient
      .get<WorkflowSpecCategory>(url)
      .pipe(catchError(this._handleError));
  }

  /** Update a Workflow Spec Category */
  updateWorkflowSpecCategory(catId: number, newCat: WorkflowSpecCategory): Observable<WorkflowSpecCategory> {
    const url = this.apiRoot + this.endpoints.workflowSpecCategory
      .replace('{cat_id}', catId.toString());

    return this.httpClient
      .put<WorkflowSpecCategory>(url, newCat)
      .pipe(catchError(this._handleError));
  }

  /** Delete a Workflow Spec Category */
  deleteWorkflowSpecCategory(catId: number): Observable<null> {
    const url = this.apiRoot + this.endpoints.workflowSpecCategory
      .replace('{cat_id}', catId.toString());

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
  getFileData(fileId: number): Observable<HttpResponse<ArrayBuffer>> {
    const url = this.apiRoot + this.endpoints.fileData
      .replace('{file_id}', fileId.toString());

    return this.httpClient
      .get(url, {observe: 'response', responseType: 'arraybuffer'})
      .pipe(catchError(this._handleError));
  }

  /** Update the File Data for specific File Metadata */
  updateFileData(fileMeta: FileMeta): Observable<FileMeta> {
    const url = this.apiRoot + this.endpoints.fileData
      .replace('{file_id}', fileMeta.id.toString());
    const formData = new FormData();
    formData.append('file', fileMeta.file);

    return this.httpClient
      .put<FileMeta>(url, formData)
      .pipe(catchError(this._handleError));
  }

  /** Get a specific Workflow */
  getWorkflow(workflowId: number, params?: WorkflowResetParams): Observable<Workflow> {
    const queryString = params ? this._paramsToQueryString(params) : '';
    const url = this.apiRoot + this.endpoints.workflow
      .replace('{workflow_id}', workflowId.toString());

    return this.httpClient
      .get<Workflow>(url + queryString)
      .pipe(catchError(this._handleError));
  }

  /** Get a specific Workflow */
  getWorkflowStats(workflowId: number): Observable<WorkflowStats> {
    const url = this.apiRoot + this.endpoints.workflowStats
      .replace('{workflow_id}', workflowId.toString());

    return this.httpClient
      .get<WorkflowStats>(url)
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

  /** Update Task Data for a specific Workflow Task */
  setCurrentTaskForWorkflow(workflowId: number, taskId: string): Observable<Workflow> {
    const url = this.apiRoot + this.endpoints.setCurrentTaskForWorkflow
      .replace('{workflow_id}', workflowId.toString())
      .replace('{task_id}', taskId);

    return this.httpClient.put<Workflow>(url, {})
      .pipe(catchError(this._handleError));
  }

  /** listReferenceFiles */
  listReferenceFiles(): Observable<FileMeta[]> {
    const url = this.apiRoot + this.endpoints.referenceFileList;

    return this.httpClient
      .get<FileMeta[]>(url)
      .pipe(catchError(this._handleError));
  }

  /** getReferenceFile */
  getReferenceFile(name: string): Observable<HttpResponse<ArrayBuffer>> {
    const url = this.apiRoot + this.endpoints.referenceFile
      .replace('{name}', name);

    return this.httpClient
      .get(url, {observe: 'response', responseType: 'arraybuffer'})
      .pipe(catchError(this._handleError));
  }

  /** updateReferenceFile */
  updateReferenceFile(name: string, newFile: File): Observable<HttpResponse<ArrayBuffer>> {
    const url = this.apiRoot + this.endpoints.referenceFile
      .replace('{name}', name);
    const formData = new FormData();
    formData.append('file', newFile);

    return this.httpClient
      .put(url, formData, {observe: 'response', responseType: 'arraybuffer'})
      .pipe(catchError(this._handleError));
  }

  /** listScripts */
  listScripts(): Observable<ScriptInfo[]> {
    const url = this.apiRoot + this.endpoints.scriptList;

    return this.httpClient
      .get<ScriptInfo[]>(url)
      .pipe(catchError(this._handleError));
  }

  /** isSignedIn */
  isSignedIn(): boolean {
    if (this.environment.production) {
      return true;
    } else {
      return isSignedIn();
    }
  }

  /** getUser */
  getUser(): Observable<User> {
    if (isSignedIn()) {
      const url = this.apiRoot + this.endpoints.user;
      console.log('getUser url', url);
      return this.httpClient
        .get<User>(url)
        .pipe(catchError(this._handleError));
    } else {
      return of(null);
    }
  }

  /** openSession */
  redirectToLogin() {
    // get the url of the page the user is currently on, and save it in
    // local storage.
    localStorage.setItem('prev_url', location.href);
    const returnUrl = location.origin + this.baseHref + 'session';
    console.log('Should return to ' + returnUrl);
    let httpParams = new HttpParams().set('redirect', returnUrl);
    if (!this.environment.production) {
      httpParams = httpParams.set('uid', 'dhf8r');
      this.openUrl(this.apiRoot + this.endpoints.fakeSession + '?' + httpParams.toString());
    } else {
      this.openUrl(this.apiRoot + this.endpoints.realSession + '?' + httpParams.toString());
    }
  }

  openUrl(url) {
    location.href = url
  }

  /** lookupFieldOptions */
  lookupFieldOptions(query: string, fileParams: FileParams, limit = 5): Observable<LookupData[]> {
    const url = this.apiRoot + this.endpoints.fieldOptionsLookup
      .replace('{workflow_id}', fileParams.workflow_id.toString())
      .replace('{field_id}', fileParams.form_field_key);

    // Initialize Params Object
    const params = new HttpParams()
      .append('query', query)
      .append('limit', limit.toString());

    return this.httpClient
      .get<LookupData[]>(url, {params})
      .pipe(catchError(this._handleError));
  }

  private _handleError(error: ApiError): Observable<never> {
    return throwError(error.message || 'Could not complete your request; please try again later.');
  }

  /** Construct Query String Params from UserParams or WorkflowResetParams object. Only adds params that have been set. */
  private _paramsToQueryString(params: UserParams|WorkflowResetParams): string {
    let queryString = '?';
    const keys = Object.keys(params);
    keys.forEach((k, i) => {
      const val = params[k];
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
}
