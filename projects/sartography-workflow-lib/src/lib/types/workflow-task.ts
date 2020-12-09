import {BpmnFormJson, BpmnFormJsonFieldProperty} from './json';

export enum WorkflowTaskState {
  FUTURE = 'FUTURE',
  WAITING = 'WAITING',
  READY = 'READY',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  LIKELY = 'LIKELY',
  MAYBE = 'MAYBE',
  LOCKED = 'LOCKED',
  NOOP = 'NOOP',
  NONE = 'None',  // FIXME: Why is this not in all caps?
}

export enum WorkflowTaskType {
  BUSINESS_RULE_TASK = 'BusinessRuleTask',
  CANCEL_TASK = 'CancelTask',
  END_EVENT = 'TaskEndEvent',
  MANUAL_TASK = 'ManualTask',
  NONE_TASK = 'NoneTask',
  SCRIPT_TASK = 'ScriptTask',
  START_EVENT = 'StartEvent',
  START_TASK = 'StartTask',
  USER_TASK = 'UserTask',
  TEST_USER_TASK = 'TestUserTask',
}

export enum NavItemType {
  BUSINESS_RULE_TASK = 'BusinessRuleTask',
  CANCEL_TASK = 'CancelTask',
  END_EVENT = 'EndEvent',
  MANUAL_TASK = 'ManualTask',
  NONE_TASK = 'NoneTask',
  SCRIPT_TASK = 'ScriptTask',
  START_EVENT = 'StartEvent',
  START_TASK = 'StartTask',
  USER_TASK = 'UserTask',
  SEQUENCE_FLOW = 'SequenceFlow',
  EXCLUSIVE_GATEWAM = 'ExclusiveGateway',
  PARALLEL_GATEWAY = 'ParallelGateway',
  CALL_ACTIVITY = 'CallActivity',
}

export enum MultiInstanceType {
  NONE = 'none',
  LOOPING = 'looping',
  PARALLEL = 'parallel',
  SEQUENTIAL = 'sequential',
}

const DISPLAY_NAME_PROP = 'display_name';

export interface WorkflowTask {
  data: any;
  documentation: string;
  form: BpmnFormJson;
  id: string;
  name: string;
  properties?: object;
  state: WorkflowTaskState;
  title: string;
  type: WorkflowTaskType;
  process_name: string;
  multi_instance_type: MultiInstanceType;
  multi_instance_count: number;
  multi_instance_index: number;
}
