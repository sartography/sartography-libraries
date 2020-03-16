import {WorkflowTask} from './workflow-task';

export enum WorkflowStatus {
  NEW = 'new',
  USER_INPUT_REQUIRED = 'user_input_required',
  WAITING = 'waiting',
  COMPLETE = 'complete',
}

export interface WorkflowSpec {
  id: string;
  name: string;
  display_name: string;
  description: string;
}

export interface Workflow {
  id: number;
  bpmn_workflow_json: string;
  status: WorkflowStatus;
  study_id: number;
  workflow_spec_id: string;
  workflow_spec?: WorkflowSpec;
  last_task?: WorkflowTask;
  next_task?: WorkflowTask;
  user_tasks?: WorkflowTask[];
  is_active?: boolean;
  is_latest_spec?: boolean;
  spec_version?: string;
}
