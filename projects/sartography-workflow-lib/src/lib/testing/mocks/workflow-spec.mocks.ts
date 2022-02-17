import {WorkflowSpec} from '../../types/workflow';
import {
  mockWorkflowSpecCategory0,
  mockWorkflowSpecCategory1,
  mockWorkflowSpecCategory2,
  mockWorkflowSpecCategory3
} from './workflow-spec-category.mocks';

export const mockWorkflowSpec0: WorkflowSpec = {
  id: 'all_things',
  display_name: 'Everything',
  description: 'Do all the things',
  category_id: '0',
  display_order: 0,
  libraries: [],
  library: false
};
export const mockWorkflowSpec1: WorkflowSpec = {
  id: 'few_things',
  display_name: 'Some things',
  description: 'Do a few things',
  category_id: '1',
  display_order: 1,
  libraries: [],
  library: false
};
export const mockWorkflowSpec2: WorkflowSpec = {
  id: 'one_thing',
  display_name: 'One thing',
  description: 'Do just one thing',
  category_id: '2',
  display_order: 2,
  libraries: [],
  library: false
};
export const mockWorkflowSpec3: WorkflowSpec = {
  id: 'weird_thing',
  display_name: 'Weird thing',
  description: 'Do some weird things',
  category_id: '3',
  display_order: 2,
  standalone: false,
  libraries: [],
  library: true
};


export const mockWorkflowSpecs: WorkflowSpec[] = [
  mockWorkflowSpec0,
  mockWorkflowSpec1,
  mockWorkflowSpec2,
  mockWorkflowSpec3,
];
