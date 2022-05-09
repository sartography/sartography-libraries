import {NavItemType, WorkflowTask, WorkflowTaskState} from './workflow-task';

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
  LOCKED = 'locked',
}

export interface WorkflowSpec {
  id: string;
  display_name: string;
  description: string;
  primary_process_id?: string;
  primary_file_name?: string;
  category_id?: string;
  is_master_spec?: boolean;
  display_order?: number;
  standalone?: boolean;
  library?: boolean;
  libraries?: string[];
}

export interface WorkflowSpecCategory {
  id?: string;
  display_name: string;
  display_order?: number;
  workflows?: WorkflowMetadata[];
  meta?: WorkflowCategoryMetadata;
  admin: boolean;
}

export interface WorkflowCategoryMetadata {
  id?: string;
  state?: WorkflowState;
  state_message?: string;
}

export interface WorkflowMetadata {
  state: WorkflowState;
  completed_tasks: number;
  total_tasks: number;
  category_id: string;
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
  is_review?: boolean;
  title?: string;
  redirect?: number;
  state?: string;
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


