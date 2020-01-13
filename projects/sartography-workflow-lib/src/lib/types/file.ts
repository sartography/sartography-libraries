export enum FileType {
  BPMN = 'bpmn',
  SVG = 'svg',
  DMN = 'dmn',
}

export interface FileMeta {
  content_type: string;
  file: File;
  id?: number;
  last_updated?: Date;
  name: string;
  primary?: boolean;
  type: FileType;
  version?: string;
  workflow_spec_id?: string;
}
