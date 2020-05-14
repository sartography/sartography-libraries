import {FileMeta, FileType} from '../../types/file';
import {mockStudy0} from './study.mocks';
import {mockWorkflowSpec0} from './workflow-spec.mocks';
import {mockWorkflowTask0} from './workflow-task.mocks';
import {mockWorkflow0} from './workflow.mocks';

const timeCode = new Date('2020-01-23T12:34:12.345Z').getTime();
export const mockFileMeta0: FileMeta = {
  id: 0,
  content_type: 'text/xml',
  name: 'one-fish.bpmn',
  file: new File([], 'one-fish.bpmn', {
    type: 'text/xml',
    lastModified: timeCode,
  }),
  type: FileType.BPMN,
  workflow_spec_id: mockWorkflowSpec0.id,
  task_id: mockWorkflowTask0.id,
  study_id: mockStudy0.id,
  latest_version: '1.0',
};

export const mockFileMeta1: FileMeta = {
  id: 1,
  content_type: 'text/xml',
  name: 'two-fish.bpmn',
  file: new File([], 'two-fish.bpmn', {
    type: 'text/xml',
    lastModified: timeCode,
  }),
  type: FileType.BPMN,
  workflow_spec_id: mockWorkflowSpec0.id,
  task_id: mockWorkflowTask0.id,
  study_id: mockStudy0.id,
  latest_version: '1.0',
};

export const mockFileMeta2: FileMeta = {
  id: 2,
  content_type: 'text/xml',
  name: 'red-fish.bpmn',
  file: new File([], 'red-fish.bpmn', {
    type: 'text/xml',
    lastModified: timeCode,
  }),
  type: FileType.BPMN,
  workflow_spec_id: mockWorkflowSpec0.id,
  task_id: mockWorkflowTask0.id,
  study_id: mockStudy0.id,
  latest_version: '1.0',
};

export const mockFileMeta3: FileMeta = {
  id: 3,
  content_type: 'text/xml',
  name: 'blue-fish.bpmn',
  file: new File([], 'blue-fish.bpmn', {
    type: 'text/xml',
    lastModified: timeCode,
  }),
  type: FileType.BPMN,
  workflow_spec_id: mockWorkflowSpec0.id,
  task_id: mockWorkflowTask0.id,
  study_id: mockStudy0.id,
  latest_version: '1.0',
};

export const mockFileMetaTask0: FileMeta = {
  id: 4,
  content_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  name: 'my_doc.docx',
  file: new File([], 'my_doc.docx', {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    lastModified: timeCode,
  }),
  type: FileType.DOCX,
  workflow_id: mockWorkflow0.id,
  study_id: mockWorkflow0.study_id,
  task_id: mockWorkflowTask0.id,
  latest_version: '1.0',
};

export const mockFileMetas: FileMeta[] = [
  mockFileMeta0,
  mockFileMeta1,
  mockFileMeta2,
  mockFileMeta3,
];
