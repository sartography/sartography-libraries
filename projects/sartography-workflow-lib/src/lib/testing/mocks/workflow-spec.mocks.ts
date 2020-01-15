// TODO: Add WorkflowSpecs and Workflows
import {WorkflowSpec} from '../../types/workflow';

export const mockWorkflowSpec0: WorkflowSpec = {
  id: '0', display_name: 'Everything', description: 'Do all the things'
};
export const mockWorkflowSpec1: WorkflowSpec = {
  id: '1', display_name: 'Some things', description: 'Do a few things'
};
export const mockWorkflowSpec2: WorkflowSpec = {
  id: '2', display_name: 'One thing', description: 'Do just one thing'
};

export const mockWorkflowSpecs: WorkflowSpec[] = [
  mockWorkflowSpec0,
  mockWorkflowSpec1,
  mockWorkflowSpec2,
];
