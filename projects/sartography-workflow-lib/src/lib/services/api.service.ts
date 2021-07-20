import { APP_BASE_HREF } from '@angular/common';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of, throwError, timer } from 'rxjs';
import { catchError, debounce } from 'rxjs/operators';
import { ApiError } from '../types/api';
import { AppEnvironment } from '../types/app-environment';
import { Approval, ApprovalCounts, ApprovalStatus } from '../types/approval';
import { DocumentDirectory, FileMeta, FileParams, LookupData } from '../types/file';
import { ScriptInfo } from '../types/script-info';
import { Study } from '../types/study';
import { TaskAction, TaskEvent } from '../types/task-event';
import { User } from '../types/user';
import { Workflow, WorkflowSpec, WorkflowSpecCategory } from '../types/workflow';
import { WorkflowTask } from '../types/workflow-task';
import { isSignedIn } from '../util/is-signed-in';


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
    listScripts: '/list_scripts',
    sendEmail: '/send_email',
    renderDocx: '/render_docx',
    renderMarkdown: '/render_markdown',

    // Users
    login: '/login',
    user: '/user',
    userList: '/list_users',

    // Studies
    studyList: '/study',
    study: '/study/{study_id}',
    studyApprovals: '/study/{study_id}/approvals',
    studyAssociates: '/study/{study_id}/associates',

    // Approvals
    approvalCounts: '/approval-counts',
    approvalList: '/approval',
    approval: '/approval/{approval_id}',

    // Workflow Specifications
    workflowSpecList: '/workflow-specification',
    workflowSpec: '/workflow-specification/{spec_id}',
    workflowSpecListStandalone: '/workflow-specification/standalone',
    workflowSpecListLibraries: '/workflow-specification/libraries',
    workflowSpecValidate: '/workflow-specification/{spec_id}/validate',

    // Workflow Specification Category
    workflowSpecCategoryList: '/workflow-specification-category',
    workflowSpecCategory: '/workflow-specification-category/{cat_id}',

    // Document Directory
    documentDirectory: '/document_directory/{study_id}',

    // Workflows and Tasks
    taskEvents: '/task_events',
    workflow: '/workflow/{workflow_id}',
    workflowRestart: '/workflow/{workflow_id}/restart',
    taskForWorkflow: '/workflow/{workflow_id}/task/{task_id}',
    taskDataForWorkflow: '/workflow/{workflow_id}/task/{task_id}/data',
    setCurrentTaskForWorkflow: '/workflow/{workflow_id}/task/{task_id}/set_token',
    fieldOptionsLookup: '/workflow/{workflow_id}/lookup/{task_spec_name}/{field_id}',
    // Tools
    eval: '/eval',
  };

  constructor(
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
    @Inject(APP_BASE_HREF) public baseHref: string,
    private httpClient: HttpClient,
  ) {
    this.apiRoot = environment.api;
  }

  private static _handleError(error: ApiError): Observable<never> {
    return throwError(error.message || 'Could not complete your request; please try again later.');
  }


  /** Get the string value from a given URL */
  getStringFromUrl(url: string): Observable<string> {
    return this.httpClient
      .get(url, { responseType: 'text' })
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Get all Studies */
  getStudies(): Observable<Study[]> {
    const url = this.apiRoot + this.endpoints.studyList;

    return this.httpClient
      .get<Study[]>(url)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Add a Study */
  addStudy(study: Study): Observable<Study> {
    const url = this.apiRoot + this.endpoints.studyList;

    return this.httpClient
      .post<Study>(url, study)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Get a specific Study */
  getDocumentDirectory(studyId: number, workflowId?: number): Observable<DocumentDirectory[]> {
    let url = this.apiRoot + this.endpoints.documentDirectory
      .replace('{study_id}', studyId.toString());
    if (workflowId) {
      url = url + '?workflow_id=' + workflowId.toString();
    }
    return this.httpClient
      .get<DocumentDirectory[]>(url)
      .pipe(catchError(err => ApiService._handleError(err)));
  }


  /** Get a specific Study */
  getStudy(studyId: number, updateStatus = false): Observable<Study> {
    let params = new HttpParams();
    params = params.set('update_status', String(updateStatus));


    const url = this.apiRoot + this.endpoints.study
      .replace('{study_id}', studyId.toString());

    return this.httpClient
      .get<Study>(url, { params })
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Update a specific Study */
  updateStudy(studyId: number, study: Study): Observable<Study> {
    const url = this.apiRoot + this.endpoints.study
      .replace('{study_id}', studyId.toString());

    return this.httpClient
      .put<Study>(url, study)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Delete a specific Study */
  deleteStudy(studyId: number): Observable<null> {
    const url = this.apiRoot + this.endpoints.study
      .replace('{study_id}', studyId.toString());

    return this.httpClient
      .delete<null>(url)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Return all users related to a study and their access + role */
  getStudyAssociates(studyId: number): Observable<StudyAssociate[]> {
    const url = this.apiRoot + this.endpoints.studyAssociates
      .replace('{study_id}', studyId.toString());

    return this.httpClient
      .get<StudyAssociate[]>(url)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Get a specific Study */
  getStudyApprovals(studyId: number): Observable<Approval[]> {
    const url = this.apiRoot + this.endpoints.studyApprovals
      .replace('{study_id}', studyId.toString());

    return this.httpClient
      .get<Approval[]>(url)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Get Approval counts by status */
  getApprovalCounts(asUser: string): Observable<ApprovalCounts> {
    let params = new HttpParams();
    if (asUser) {
      params = params.set('as_user', asUser);
    }

    const url = this.apiRoot + this.endpoints.approvalCounts;
    return this.httpClient
      .get<ApprovalCounts>(url, { params })
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Get all Approvals */
  getApprovals(status?: ApprovalStatus, asUser = null): Observable<Approval[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status.valueOf());
    } else {
      params = params.set('status', ApprovalStatus.PENDING.valueOf());
    }
    if (asUser) {
      params = params.set('as_user', asUser);
    }
    const url = this.apiRoot + this.endpoints.approvalList;
    return this.httpClient
      .get<Approval[]>(url, { params })
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Update a single Approval */
  updateApproval(approval: Approval): Observable<Approval> {
    const url = this.apiRoot + this.endpoints.approval
      .replace('{approval_id}', approval.id.toString());
    return this.httpClient
      .put<Approval>(url, approval)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Get all Workflow Specifications */
  getWorkflowSpecList(): Observable<WorkflowSpec[]> {
    const url = this.apiRoot + this.endpoints.workflowSpecList;

    return this.httpClient
      .get<WorkflowSpec[]>(url)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Add a Workflow Specification */
  addWorkflowSpecification(newSpec: WorkflowSpec): Observable<WorkflowSpec> {
    const url = this.apiRoot + this.endpoints.workflowSpecList;

    return this.httpClient
      .post<WorkflowSpec>(url, newSpec)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Get a Workflow Specification */
  getWorkflowSpecification(specId: string): Observable<WorkflowSpec> {
    const url = this.apiRoot + this.endpoints.workflowSpec
      .replace('{spec_id}', specId);

    return this.httpClient
      .get<WorkflowSpec>(url)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Get a list of standalone workflows */
  getWorkflowSpecificationStandalone(): Observable<WorkflowSpec[]> {
    const url = this.apiRoot + this.endpoints.workflowSpecListStandalone;

    return this.httpClient
      .get<WorkflowSpec[]>(url)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Get a list of standalone workflows */
  getWorkflowSpecificationLibraries(): Observable<WorkflowSpec[]> {
    const url = this.apiRoot + this.endpoints.workflowSpecListLibraries;

    return this.httpClient
      .get<WorkflowSpec[]>(url)
      .pipe(catchError(err => ApiService._handleError(err)));
  }


  /** Get a workflow from a workflow spec */
  getWorkflowFromSpec(workflowSpecId: string): Observable<Workflow> {
    const url = this.apiRoot + this.endpoints.workflowSpec
      .replace('{spec_id}', workflowSpecId);

    return this.httpClient
      .post<Workflow>(url, {})
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Validate a Workflow Specification */
  validateWorkflowSpecification(specId: string, testUntil: string = '', studyId?: number): Observable<ApiError[]> {
    let params = new HttpParams();
    if (testUntil !== '') params = params.set('test_until', String(testUntil));
    if (studyId) params = params.set('study_id', studyId.toString());
    const url = this.apiRoot + this.endpoints.workflowSpecValidate.replace('{spec_id}', specId);
    return this.httpClient.get<ApiError[]>(url, { params })
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Update a Workflow Specification */
  updateWorkflowSpecification(specId: string, newSpec: WorkflowSpec): Observable<WorkflowSpec> {
    const url = this.apiRoot + this.endpoints.workflowSpec
      .replace('{spec_id}', specId);

    return this.httpClient
      .put<WorkflowSpec>(url, newSpec)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Delete a Workflow Specification */
  deleteWorkflowSpecification(specId: string): Observable<null> {
    const url = this.apiRoot + this.endpoints.workflowSpec
      .replace('{spec_id}', specId);

    return this.httpClient
      .delete<null>(url)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Get all Workflow Spec Categories */
  getWorkflowSpecCategoryList(): Observable<WorkflowSpecCategory[]> {
    const url = this.apiRoot + this.endpoints.workflowSpecCategoryList;

    return this.httpClient
      .get<WorkflowSpecCategory[]>(url)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Add a Workflow Specification */
  addWorkflowSpecCategory(newCat: WorkflowSpecCategory): Observable<WorkflowSpecCategory> {
    const url = this.apiRoot + this.endpoints.workflowSpecCategoryList;

    return this.httpClient
      .post<WorkflowSpecCategory>(url, newCat)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Get a Workflow Spec Category */
  getWorkflowSpecCategory(catId: number): Observable<WorkflowSpecCategory> {
    const url = this.apiRoot + this.endpoints.workflowSpecCategory
      .replace('{cat_id}', catId.toString());

    return this.httpClient
      .get<WorkflowSpecCategory>(url)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Update a Workflow Spec Category */
  updateWorkflowSpecCategory(catId: number, newCat: WorkflowSpecCategory): Observable<WorkflowSpecCategory> {
    const url = this.apiRoot + this.endpoints.workflowSpecCategory
      .replace('{cat_id}', catId.toString());

    return this.httpClient
      .put<WorkflowSpecCategory>(url, newCat)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Delete a Workflow Spec Category */
  deleteWorkflowSpecCategory(catId: number): Observable<null> {
    const url = this.apiRoot + this.endpoints.workflowSpecCategory
      .replace('{cat_id}', catId.toString());

    return this.httpClient
      .delete<null>(url)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Get all File Metadata for a given Workflow Specification, Workflow Instance, Study, or Task */
  getFileMetas(fileParams: FileParams): Observable<FileMeta[]> {
    const url = this.apiRoot + this.endpoints.fileList;
    const params = this._paramsToHttpParams(fileParams);

    return this.httpClient
      .get<FileMeta[]>(url, { params })
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Get all Files and their File Metadata for a running workflow */
  listWorkflowFiles(workflowId: number): Observable<FileMeta[]> {
    const url = this.apiRoot + this.endpoints.fileList;
    const params = new HttpParams().set('workflow_id', workflowId.toString());
    return this.httpClient
      .get<FileMeta[]>(url, { params })
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Add a File */
  addFile(fileParams: FileParams, fileMeta: FileMeta, file: File): Observable<FileMeta> {
    const url = this.apiRoot + this.endpoints.fileList;
    const params = this._paramsToHttpParams(fileParams);
    const formData = new FormData();
    formData.append('file', file);

    return this.httpClient
      .post<FileMeta>(url, formData, { params })
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Get metadata for one specific File */
  getFileMeta(fileMetaId: number): Observable<FileMeta> {
    const url = this.apiRoot + this.endpoints.file
      .replace('{file_id}', fileMetaId.toString());

    return this.httpClient
      .get<FileMeta>(url)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Update File Metadata */
  updateFileMeta(fileMeta: FileMeta): Observable<FileMeta> {
    const url = this.apiRoot + this.endpoints.file
      .replace('{file_id}', fileMeta.id.toString());

    return this.httpClient
      .put<FileMeta>(url, fileMeta)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  deleteFileMeta(fileMetaId: number): Observable<null> {
    const url = this.apiRoot + this.endpoints.file
      .replace('{file_id}', fileMetaId.toString());

    return this.httpClient
      .delete<null>(url)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Get the File Data for specific File Metadata */
  getFileData(fileId: number): Observable<HttpResponse<ArrayBuffer>> {
    const url = this.apiRoot + this.endpoints.fileData
      .replace('{file_id}', fileId.toString());

    return this.httpClient
      .get(url, { observe: 'response', responseType: 'arraybuffer' })
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Update the File Data for specific File Metadata */
  updateFileData(fileMeta: FileMeta, file: File): Observable<FileMeta> {
    const url = this.apiRoot + this.endpoints.fileData
      .replace('{file_id}', fileMeta.id.toString());
    const formData = new FormData();
    formData.append('file', file);

    return this.httpClient
      .put<FileMeta>(url, formData)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Get Task Events */
  getTaskEvents(action?: TaskAction, studyId?: number, workflowId?: number): Observable<TaskEvent[]> {
    const url = this.apiRoot + this.endpoints.taskEvents;
    let httpParams = new HttpParams();
    if (action) httpParams = httpParams.set('action', action);
    if (studyId) httpParams = httpParams.set('study', studyId.toString());
    if (workflowId) httpParams = httpParams.set('workflow', workflowId.toString());

    return this.httpClient
      .get<TaskEvent[]>(url + '?' + httpParams.toString())
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Get a specific Workflow */
  getWorkflow(workflowId: number, doEngineSteps: boolean = true): Observable<Workflow> {
    let params = new HttpParams();
    params = params.set('do_engine_steps', doEngineSteps.toString());
    const url = this.apiRoot + this.endpoints.workflow
      .replace('{workflow_id}', workflowId.toString());

    return this.httpClient
      .get<Workflow>(url, { params })
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  restartWorkflow(workflowId: number, clearData: boolean = false, deleteFiles: boolean = false): Observable<Workflow> {
    let params = new HttpParams();
    params = params.set('clear_data', clearData.toString());
    params = params.set('delete_files', deleteFiles.toString());
    const url = this.apiRoot + this.endpoints.workflowRestart
      .replace('{workflow_id}', workflowId.toString());

    return this.httpClient
      .get<Workflow>(url, { params })
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Get a specific Task for a Workflow */
  getTaskForWorkflow(workflowId: number, taskId: string): Observable<WorkflowTask> {
    const url = this.apiRoot + this.endpoints.taskForWorkflow
      .replace('{workflow_id}', workflowId.toString())
      .replace('{task_id}', taskId);

    return this.httpClient.get<WorkflowTask>(url)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Update Task Data for a specific Workflow Task
   * The updateAll flag will cause all remaining tasks in a multistance task to receive the same values.
   */
  updateTaskDataForWorkflow(workflowId: number, taskId: string, data: any, updateAll = false, terminateLoop = false): Observable<Workflow> {
    let url = this.apiRoot + this.endpoints.taskDataForWorkflow
      .replace('{workflow_id}', workflowId.toString())
      .replace('{task_id}', taskId);

    let httpParams = new HttpParams();

    if (updateAll) {
      httpParams = httpParams.append('update_all', 'True');
    }
    if (terminateLoop) {
      httpParams = httpParams.append('terminate_loop', 'True')
    }

    if (httpParams.toString() !== '') {
      url = url + '?' + httpParams.toString()
    }

    return this.httpClient.put<Workflow>(url, data)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Update Task Data for a specific Workflow Task */
  setCurrentTaskForWorkflow(workflowId: number, taskId: string): Observable<Workflow> {
    const url = this.apiRoot + this.endpoints.setCurrentTaskForWorkflow
      .replace('{workflow_id}', workflowId.toString())
      .replace('{task_id}', taskId);

    return this.httpClient.put<Workflow>(url, {})
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** listReferenceFiles */
  listReferenceFiles(): Observable<FileMeta[]> {
    const url = this.apiRoot + this.endpoints.referenceFileList;

    return this.httpClient
      .get<FileMeta[]>(url)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** getReferenceFile */
  getReferenceFile(name: string): Observable<HttpResponse<ArrayBuffer>> {
    const url = this.apiRoot + this.endpoints.referenceFile
      .replace('{name}', name);

    return this.httpClient
      .get(url, { observe: 'response', responseType: 'arraybuffer' })
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** updateReferenceFile */
  updateReferenceFile(name: string, newFile: File): Observable<HttpResponse<ArrayBuffer>> {
    const url = this.apiRoot + this.endpoints.referenceFile
      .replace('{name}', name);
    const formData = new FormData();
    formData.append('file', newFile);

    return this.httpClient
      .put(url, formData, { observe: 'response', responseType: 'arraybuffer' })
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** listScripts */
  listScripts(): Observable<ScriptInfo[]> {
    const url = this.apiRoot + this.endpoints.scriptList;

    return this.httpClient
      .get<ScriptInfo[]>(url)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** renderMarkdown */
  renderMarkdown(template: string, data: string)
  // : Observable<string>
  {
    const url = this.apiRoot + this.endpoints.renderMarkdown;

    const params = new HttpParams()
    .append('template', template)
    .append('data', data);

    return this.httpClient
      .get<string>(url, { params })
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** renderDocx */
  renderDocx()
  {
    const url = this.apiRoot + this.endpoints.renderDocx;

    // return this.httpClient
    //   .get<ScriptInfo[]>(url)
    //   .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** sendEmail */
  sendEmail() {
    const url = this.apiRoot + this.endpoints.sendEmail;

    // return this.httpClient
    //   .get<ScriptInfo[]>(url)
    //   .pipe(catchError(err => ApiService._handleError(err)));
  }



  /** isSignedIn */
  isSignedIn(): boolean {
    if (this.environment.production) {
      return true;
    } else {
      return isSignedIn();
    }
  }

  /** listUsers */
  listUsers(): Observable<User[]> {
    const url = this.apiRoot + this.endpoints.userList;
    return this.httpClient
      .get<User[]>(url)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** getUser
   *
   *  adminImpersonateUid: string
   *    If the currently-logged-in user is an admin, will return the user with the given uid. If the uid
   *    is not provided or invalid, impersonation mode will be turned off.
   *
   */
  getUser(adminImpersonateUid?: string): Observable<User> {
    if (isSignedIn()) {
      const url = this.apiRoot + this.endpoints.user;
      const httpParams = new HttpParams().append('admin_impersonate_uid', adminImpersonateUid);
      const queryString = adminImpersonateUid ? '?' + httpParams.toString() : '';
      return this.httpClient
        .get<User>(url + queryString)
        .pipe(catchError(err => ApiService._handleError(err)));
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
    let httpParams = new HttpParams().set('redirect_url', returnUrl);
    if (!this.environment.production) {
      httpParams = httpParams.set('uid', 'dhf8r');
    }

    this.openUrl(this.apiRoot + this.endpoints.login + '?' + httpParams.toString());
  }

  openUrl(url) {
    location.href = url
  }

  /** lookupFieldOptions */
  lookupFieldOptions(query: string, fileParams: FileParams, limit = 5): Observable<LookupData[]> {
    const url = this.apiRoot + this.endpoints.fieldOptionsLookup
      .replace('{workflow_id}', fileParams.workflow_id.toString())
      .replace('{task_spec_name}', fileParams.task_spec_name.toString())
      .replace('{field_id}', fileParams.form_field_key);

    if (fileParams.task_spec_name === null) {
      return throwError('The task spec name is not defined. Lookups will fail');
    }


    // Initialize Params Object
    const params = new HttpParams()
      .append('query', query)
      .append('limit', limit.toString());

    return this.httpClient
      .get<LookupData[]>(url, { params })
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Evaluate an expression using the api, which should return a true or false value */
  eval(expression: string, data: any, key: string): Observable<any> {
    const url = this.apiRoot + this.endpoints.eval;
    const body = {expression, data, key};
    return this.httpClient.put<any>(url, body)
      .pipe(debounce(() => timer(10000)));
  }

  /** Construct HttpParams from params object. Only adds params that have been set. */
  private _paramsToHttpParams(params: any): HttpParams {
    const paramsObject = {};
    Object.keys(params).forEach(k => {
      const val = params[k];
      if ((val !== undefined) && (val !== null)) {
        paramsObject[k] = val.toString();
      }
    });
    return new HttpParams({ fromObject: paramsObject });
  }
}
