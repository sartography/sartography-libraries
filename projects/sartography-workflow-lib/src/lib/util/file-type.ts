import {FileType} from '../types/file';

export const getFileType = (file: File): FileType => {
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

export const getFileIcon = (file: File): string => {
  return `/assets/icons/file_types/${getFileType(file)}.svg`;
};
