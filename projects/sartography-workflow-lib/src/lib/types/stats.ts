import {WorkflowState, WorkflowStatus} from './workflow';

export interface WorkflowStats {
  id: number;
  name: string;
  display_name: string;
  description: string;
  spec_version: string;
  category_id: number;
  state: WorkflowState;
  status: WorkflowStatus;
  total_tasks: number;
  completed_tasks: number;
  display_order: number;
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
