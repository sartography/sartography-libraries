import {BpmnFormJson, BpmnFormJsonFieldProperty} from './json';

export enum WorkflowTaskState {
  FUTURE = 'FUTURE',
  WAITING = 'WAITING',
  READY = 'READY',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  LIKELY = 'LIKELY',
  MAYBE = 'MAYBE',
}

export enum WorkflowTaskType {
  BUSINESS_RULE_TASK = 'BusinessRuleTask',
  CANCEL_TASK = 'CancelTask',
  MANUAL_TASK = 'ManualTask',
  NONE_TASK = 'NoneTask',
  SCRIPT_TASK = 'ScriptTask',
  START_TASK = 'StartTask',
  TEST_USER_TASK = 'TestUserTask',
  USER_TASK = 'UserTask',
}

export interface WorkflowTask {
  id: string;
  name: string;
  title: string;
  documentation: string;
  state: WorkflowTaskState;
  type: WorkflowTaskType;
  form: BpmnFormJson;
  data: any;
  properties?: BpmnFormJsonFieldProperty[];
}
