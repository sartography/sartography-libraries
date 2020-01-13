import {Links} from './links';

export enum TaskState {
  Future = 'FUTURE',
  Likely = 'LIKELY',
  Maybe = 'MAYBE',
  Waiting = 'WAITING',
  Ready = 'READY',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
}

export interface TaskSpecs {
  [key: string]: TaskSpec;
}

export interface TaskSpec {
  id: string;
  name: string;
  description: string;
  _links?: Links;
}

export interface Task {
  id: string;
  name: string;
  task_spec_id: string;
  state_name: TaskState;
  task_spec?: TaskSpec;
  children?: Task[];
  _links?: Links;
}
