export interface BpmnFormJsonFieldValidationConstraint {
  name: string;
  config: string;
}

export interface BpmnFormJsonFieldProperty {
  id: string;
  value: string;
}

export interface BpmnFormJsonFieldEnumValue {
  id: string;
  name: string;
  data?: any;     // Lookup data object, populated by backend LookupService
}

export interface BpmnFormJsonField {
  id: string;
  label: string;
  type: string;
  default_value?: string;
  validation?: BpmnFormJsonFieldValidationConstraint[];
  properties?: BpmnFormJsonFieldProperty[];
  options?: BpmnFormJsonFieldEnumValue[];
}

export interface BpmnFormJson {
  key: string;
  fields: BpmnFormJsonField[];
}
