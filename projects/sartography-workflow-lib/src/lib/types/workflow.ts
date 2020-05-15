import {WorkflowStats} from './stats';
import {WorkflowTask, WorkflowTaskState} from './workflow-task';

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

export interface WorkflowSpec {
  id: string;
  name: string;
  display_name: string;
  description: string;
  primary_process_id?: string;
  category_id?: number;
  category?: WorkflowSpecCategory;
  is_master_spec?: boolean;
  display_order?: number;
}

export interface WorkflowSpecCategory {
  id: number;
  name: string;
  display_name: string;
  display_order: number;
  workflows?: WorkflowStats[];
}

export interface Workflow {
  id: number;
  bpmn_workflow_json: string;
  status: WorkflowStatus;
  navigation: WorkflowNavItem[];
  study_id: number;
  workflow_spec_id: string;
  workflow_spec?: WorkflowSpec;
  parent_task?: WorkflowTask;
  last_task?: WorkflowTask;
  next_task?: WorkflowTask;
  user_tasks?: WorkflowTask[];
  is_latest_spec?: boolean;
  spec_version?: string;
}

export interface WorkflowResetParams {
  soft_reset?: boolean;
  hard_reset?: boolean;
}

export interface WorkflowNavItem {
  id: number;
  taskid: string;
  name: string;
  description: string;
  backtracks: boolean;
  level: number;
  indent: number;
  child_count: number;
  state: WorkflowTaskState;
}
