import {NavItemType, WorkflowTask, WorkflowTaskState} from './workflow-task';
import {FileData} from './file';

export interface SyncSource {
  name: string,
  url: string,
}

export enum WorkflowStatus {
  NOT_STARTED = 'not_started',
  USER_INPUT_REQUIRED = 'user_input_required',
  WAITING = 'waiting',
  COMPLETE = 'complete',
}

export enum WorkflowState {
  HIDDEN = 'hidden',
  DISABLED = 'disabled',
  REQUIRED = 'required',
  OPTIONAL = 'optional',
}

export interface WorkflowSpecReference {
  id: number;
  name: string;
  display_name: string;
}

export interface WorkflowSpec {
  id: string;
  display_name: string;
  description: string;
  primary_process_id?: string;
  category_id?: number;
  category?: WorkflowSpecCategory;
  is_master_spec?: boolean;
  display_order?: number;
  standalone?: boolean;
  library?: boolean;
  libraries?: WorkflowSpecReference[];
  parents?: WorkflowSpecReference[];
}

export interface SyncSource {
  url: string;
  name: string;
}

export interface SyncCategoryItem {
  category: string;
  workflows: WorkflowSpecSync[];
}

export interface SyncItem {
  workflow: string;
  name: string;
  files: string[];
}

export interface WorkflowSpecSync {
  workflow_spec_id: string;
  date_created: string;
  location: string;
  name: string;
  new: boolean;
  status: string;
  files : FileData[];
}

export interface WorkflowSpecCategory {
  id?: number;
  display_name: string;
  display_order: number;
  workflows?: WorkflowMetadata[];
  admin: boolean;
}

export interface WorkflowMetadata {
  state: WorkflowState;
  completed_tasks: number;
  total_tasks: number;
  category_id: number;
  category_display_name: string;
  description: string;
  display_name: string;
  id: number;
  spec_version: string;
  status: WorkflowStatus;
  state_message?: string;  // An optional message explaining the state of a workflow.
  display_order?: number;
  is_review?: boolean;
}


export interface Workflow {
  id: number;
  bpmn_workflow_json: string;
  status: WorkflowStatus;
  navigation: WorkflowNavItem[];
  study_id: number;
  workflow_spec_id: string;
  workflow_spec?: WorkflowSpec;
  next_task?: WorkflowTask;
  is_latest_spec?: boolean;
  spec_version?: string;
  is_review?: boolean;
  title?: string;
  redirect?: number;
}

export interface WorkflowNavItem {
  spec_id: number;
  name: string;
  spec_type: NavItemType;
  indent: number;
  description?: string;
  lane?: string;
  backtrack_to?: string;
  task_id?: string;
  state?: WorkflowTaskState;
  children?: WorkflowNavItem[];
}


