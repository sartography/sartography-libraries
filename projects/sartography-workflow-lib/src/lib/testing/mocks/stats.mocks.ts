import {WorkflowMetadata, WorkflowState, WorkflowStatus} from '../../types/workflow';

export const mockWorkflowMeta0: WorkflowMetadata = {
  id: 0,
  display_name: 'Everything',
  description: 'Do all the things',
  spec_version: 'v1.1.1.1 (0.0.0.0)',
  category_id: '0',
  state: WorkflowState.REQUIRED,
  status: WorkflowStatus.USER_INPUT_REQUIRED,
  category_display_name: '',
  total_tasks: 5,
  completed_tasks: 0,
  display_order: 1,
};

export const mockWorkflowMeta1: WorkflowMetadata = {
  id: 1,
  display_name: 'Some things',
  description: 'Do a few things',
  category_display_name: '',
  spec_version: 'v1.1.1.1 (0.0.0.0)',
  category_id: '0',
  state: WorkflowState.REQUIRED,
  status: WorkflowStatus.USER_INPUT_REQUIRED,
  total_tasks: 10,
  completed_tasks: 0,
  display_order: 1,
};

export const mockWorkflowMetas: WorkflowMetadata[] = [
  mockWorkflowMeta0,
  mockWorkflowMeta1,
];
