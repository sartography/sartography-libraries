import {FileMeta, FileType} from '../../types/file';
import {mockWorkflowSpec0} from './workflow-spec.mocks';

export const mockFileMeta0: FileMeta = {
  id: 0,
  content_type: FileType.BPMN,
  name: 'one-fish.bpmn',
  file: new File([], 'one-fish.bpmn'),
  type: FileType.BPMN,
  workflow_spec_id: mockWorkflowSpec0.id,
};

export const mockFileMeta1: FileMeta = {
  id: 1,
  content_type: FileType.BPMN,
  name: 'two-fish.bpmn',
  file: new File([], 'two-fish.bpmn'),
  type: FileType.BPMN,
  workflow_spec_id: mockWorkflowSpec0.id,
};

export const mockFileMeta2: FileMeta = {
  id: 2,
  content_type: FileType.BPMN,
  name: 'red-fish.bpmn',
  file: new File([], 'red-fish.bpmn'),
  type: FileType.BPMN,
  workflow_spec_id: mockWorkflowSpec0.id,
};

export const mockFileMeta3: FileMeta = {
  id: 3,
  content_type: FileType.BPMN,
  name: 'blue-fish.bpmn',
  file: new File([], 'blue-fish.bpmn'),
  type: FileType.BPMN,
  workflow_spec_id: mockWorkflowSpec0.id,
};

export const mockFileMetas: FileMeta[] = [
  mockFileMeta0,
  mockFileMeta1,
  mockFileMeta2,
  mockFileMeta3,
];
