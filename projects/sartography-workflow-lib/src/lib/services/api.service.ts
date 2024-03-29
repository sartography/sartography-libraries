import { APP_BASE_HREF } from '@angular/common';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of, throwError, timer } from 'rxjs';
import { catchError, debounce } from 'rxjs/operators';
import { ApiError } from '../types/api';
import { AppEnvironment } from '../types/app-environment';
import { Approval, ApprovalCounts, ApprovalStatus } from '../types/approval';
import { DocumentDirectory, FileMeta, FileParams } from '../types/file';
import { ScriptInfo } from '../types/script-info';
import { Study , StudyAssociate} from '../types/study';
import { TaskAction, TaskEvent } from '../types/task-event';
import { User } from '../types/user';
import { Workflow, WorkflowSpec, WorkflowSpecCategory } from '../types/workflow';
import { WorkflowTask } from '../types/workflow-task';
import { isSignedIn } from '../util/is-signed-in';
import {TaskLogQuery} from '../types/task-log';
import {GitRepo} from "../types/git";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiRoot: string;

  endpoints = {
    // User Files
    fileList: '/file',
    file: '/file/{file_id}',
    fileData: '/file/{file_id}/data',
    ssDMN: '/dmn_from_ss',


    // Workflow Specification Files
    specFileList: '/workflow-specification/{spec_id}/file',
    specFile: '/workflow-specification/{spec_id}/file/{file_name}',
    specFileData: '/workflow-specification/{spec_id}/file/{file_name}/data',
    specFileFilename: '/workflow-specification/{spec_id}/file/{file_name}/filename',

    // Reference Files
    referenceFileList: '/reference_file',
    referenceFile: '/reference_file/{name}',
    referenceFileData: '/reference_file/{name}/data',

    // Configurator Tools
    scriptList: '/list_scripts',
    renderDocx: '/render_docx',
    renderMarkdown: '/render_markdown',

    // Users
    login: '/login',
    user: '/user',
    userList: '/list_users',
    ldap: '/ldap',

    // Studies
    studyList: '/study',
    study: '/study/{study_id}',
    studyApprovals: '/study/{study_id}/approvals',
    studyAssociates: '/study/{study_id}/associates',
    studyLogs: '/study/{study_id}/log',

    // Approvals
    approvalCounts: '/approval-counts',
    approvalList: '/approval',
    approval: '/approval/{approval_id}',

    // Workflow Specifications
    workflowSpecList: '/workflow-specification',
    workflowSpec: '/workflow-specification/{spec_id}',
    workflowSpecListStandalone: '/workflow-specification?standalone=true',
    workflowSpecListLibraries: '/workflow-specification?libraries=true',
    updateWorkflowLibrary: '/workflow-specification/{spec_id}/library/{library_id}',
    workflowSpecValidate: '/workflow-specification/{spec_id}/validate',
    reorderWorkflowSpecification: '/workflow-specification/{spec_id}/reorder',

    // Workflow Specification Category
    workflowSpecCategoryList: '/workflow-specification-category',
    workflowSpecCategory: '/workflow-specification-category/{cat_id}',
    reorderWorkflowCategory: '/workflow-specification-category/{cat_id}/reorder',

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
    workflowLogs: '/workflow/{workflow_id}/log',

    // Git Repo
    gitRepo: '/git_repo',
    gitRepoMerge: '/git_repo/merge',
    gitRepoPush: '/git_repo/push',
    gitRepoPull: '/git_repo/pull',

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

  getDocumentDirectory(studyId: number, workflowId?: number, includeArchived?: boolean): Observable<DocumentDirectory[]> {
    let url = this.apiRoot + this.endpoints.documentDirectory
      .replace('{study_id}', studyId.toString());
    let params = new HttpParams();
    if (workflowId) {
      params = params.set('workflow_id', workflowId);
    }
    if (includeArchived) {
      params = params.set('include_archived', includeArchived);
    }
    return this.httpClient
      .get<DocumentDirectory[]>(url, {params})
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

  /** Get logs for a Study */
  getStudyLogs(studyId: number, query: TaskLogQuery): Observable<TaskLogQuery> {
    const url = this.apiRoot + this.endpoints.studyLogs
      .replace('{study_id}', studyId.toString());

    return this.httpClient
      .put<TaskLogQuery>(url, query)
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

  /** Delete a library from a workflow */
  deleteWorkflowLibrary(workflowSpecId: string, librarySpecId: string): Observable<null> {
    const url = this.apiRoot + this.endpoints.updateWorkflowLibrary
      .replace('{spec_id}', workflowSpecId)
      .replace('{library_id}', librarySpecId);
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


  /** Add a library to a workflow */
  addWorkflowLibrary(workflowSpecId: string, librarySpecId: string): Observable<null> {
    const url = this.apiRoot + this.endpoints.updateWorkflowLibrary
      .replace('{spec_id}', workflowSpecId)
      .replace('{library_id}', librarySpecId);
    return this.httpClient
      .post<null>(url,'')
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

    if (testUntil !== '') {
      params = params.set('test_until', String(testUntil));
    }

    if (studyId) {
      params = params.set('study_id', studyId.toString());
    }

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
  getWorkflowSpecCategory(catId: string): Observable<WorkflowSpecCategory> {
    const url = this.apiRoot + this.endpoints.workflowSpecCategory
      .replace('{cat_id}', catId);

    return this.httpClient
      .get<WorkflowSpecCategory>(url)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Update a Workflow Spec Category */
  updateWorkflowSpecCategory(catId: string, newCat: WorkflowSpecCategory): Observable<WorkflowSpecCategory> {
    const url = this.apiRoot + this.endpoints.workflowSpecCategory
      .replace('{cat_id}', catId);

    return this.httpClient
      .put<WorkflowSpecCategory>(url, newCat)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Delete a Workflow Spec Category */
  deleteWorkflowSpecCategory(catId: string): Observable<null> {
    const url = this.apiRoot + this.endpoints.workflowSpecCategory
      .replace('{cat_id}', catId);

    return this.httpClient
      .delete<null>(url)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  getSpecFileMetas(workflowSpecId: string) {
    const url = this.apiRoot + this.endpoints.specFileList
          .replace('{spec_id}', workflowSpecId.toString());

    let params = new HttpParams();
    params = params.set("workflow_spec_id", workflowSpecId)
    return this.httpClient
      .get<FileMeta[]>(url, { params })
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Get all User uploaded File Metadata for a given Workflow Instance, Study, or Task */
  getFileMetas(fileParams: FileParams): Observable<FileMeta[]> {
    const url = this.apiRoot + this.endpoints.fileList;
    const params = this._paramsToHttpParams(fileParams);

    return this.httpClient
      .get<FileMeta[]>(url, { params })
      .pipe(catchError(err => ApiService._handleError(err)));
  }


  /** Reorder workflow spec categories */
  reorderWorkflowCategory(catId: string, direction: string): Observable<WorkflowSpecCategory[]> {
    const url = this.apiRoot + this.endpoints.reorderWorkflowCategory
      .replace('{cat_id}', catId);

    const params = new HttpParams().set('direction', direction);
    return this.httpClient
      .put<WorkflowSpecCategory[]>(url, {},{ params })
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Reorder workflow specs */
  reorderWorkflowSpecification(specId: string, direction: string): Observable<WorkflowSpec[]> {
    const url = this.apiRoot + this.endpoints.reorderWorkflowSpecification
      .replace('{spec_id}', specId);

    const params = new HttpParams().set('direction', direction);
    return this.httpClient
      .put<WorkflowSpec[]>(url, {},{ params })
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

  addSpecFile(workflowSpec: WorkflowSpec, fileMeta: FileMeta, file: File): Observable<FileMeta> {
    const fileParams = {workflow_spec_id: workflowSpec.id}
    const url = this.apiRoot + this.endpoints.specFileList
      .replace('{spec_id}', workflowSpec.id)
      .replace('{file_name}', file.name);
    const params = this._paramsToHttpParams(fileParams);
    const formData = new FormData();
    formData.append('file', file);

    return this.httpClient
      .post<FileMeta>(url, formData, { params })
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Add a File */
  addFile(fileParams: FileParams, fileMeta: FileMeta, file: File,
          base_url: string = this.endpoints.fileList): Observable<FileMeta> {
    const url = this.apiRoot + base_url;
    const params = this._paramsToHttpParams(fileParams);
    const formData = new FormData();
    formData.append('file', file);

    return this.httpClient
      .post<FileMeta>(url, formData, { params })
      .pipe(catchError(err => ApiService._handleError(err)));
  }

// TODO: this isnt used anywhere  but fileMetaID is definitely wrong
  getSpecFileMeta(workflowSpec: WorkflowSpec, fileName: string, fileMetaId: number): Observable<FileMeta> {
    const url = this.endpoints.specFile
      .replace('{spec_id}', workflowSpec.id)
      .replace('{file_name}', fileName)
    return this.getFileMeta(fileMetaId, url);
  }

  /** Get metadata for one specific File */
  getFileMeta(fileMetaId: number, base_url: String = this.endpoints.file): Observable<FileMeta> {
    const url = this.apiRoot + base_url
      .replace('{file_id}', fileMetaId.toString());

    return this.httpClient
      .get<FileMeta>(url)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Update the File metadata for Workflow Specification File */
  updateSpecFileMeta(workflowSpec: WorkflowSpec, fileMeta: FileMeta, is_primary: boolean): Observable<FileMeta> {
        // '/workflow-specification/{spec_id}/file/{file_name}',
    const url = this.apiRoot + this.endpoints.specFile
      .replace('{spec_id}', workflowSpec.id)
      .replace('{file_name}', fileMeta.name)

    const params = new HttpParams().set('is_primary', is_primary);

    return this.httpClient
      .put<FileMeta>(url, fileMeta, { params })
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  updateSpecFileFilename(workflowSpec: WorkflowSpec, fileMeta: FileMeta, newFilename: string): Observable<FileMeta> {
    const url = this.apiRoot + this.endpoints.specFileFilename
      .replace('{spec_id}', workflowSpec.id)
      .replace('{file_name}', fileMeta.name)

    const params = new HttpParams().set('new_filename', newFilename)

    return this.httpClient
      .put<FileMeta>(url, fileMeta, { params })
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Update File Metadata */
  updateFileMeta(fileMeta: FileMeta, base_url: String = this.endpoints.file): Observable<FileMeta> {
    const url = this.apiRoot + base_url
      .replace('{file_id}', fileMeta.id.toString());

    return this.httpClient
      .put<FileMeta>(url, fileMeta)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Delete the File metadata for Workflow Specification File */
  deleteSpecFileMeta(workflowSpec: WorkflowSpec, fileName: string): Observable<null> {
        // '/workflow-specification/{spec_id}/file/{file_name}',
    const url = this.apiRoot + this.endpoints.specFile
      .replace('{spec_id}', workflowSpec.id)
      .replace('{file_name}', fileName);

    return this.httpClient
      .delete<null>(url)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Delete the File metadata for Workflow Specification File */
  deleteRefFileMeta(fileMetaId: number): Observable<null> {
    return this.deleteFileMeta(fileMetaId, this.endpoints.referenceFile)
  }

  deleteFile(fileId: number, base_url: String = this.endpoints.file): Observable<null> {
    const url = this.apiRoot + base_url
      .replace('{file_id}', fileId.toString());

    return this.httpClient
      .delete<null>(url)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  deleteFileMeta(fileMetaId: number, base_url: String = this.endpoints.file): Observable<null> {
    const url = this.apiRoot + base_url
      .replace('{file_id}', fileMetaId.toString());

    return this.httpClient
      .delete<null>(url)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Get the File metadata for Workflow Specification File */
  getSpecFileData(workflowSpec: WorkflowSpec, fileName: string): Observable<HttpResponse<ArrayBuffer>> {
    const url = this.apiRoot + this.endpoints.specFileData
      .replace('{spec_id}', workflowSpec.id)
      .replace('{file_name}', fileName)

    return this.httpClient
      .get(url, {observe: 'response', responseType: 'arraybuffer'})
      .pipe(catchError(err => ApiService._handleError(err)));

  }

  /** Get the File Data for specific File Metadata */
  getFileData(fileId: number, base_url: String = this.endpoints.fileData): Observable<HttpResponse<ArrayBuffer>> {
    const url = this.apiRoot + base_url
      .replace('{file_id}', fileId.toString());

    return this.httpClient
      .get(url, { observe: 'response', responseType: 'arraybuffer' })
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Update the File metadata for Workflow Specification File */
  updateSpecFileData(workflowSpec: WorkflowSpec, fileMeta: FileMeta, file: File): Observable<FileMeta> {
        // specFileData: '/workflow-specification/{spec_id}/file/{file_name}/data',
    const url = this.apiRoot + this.endpoints.specFileData
      .replace('{spec_id}', workflowSpec.id)
      .replace('{file_name}', fileMeta.name)
     const formData = new FormData();
    formData.append('file', file);

    return this.httpClient
      .put<FileMeta>(url, formData)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Update the File Data for specific File Metadata */
  updateFileData(fileMeta: FileMeta, file: File, base_url = this.endpoints.fileData): Observable<FileMeta> {
    const url = this.apiRoot + base_url
      .replace('{file_id}', fileMeta.id.toString());
    const formData = new FormData();
    formData.append('file', file);

    return this.httpClient
      .put<FileMeta>(url, formData)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Create a DMN file from a spreadsheet  */
  createDMNFromSS(file: File): Observable<HttpResponse<ArrayBuffer>> {
    const url = this.apiRoot + this.endpoints.ssDMN;
    const formData = new FormData();
    formData.append('file', file);

    return this.httpClient
      .post(url, formData, { observe: 'response', responseType: 'arraybuffer' })
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Get Task Events */
  getTaskEvents(action?: TaskAction, onlylanes?: boolean, studyId?: number, workflowId?: number): Observable<TaskEvent[]> {
    const url = this.apiRoot + this.endpoints.taskEvents;
    let httpParams = new HttpParams();
    if (action)  { httpParams = httpParams.set('action', action); }
    if (onlylanes) { httpParams = httpParams.set('onlylanes', onlylanes.toString())}
    if (studyId) { httpParams = httpParams.set('study', studyId.toString()); }
    if (workflowId) { httpParams = httpParams.set('workflow', workflowId.toString()); }

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
      httpParams = httpParams.append('terminate_loop', 'True');
    }

    if (httpParams.toString() !== '') {
      url = url + '?' + httpParams.toString();
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

  /** Get logs for a Workflow */
  getWorkflowLogs(workflowId: number, query: TaskLogQuery): Observable<TaskLogQuery> {
    const url = this.apiRoot + this.endpoints.workflowLogs
      .replace('{workflow_id}', workflowId.toString());

    return this.httpClient
      .put<TaskLogQuery>(url, query)
      .pipe(catchError(err => ApiService._handleError(err)));
  }


  /** add Reference File */
  addReferenceFile(fileMeta: FileMeta, file:File) {
    const url = this.apiRoot + this.endpoints.referenceFileList;
    const formData = new FormData();
    formData.append('file', file);

    return this.httpClient
      .post<FileMeta>(url, formData)
      .pipe(catchError(err => ApiService._handleError(err)))

  }

  /** listReferenceFiles */
  listReferenceFiles(): Observable<FileMeta[]> {
    const url = this.apiRoot + this.endpoints.referenceFileList;

    return this.httpClient
      .get<FileMeta[]>(url)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** getReferenceFile */
  getReferenceFile(name: string): Observable<FileMeta> {
    const url = this.apiRoot + this.endpoints.referenceFile
      .replace('{name}', name);

    return this.httpClient
      .get<FileMeta>(url)
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** getReferenceFile */
  getReferenceFileData(name: string): Observable<HttpResponse<ArrayBuffer>> {
    const url = this.apiRoot + this.endpoints.referenceFileData
      .replace('{name}', name);

    return this.httpClient
      .get(url, { observe: 'response', responseType: 'arraybuffer' })
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** updateReferenceFile */
  updateReferenceFile(name: string, newFile: File): Observable<HttpResponse<ArrayBuffer>> {
    const url = this.apiRoot + this.endpoints.referenceFileData
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
    this.openUrl(this.apiRoot + this.endpoints.login + '?' + httpParams.toString());
  }

  openUrl(url) {
    location.href = url;
  }

  /** lookupFieldOptions */
  lookupFieldOptions(query: string, fileParams?: FileParams, value: string=null, limit = 5): Observable<Object[]> {
    const url = this.apiRoot + this.endpoints.fieldOptionsLookup
      .replace('{workflow_id}', fileParams.workflow_id.toString())
      .replace('{task_spec_name}', fileParams.task_spec_name.toString())
      .replace('{field_id}', fileParams.irb_doc_code as string);

    if (fileParams.task_spec_name === null) {
      return throwError('The task spec name is not defined. Lookups will fail');
    }

    // Initialize Params Object
    let params = new HttpParams()
      .append('query', query)
      .append('limit', limit.toString());

    if(value) {
      params = params.append('value', value);
    }

    return this.httpClient
      .get<Object[]>(url, { params })
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** LDAP Lookup without Context */
  ldapLookup(query: string, limit = 5): Observable<Object[]> {
    const url = this.apiRoot + this.endpoints.ldap;

    // Initialize Params Object
    let params = new HttpParams()
      .append('query', query)
      .append('limit', limit.toString());

    return this.httpClient
      .get<Object[]>(url, { params })
      .pipe(catchError(err => ApiService._handleError(err)));
  }

  /** Get the git repo */
  gitRepo(): Observable<GitRepo> {
     const url = this.apiRoot + this.endpoints.gitRepo;
     return this.httpClient
       .get<GitRepo>(url)
       .pipe(catchError(err => ApiService._handleError(err)));
  }

  gitRepoMerge(branch: string) {
    const url = this.apiRoot + this.endpoints.gitRepoMerge;
    let params = new HttpParams()
      .append('branch', branch)

     return this.httpClient
       .get<Object[]>(url, { params })
       .pipe(catchError(err => ApiService._handleError(err)));
  }

  gitRepoPush(comment: string)  {
    const url = this.apiRoot + this.endpoints.gitRepoPush;
    let params = new HttpParams()
      .append('comment', comment)

     return this.httpClient
       .get<Object[]>(url, { params })
       .pipe(catchError(err => ApiService._handleError(err)));
  }

  gitRepoPull(): Observable<Object[]>  {
    const url = this.apiRoot + this.endpoints.gitRepoPull;
     return this.httpClient
       .get<Object[]>(url)
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
