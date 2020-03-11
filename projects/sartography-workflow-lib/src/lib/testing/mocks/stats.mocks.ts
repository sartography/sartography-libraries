import {WorkflowStats} from '../../types/stats';
import {mockWorkflow0, mockWorkflow1} from './workflow.mocks';

export const mockWorkflowStats0: WorkflowStats = {
  id: 0,
  study_id: mockWorkflow0.study_id,
  workflow_id: mockWorkflow0.id,
  workflow_spec_id: mockWorkflow0.workflow_spec_id,
  spec_version: 'v1',
  num_tasks_total: 10,
  num_tasks_complete: 0,
  num_tasks_incomplete: 0,
  last_updated: new Date(),
};

export const mockWorkflowStats1: WorkflowStats = {
  id: 1,
  study_id: mockWorkflow1.study_id,
  workflow_id: mockWorkflow1.id,
  workflow_spec_id: mockWorkflow1.workflow_spec_id,
  spec_version: 'v1',
  num_tasks_total: 10,
  num_tasks_complete: 0,
  num_tasks_incomplete: 0,
  last_updated: new Date(),
};

export const mockWorkflowStats: WorkflowStats[] = [
  mockWorkflowStats0,
  mockWorkflowStats1,
];
