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

export class WorkflowTask {
  data: any;
  documentation: string;
  form: BpmnFormJson;
  id: string;
  name: string;
  properties?: BpmnFormJsonFieldProperty[];
  state: WorkflowTaskState;
  title: string;
  type: WorkflowTaskType;

  display_name?(): string {
    if (this.properties) {
      const displayNameProp = this.properties.find(p => p.id === 'display_name');
      if (displayNameProp) {
        return displayNameProp.value;
      }
    }

    return this.title || this.name;
  }
}
