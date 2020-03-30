import {WorkflowSpecCategory} from '../../types/workflow';

export const mockWorkflowSpecCategory0: WorkflowSpecCategory = {
  id: 0, name: 'all_things', display_name: 'Everything', display_order: 2
};
export const mockWorkflowSpecCategory1: WorkflowSpecCategory = {
  id: 1, name: 'few_things', display_name: 'Some things', display_order: 0
};
export const mockWorkflowSpecCategory2: WorkflowSpecCategory = {
  id: 2, name: 'one_thing', display_name: 'One thing', display_order: 1
};

export const mockWorkflowSpecCategories: WorkflowSpecCategory[] = [
  mockWorkflowSpecCategory0,
  mockWorkflowSpecCategory1,
  mockWorkflowSpecCategory2,
];
