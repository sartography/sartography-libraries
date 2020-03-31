import {WorkflowState, WorkflowStatus} from './workflow';

export interface WorkflowStats {
  completed_tasks: number;
  description: string;
  display_name: string;
  id: number;
  name: string;
  state: WorkflowState;
  status: WorkflowStatus;
  total_tasks: number;
}

export interface TaskEvent {
  id: number;
  study_id: number;
  user_uid: string;
  workflow_id: number;
  workflow_spec_id: string;
  spec_version: string;
  task_id: string;
  task_state: string;
  date: Date;
}
