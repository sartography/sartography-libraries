
export enum ApprovalStatus {
    WAITING = 'WAITING',
    APPROVED = 'APPROVED',
    DECLINED = 'DECLINED',
    CANCELED = 'CANCELED'
}

export enum ApprovalStatusLabels {
    WAITING = 'Waiting',
    APPROVED = 'Approved',
    DECLINED = 'Declined',
    CANCELED = 'Canceled'
}

export interface ApprovalFile {
    id: number;
    name: string;
    content_type: string
}

export interface Approver {
    uid: string;
    display_name: string;
    title: string;
    department: string;
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
    approver: Approver;
}
