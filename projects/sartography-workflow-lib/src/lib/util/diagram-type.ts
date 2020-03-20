import {FileType} from '../types/file';

export const getDiagramTypeFromXml = (xml: string): FileType => {
  return (xml && xml.includes('dmn.xsd') ? FileType.DMN : FileType.BPMN);
};
