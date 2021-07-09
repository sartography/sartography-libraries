import {FileType} from '../types/file';

export const trimString = (str: string): string => {
  return !str ? '' : String(str).replace(/^\W+|\W+$/gi, '');
};

export const toSnakeCase = (str: string): string => {
  str = trimString(str);
  return !str ? '' : String(str)
    .replace(/\W+/gi, '_')
    .toLowerCase();
};

export const CameltoSnakeCase = (str: string): string => {
  str = trimString(str);
  // * https://stackoverflow.com/questions/15369566/putting-space-in-camel-case-string-using-regular-expression
  const regex = /(?<!^)([A-Z][a-z]|(?<=[a-z])[A-Z])/g;
  return !str ? '' : String(str)
  .replace(regex,(match) => {
    return '_' + match.toLowerCase();})
    .toLowerCase();
};

export const cleanUpFilename = (str: string, extension: FileType|string): string => {
  const arr = trimString(str).split('.');

  // Add file extension, if necessary
  if (arr.length < 2) {
    arr.push(extension);
  } else {
    (arr[arr.length - 1]) = extension;
  }

  return arr.join('.');
};

export const snakeToSpace = (codeString: string): string => {
  return codeString.replace(/([^A-Za-z0-9])/g, ' ').toLowerCase();
}
