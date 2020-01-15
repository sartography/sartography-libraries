import {Workflow, WorkflowStatus} from '../../types/workflow';

export const mockWorkflow0: Workflow = {
  id: 0,
  bpmn_workflow_json: '"SequenceFlow_0ik56h0", 1',
  status: WorkflowStatus.USER_INPUT_REQUIRED,
  study_id: 0,
  workflow_spec_id: '0',
};

export const mockWorkflow1: Workflow = {
  id: 1,
  bpmn_workflow_json: '"SequenceFlow_0ik56h0", 1',
  status: WorkflowStatus.USER_INPUT_REQUIRED,
  study_id: 0,
  workflow_spec_id: '0',
};

export const mockWorkflows: Workflow[] = [
  mockWorkflow0,
  mockWorkflow1,
];
