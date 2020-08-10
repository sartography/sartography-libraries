import {StudyStatus} from './study';

export enum StudyEventType {
  USER = 'user',
  AUTOMATIC = 'automatic',
}

export enum StudyEventTypeLabels {
  USER = 'User',
  AUTOMATIC = 'Automatic',
}

export interface StudyEvent {
  id?: number;
  create_date: Date;
  status: StudyStatus;
  comment: string;
  event_type: StudyEventType;
}
