import {WorkflowCategoryMetadata, WorkflowSpecCategory, WorkflowState} from '../../types/workflow';
import {mockWorkflowMetas} from './stats.mocks';

export const mockCategoryMetaData: WorkflowCategoryMetadata = {
  id: '0',
  state: WorkflowState.HIDDEN,
}

export const mockCategoryMetaData2: WorkflowCategoryMetadata = {
  id: null,
  state: null,
  state_message: null,
}

export const mockWorkflowSpecCategory0: WorkflowSpecCategory = {
  id: '0',
  display_name: 'Everything',
  display_order: 0,
  workflows: mockWorkflowMetas,
  admin: false,
  meta: mockCategoryMetaData2
};
export const mockWorkflowSpecCategory1: WorkflowSpecCategory = {
  id: '1',
  display_name: 'Some things',
  display_order: 1,
  workflows: mockWorkflowMetas,
  admin: false,
  meta: mockCategoryMetaData2
};
export const mockWorkflowSpecCategory2: WorkflowSpecCategory = {
  id: '2',
  display_name: 'One thing',
  display_order: 2,
  workflows: mockWorkflowMetas,
  admin: false,
  meta: mockCategoryMetaData2
};
export const mockWorkflowSpecCategory3: WorkflowSpecCategory = {
  id: '3',
  display_name: 'Weird thing',
  display_order: 3,
  workflows: mockWorkflowMetas,
  admin: false,
  meta: mockCategoryMetaData,
};

export const mockWorkflowSpecCategories: WorkflowSpecCategory[] = [
  mockWorkflowSpecCategory0,
  mockWorkflowSpecCategory1,
  mockWorkflowSpecCategory2,
  mockWorkflowSpecCategory3,
];
