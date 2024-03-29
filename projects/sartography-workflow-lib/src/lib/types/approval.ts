export enum ApprovalStatus {
  PENDING = 'PENDING',
  AWAITING = 'AWAITING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
  CANCELED = 'CANCELED'
}

export enum ApprovalStatusLabels {
  PENDING = 'Pending your approval',
  AWAITING = 'Awaiting review by another approver',
  APPROVED = 'Approved',
  DECLINED = 'Declined',
  CANCELED = 'Canceled'
}

export interface ApprovalFile {
  id: number;
  name: string;
  content_type: string;
}

export interface ApprovalPerson {
  uid: string;
  display_name: string;
  given_name?: string;
  email_address?: string;
  telephone_number?: string;
  title: string;
  department: string;
  affiliation?: string;
  sponsor_type?: string;
}

export interface Approval {
  id: number;
  study_id: number;
  workflow_id: number;
  message: string;
  status: ApprovalStatus;
  version: number;
  title: string;
  associated_files: ApprovalFile[];
  approver: ApprovalPerson;
  related_approvals: Approval[];
  primary_investigator: ApprovalPerson;
  date_created: Date;
  date_approved?: Date;
}

export interface ApprovalCounts {
  AWAITING: number;
  PENDING: number;
  APPROVED: number;
  DECLINED: number;
  CANCELED?: number;  // API doesn't return number of canceled approvals
}
