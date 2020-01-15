import {Workflow, WorkflowStatus} from '../../types/workflow';
import {mockStudy0} from './study.mocks';
import {mockWorkflowSpec0, mockWorkflowSpec1} from './workflow-spec.mocks';

export const mockWorkflow0: Workflow = {
  id: 0,
  bpmn_workflow_json: '"SequenceFlow_0ik56h0", 1',
  status: WorkflowStatus.USER_INPUT_REQUIRED,
  study_id: mockStudy0.id,
  workflow_spec_id: mockWorkflowSpec0.id,
};

export const mockWorkflow1: Workflow = {
  id: 1,
  bpmn_workflow_json: '"SequenceFlow_0ik56h0", 1',
  status: WorkflowStatus.USER_INPUT_REQUIRED,
  study_id: mockStudy0.id,
  workflow_spec_id: mockWorkflowSpec1.id,
};

export const mockWorkflows: Workflow[] = [
  mockWorkflow0,
  mockWorkflow1,
];
