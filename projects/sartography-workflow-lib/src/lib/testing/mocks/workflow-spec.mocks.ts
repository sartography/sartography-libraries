import {WorkflowSpec} from '../../types/workflow';

export const mockWorkflowSpec0: WorkflowSpec = {
  id: 'all_things', display_name: 'Everything', description: 'Do all the things'
};
export const mockWorkflowSpec1: WorkflowSpec = {
  id: 'few_things', display_name: 'Some things', description: 'Do a few things'
};
export const mockWorkflowSpec2: WorkflowSpec = {
  id: 'one_thing', display_name: 'One thing', description: 'Do just one thing'
};

export const mockWorkflowSpecs: WorkflowSpec[] = [
  mockWorkflowSpec0,
  mockWorkflowSpec1,
  mockWorkflowSpec2,
];
