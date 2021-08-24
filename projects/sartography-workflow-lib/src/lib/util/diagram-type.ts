import {FileType} from '../types/file';

export const getDiagramTypeFromXml = (xml: string): FileType => (xml && xml.includes('dmn.xsd') ? FileType.DMN : FileType.BPMN);
