export enum ProtocolBuilderStatus {
  IN_PROCESS = 'in_process',
  COMPLETE = 'complete',
  UPDATING = 'updating',
  OUT_OF_DATE = 'out_of_date',
}

export interface Study {
  id: number;
  title: string;
  last_updated: Date;
  protocol_builder_status: ProtocolBuilderStatus;
  primary_investigator_id: string;
  sponsor: string;
  ind_number: string;
  inactive: boolean;
}
