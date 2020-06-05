import {HttpResponse} from '@angular/common/http';
import {FileMeta, FileType} from '../types/file';

export const getFileType = (file: File|FileMeta): FileType => {
  let key: FileType;

  if (file.type) {
    key = stringToFileType(file.type, '/');
  }

  if ((key === undefined) && file.name) {
    key = stringToFileType(file.name, '.');
  }

  if (key === undefined) {
    key = FileType.UNKNOWN;
  }

  return key;
};

const stringToFileType = (s: string, separator: string): FileType | undefined => {
  const sArray = s.toLowerCase().split(separator);
  const fileTypes = Object.values(FileType).map(v => v.toString());

  if (sArray.length > 0) {
    const ext = sArray[sArray.length - 1];

    if (fileTypes.includes(ext)) {
      return ext as FileType;
    }
  }
};

export const getFileIcon = (file: File|FileMeta, baseHref = ''): string => {
  return baseHref + `assets/icons/file_types/${getFileType(file)}.svg`;
};

export const newFileFromResponse = (fm: FileMeta, response: HttpResponse<ArrayBuffer>): File => {
  const options: FilePropertyBag = {
    type: fm.content_type,
    lastModified: new Date(response.headers.get('last-modified')).getTime(),
  };

  return new File([response.body], fm.name, options);
};
