export interface WorkflowStats {
  id: number;
  study_id: number;
  workflow_id: number;
  workflow_spec_id: string;
  spec_version: string;
  num_tasks_total: number;
  num_tasks_complete: number;
  num_tasks_incomplete: number;
  last_updated: Date;
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
