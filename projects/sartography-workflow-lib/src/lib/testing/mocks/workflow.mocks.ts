import {Workflow, WorkflowStatus} from '../../types/workflow';
import {mockStudy0} from './study.mocks';
import {mockWorkflowSpec0, mockWorkflowSpec1} from './workflow-spec.mocks';
import {mockWorkflowTask0, mockWorkflowTask1, mockWorkflowTasks} from './workflow-task.mocks';
import {mockNav0, mockNav1} from './workflow-nav.mocks';

export const mockWorkflow0: Workflow = {
  id: 0,
  bpmn_workflow_json: '"SequenceFlow_0ik56h0", 1',
  status: WorkflowStatus.USER_INPUT_REQUIRED,
  study_id: mockStudy0.id,
  workflow_spec_id: mockWorkflowSpec0.id,
  next_task: mockWorkflowTask1,
  navigation: mockNav0
};

export const mockWorkflow1: Workflow = {
  id: 1,
  bpmn_workflow_json: '"SequenceFlow_0ik56h0", 1',
  status: WorkflowStatus.USER_INPUT_REQUIRED,
  study_id: mockStudy0.id,
  workflow_spec_id: mockWorkflowSpec1.id,
  next_task: mockWorkflowTask1,
  navigation: mockNav1
};

export const mockWorkflows: Workflow[] = [
  mockWorkflow0,
  mockWorkflow1,
];
