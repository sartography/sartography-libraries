import {Study} from './study';
import {Workflow, WorkflowState, WorkflowStatus} from './workflow';

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
