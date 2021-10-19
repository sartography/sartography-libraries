export enum FileType {
  AIF = 'aif',
  AI = 'ai',
  AVI = 'avi',
  BPMN = 'bpmn',
  CSV = 'csv',
  DMG = 'dmg',
  DMN = 'dmn',
  DOC = 'doc',
  DOCX = 'docx',
  GIF = 'gif',
  HTML = 'html',
  ICS = 'ics',
  ISO = 'iso',
  JAVASCRIPT = 'javascript',
  JPEG = 'jpeg',
  JPG = 'jpg',
  JS = 'js',
  MD = 'md',
  MOV = 'mov',
  MP_3 = 'mp3',
  MP_4 = 'mp4',
  MPG = 'mpg',
  MSI = 'msi',
  OGG = 'ogg',
  PDF = 'pdf',
  PHP = 'php',
  PKGINFO = 'pkginfo',
  PLAIN = 'plain',
  PLIST = 'plist',
  PNG = 'png',
  POSTSCRIPT = 'postscript',
  PPT = 'ppt',
  PPTX = 'pptx',
  PSD = 'psd',
  PY = 'py',
  RTF = 'rtf',
  SQL = 'sql',
  SVG = 'svg',
  SVG_XML = 'svg+xml',
  TGZ = 'tgz',
  TIFF = 'tiff',
  TXT = 'txt',
  UNKNOWN = 'unknown',
  WAV = 'wav',
  XLS = 'xls',
  XLSX = 'xlsx',
  XML = 'xml',
  ZIP = 'zip',
}

export interface DocumentDirectory {
  level: string;
  file: FileMeta;
  expanded: boolean;
  filecount: number;
  children: DocumentDirectory[];
}

export interface FileMeta {
  content_type: string;
  id?: number;
  name: string;
  primary?: boolean;
  type: FileType;
  latest_version?: string;
  last_modified?: string;
  user_uid?: string;
  workflow_spec_id?: string;
  workflow_id?: number;
  study_id?: number;
  task_id?: string;
  form_field_key?: string | number | string[];
  is_reference?: boolean;
  irb_doc_code?: string;
  category?: string;
  primary_process_id?: string;
  is_status?: boolean;
  size?: number;
  data_store?: any;
  file?: File;
}

export interface FileData {
  filename: string,
  date_created: string,
  type: string,
  primary: boolean,
  content_type: string,
  primary_process_id: string,
  md5_hash: string,
  location?: string,
  new?: boolean,
  status: string,

}

export interface FileParams {
  workflow_spec_id?: string;
  workflow_id?: number;
  study_id?: number;
  task_spec_name?: string;
  form_field_key?: string | number | string[];
}

export interface LookupData {
  id: number;
  value: string;
  label: string;
  data: any;
}
