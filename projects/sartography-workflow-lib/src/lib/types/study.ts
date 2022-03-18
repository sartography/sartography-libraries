import {ApiError} from './api';
import {Approval} from './approval';
import {FileMeta} from './file';
import {TaskEvent} from './task-event';
import {WorkflowSpecCategory} from './workflow';
import {StudyEvent} from './study-event';
import {LdapInfo} from './user';

export enum StudyStatus {
  IN_PROGRESS = 'in_progress',
  OPEN_FOR_ENROLLMENT = 'open_for_enrollment',
  CR_CONNECT_COMPLETE = 'cr_connect_complete',
  HOLD = 'hold',
  ABANDONED = 'abandoned',
}

export enum StudyStatusLabels {
  IN_PROGRESS = 'In Progress',
  OPEN_FOR_ENROLLMENT = 'IRB Open to Enrollment',
  CR_CONNECT_COMPLETE = 'CRConnect Complete',
  HOLD = 'Hold',
  ABANDONED = 'Abandoned',
}

export enum ProgressStatus {
  IN_PROGRESS = 'in_progress',
  SUBMITTED_FOR_PRE_REVIEW = 'submitted_for_pre_review',
  IN_PRE_REVIEW = 'in_pre_review',
  RETURNED_FROM_PRE_REVIEW = 'returned_from_pre_review',
  PRE_REVIEW_COMPLETE = 'pre_review_complete',
  AGENDA_DATE_SET = 'agenda_date_set',
  APPROVED = 'approved',
  APPROVED_WITH_CONDITIONS = 'approved_with_conditions',
  DEFERRED = 'deferred',
  DISAPPROVED = 'disapproved',
  READY_FOR_PRE_REVIEW = 'ready_for_pre_review',
  RESUBMITTED_FOR_PRE_REVIEW = 'resubmitted_for_pre_review'
}

export enum ProgressStatusLabels {
  IN_PROGRESS = 'In Progress',
  SUBMITTED_FOR_PRE_REVIEW = 'Submitted for Pre-Review',
  IN_PRE_REVIEW = 'In Pre-Review',
  RETURNED_FROM_PRE_REVIEW = 'Returned from Pre-Review',
  PRE_REVIEW_COMPLETE = 'Pre-Review Complete',
  AGENDA_DATE_SET = 'Agenda Date Set',
  APPROVED = 'Approved',
  APPROVED_WITH_CONDITIONS = 'Approved with Conditions',
  DEFERRED = 'Deferred',
  DISAPPROVED = 'Disapproved',
  READY_FOR_PRE_REVIEW = 'Ready for Pre-Review',
  RESUBMITTED_FOR_PRE_REVIEW = 'Resubmitted for Pre-Review'
}


export const ProtocolBuilderRequiredDocs = {
  1: `Investigators Brochure`,
  6: `Cancer Center's PRC Approval Form`,
  8: `SOM CTO IND/IDE Review Letter`,
  9: `HIRE Approval`,
  10: `Cancer Center's PRC Approval Waiver`,
  12: `Certificate of Confidentiality Application`,
  14: `Institutional Biosafety Committee Approval`,
  18: `SOM CTO Approval Letter - UVA PI Multisite Trial`,
  20: `"IRB Approval or Letter of Approval from Administration: Study Conducted at non- UVA Facilities "),`,
  21: `New Medical Device Form`,
  22: `SOM CTO Review regarding need for IDE`,
  23: `SOM CTO Review regarding need for IND`,
  24: `InfoSec Approval`,
  25: `Scientific Pre-review Documentation`,
  26: `IBC Number`,
  32: `IDS - Investigational Drug Service Approval`,
  36: `RDRC Approval `,
  40: `SBS/IRB Approval-FERPA`,
  41: `HIRE Standard Radiation Language`,
  42: `COI Management Plan `,
  43: `SOM CTO Approval Letter-Non UVA, Non Industry PI MultiSite Study`,
  44: `GRIME Approval`,
  45: `GMEC Approval`,
  46: `IRB Reliance Agreement Request Form- IRB-HSR is IRB of Record`,
  47: `Non UVA IRB Approval - Initial and Last Continuation`,
  48: `MR Physicist Approval- Use of Gadolinium`,
  49: `SOM CTO Approval- Non- UVA Academia PI of IDE`,
  51: `IDS Waiver`,
  52: `Package Inserts`,
  53: `IRB Reliance Agreement Request Form- IRB-HSR Not IRB of Record`,
  54: `ESCRO Approval`,
  57: `Laser Safety Officer Approval`,
};

export interface ProtocolBuilderRequirement {
  [key: number]: string;
}

export interface Study {
  id?: number;
  title: string;
  short_title?: string;
  categories?: WorkflowSpecCategory[];
  hsr_number?: string;
  inactive?: boolean;
  ind_number?: string;
  last_updated?: Date;
  primary_investigator_id?: string;
  primary_investigator?: string;
  status?: StudyStatus;
  sponsor?: string;
  user_uid?: string;
  create_user_display?: string;
  last_activity_user?: string;
  last_activity_date?: Date;
  warnings?: ApiError[];
  approvals?: Approval[];
  files?: FileMeta[];
  enrollment_date?: Date;
  comment?: string;
  events?: TaskEvent[];
  events_history?: StudyEvent[];
  progress_status?: ProgressStatus;
  progress: number;

}

export interface StudyAssociate {
  uid: string;
  access: boolean;
  role: string;
  ldap_info?: LdapInfo;
}
