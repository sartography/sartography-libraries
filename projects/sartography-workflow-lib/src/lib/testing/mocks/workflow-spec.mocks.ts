import {WorkflowSpec} from '../../types/workflow';
import {
  mockWorkflowSpecCategory0,
  mockWorkflowSpecCategory1,
  mockWorkflowSpecCategory2
} from './workflow-spec-category.mocks';

export const mockWorkflowSpec0: WorkflowSpec = {
  id: 'all_things',
  name: 'all_things',
  display_name: 'Everything',
  description: 'Do all the things',
  category_id: 0,
  category: mockWorkflowSpecCategory0,
  display_order: 1,
};
export const mockWorkflowSpec1: WorkflowSpec = {
  id: 'few_things',
  name: 'few_things',
  display_name: 'Some things',
  description: 'Do a few things',
  category_id: 1,
  category: mockWorkflowSpecCategory1,
  display_order: 0,
};
export const mockWorkflowSpec2: WorkflowSpec = {
  id: 'one_thing',
  name: 'one_thing',
  display_name: 'One thing',
  description: 'Do just one thing',
  category_id: 2,
  category: mockWorkflowSpecCategory2,
  display_order: 2,
};

export const mockWorkflowSpecs: WorkflowSpec[] = [
  mockWorkflowSpec0,
  mockWorkflowSpec1,
  mockWorkflowSpec2,
];
