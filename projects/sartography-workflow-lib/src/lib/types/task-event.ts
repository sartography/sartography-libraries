import {Study} from './study';
import {WorkflowMetadata} from './workflow';

export interface TaskEvent {
  id: number;
  study: Study;
  workflow: WorkflowMetadata;
  user_uid: string;
  user_display?: string;
  action: TaskAction;
  task_id: string;
  task_title: string;
  task_name: string;
  task_type: string;
  task_state: string;
  task_lane: string;
  date: Date;
}

export enum TaskAction {
  COMPLETE = 'COMPLETE',
  TOKEN_RESET = 'TOKEN_RESET',
  HARD_RESET = 'HARD_RESET',
  SOFT_RESET = 'SOFT_RESET',
  ASSIGNMENT = 'ASSIGNMENT',
}
