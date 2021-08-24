import {TaskAction, TaskEvent} from '../../types/task-event';
import {mockStudy0, mockStudy1} from './study.mocks';
import {mockWorkflowTask0, mockWorkflowTask1} from './workflow-task.mocks';
import {mockWorkflowMetadata0, mockWorkflowMetadata1} from './workflow.mocks';

export const mockTaskEvent0: TaskEvent = {
  id: 0,
  study: mockStudy0,
  workflow: mockWorkflowMetadata0,
  user_uid: 'dhf8r',
  action: TaskAction.ASSIGNMENT,
  task_id: mockWorkflowTask0.id,
  task_title: mockWorkflowTask0.title,
  task_name: mockWorkflowTask0.name,
  task_type: mockWorkflowTask0.type,
  task_state: mockWorkflowTask0.state,
  task_lane: 'supervisor',
  date: new Date(),
};

export const mockTaskEvent1: TaskEvent = {
  id: 1,
  study: mockStudy1,
  workflow: mockWorkflowMetadata1,
  user_uid: 'lb3dp',
  action: TaskAction.ASSIGNMENT,
  task_id: mockWorkflowTask1.id,
  task_title: mockWorkflowTask1.title,
  task_name: mockWorkflowTask1.name,
  task_type: mockWorkflowTask1.type,
  task_state: mockWorkflowTask1.state,
  task_lane: '',
  date: new Date(),
};

export const mockTaskEvents: TaskEvent[] = [
  mockTaskEvent0,
  mockTaskEvent1,
];
