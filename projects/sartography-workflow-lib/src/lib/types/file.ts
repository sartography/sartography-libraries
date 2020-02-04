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
  study_id?: number;
  task_id?: string;
}
