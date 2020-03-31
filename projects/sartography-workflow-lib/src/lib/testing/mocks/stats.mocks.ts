import {WorkflowStats} from '../../types/stats';
import {WorkflowState, WorkflowStatus} from '../../types/workflow';

export const mockWorkflowStats0: WorkflowStats = {
  completed_tasks: 0,
  description: 'Do all the things',
  display_name: 'Everything',
  id: 0,
  name: 'all_things',
  state: WorkflowState.REQUIRED,
  status: WorkflowStatus.USER_INPUT_REQUIRED,
  total_tasks: 5,
};

export const mockWorkflowStats1: WorkflowStats = {
  completed_tasks: 0,
  description: 'Do a few things',
  display_name: 'Some things',
  id: 1,
  name: 'few_things',
  state: WorkflowState.REQUIRED,
  status: WorkflowStatus.USER_INPUT_REQUIRED,
  total_tasks: 10,
};

export const mockWorkflowStats: WorkflowStats[] = [
  mockWorkflowStats0,
  mockWorkflowStats1,
];
