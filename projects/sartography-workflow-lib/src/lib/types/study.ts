export enum ProtocolBuilderStatus {
  IN_PROCESS = 'in_process',
  COMPLETE = 'complete',
  UPDATING = 'updating',
  OUT_OF_DATE = 'out_of_date',
}

export const ProtocolBuilderRequiredDocs = {
  1: `Investigators Brochure`,
  6: `Cancer Center's PRC Approval Form`,
  8: `SOM CTO IND/IDE Review Letter`,
  9: `HIRE Approval`,
  10: `Cancer Center's PRC Approval Waiver`,
  12: `Certificate of Confidentiality Application`,
  14: `Institutional Biosafety Committee Approval`,
  18: `SOM CTO Approval Letter - UVA PI Multisite Trial`,
  20: `"IRB Approval or Letter of Approval from Administration: Study Conducted at non- UVA Facilities "),`,
  21: `New Medical Device Form`,
  22: `SOM CTO Review regarding need for IDE`,
  23: `SOM CTO Review regarding need for IND`,
  24: `InfoSec Approval`,
  25: `Scientific Pre-review Documentation`,
  26: `IBC Number`,
  32: `IDS - Investigational Drug Service Approval`,
  36: `RDRC Approval `,
  40: `SBS/IRB Approval-FERPA`,
  41: `HIRE Standard Radiation Language`,
  42: `COI Management Plan `,
  43: `SOM CTO Approval Letter-Non UVA, Non Industry PI MultiSite Study`,
  44: `GRIME Approval`,
  45: `GMEC Approval`,
  46: `IRB Reliance Agreement Request Form- IRB-HSR is IRB of Record`,
  47: `Non UVA IRB Approval - Initial and Last Continuation`,
  48: `MR Physicist Approval- Use of Gadolinium`,
  49: `SOM CTO Approval- Non- UVA Academia PI of IDE`,
  51: `IDS Waiver`,
  52: `Package Inserts`,
  53: `IRB Reliance Agreement Request Form- IRB-HSR Not IRB of Record`,
  54: `ESCRO Approval`,
  57: `Laser Safety Officer Approval`,
};

export interface ProtocolBuilderRequirement {
  [key: number]: string;
}

export interface Study {
  id: number;
  title: string;
  last_updated?: Date;
  protocol_builder_status?: ProtocolBuilderStatus;
  primary_investigator_id?: string;
  sponsor?: string;
  hsr_number?: string;
  ind_number?: string;
  inactive?: boolean;
  requirements?: ProtocolBuilderRequirement[];
}
