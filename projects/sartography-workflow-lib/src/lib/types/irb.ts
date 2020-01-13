import {ProtocolBuilderStatus} from './study';

export interface IRBResponse {
  UVAStudyTrackingNumber?: string;
  LastIRBChange?: Date;
  UVA_Study_Tracking?: string;
  ss_study_id?: string;
  type?: string;
  date_modified?: Date;
  INDNumber?: number;
  IDENumber?: number;
  IBCNumber?: number;
  requirements?: IRBRequirement[];
}

export enum IRBReviewType {
  EXPEDITED = 'Expedited',
  FULL_BOARD = 'Full Board',
}

export enum IRBRequirement {
  NON_UVA_INSTITUTIONAL_APPROVAL = 'NonUVAInstitutionalApproval',
  SOM_CTO_REVIEW_NEED_FOR_IND = 'SOM_CTO_Review_Need_for_IND',
  SOM_CTO_IND_REVIEW_UVA_PI_IND = 'SOM_CTO_IND_Review_UVA_PI_IND',
  SOM_CTO_IDE_REVIEW = 'SOM_CTO_IDE_Review',
  SOM_CTO_REVIEW_NEED_FOR_IDE = 'SOM_CTO_Review_need_for_IDE',
  SOM_CTO_IDE_REVIEW_UVA_PI_IDE = 'SOM_CTO_IDE_Review_UVA_PI_IDE',
  CENTRAL_INSTITUTIONAL_REVIEW_BOARD_CIRB = 'CentralInstitutionalReviewBoard_CIRB',
  COI_MANAGEMENT_PLAN = 'COIManagementPlan',
  CANCER_CENTER_PROTOCOL_REVIEW_COMMITTEE = 'CancerCenterProtocolReviewCommittee',
  SCIENTIFIC_PRE_REVIEW_NEONATAL_ICU = 'ScientificPreReviewNeonatalICU',
  RSC_HIRE_LANGUAGE = 'RSC_HireLanguage',
  NEW_MEDICAL_DEVICE = 'NewMedicalDevice',
  INVESTIGATION_DRUG_SERVICES_IDS_FEASIBILITY = 'InvestigationDrugServices_IDS_Feasibility',
  IDS_DEVICE_WITH_DRUG = 'IDSDeviceWithDrug',
  DISPLAY_IDS_DEVICE_WITH_DRUG = 'Display_IDSDeviceWithDrug',
  EMBRYONIC_STEM_CELL_RESEARCH_OVERSIGHT = 'EmbryonicStemCellResearchOversight',
  IS_IRB_OF_RECORD = 'IsIRBofRecord',
  DISPLAY_RSC_HIRE_APPROVAL = 'Display_RSC_HireApproval',
  RADIOACTIVE_DRUG_RESEARCH_COMMITTEE = 'RadioactiveDrugResearchCommittee',
  SIGNED_IRB_AUTHORIZATION_CIRB = 'SignedIRBAuthorizationCIRB',
  CERTIFICATE_OF_CONFIDENTIALITY = 'CertificateOfConfidentiality',
  SOM_CTO_UVA_PI_MULTISITE = 'SOM_CTO_UVA_PI_Multisite',
  FERPA = 'FamilyEducationalRightsAndPrivacyAct_SocialAndBehavioralScience',
  SOM_CTO_UVA_NON_UVA_PI_NON_INDUSTRY_PI_MULTISITE = 'SOM_CTO_UVA_NonUVA_PI_NonIndustryPIMultisite',
  INFORMATION_SECURITY_POLICY_AND_RECORDS_OFFICE_ISPRO = 'InformationSecurityPolicyandRecordsOffice_ISPRO',
  INSTITUTIONAL_BIOSAFETY_COMMITTEE_APPROVAL = 'InstitutionalBiosafetyCommitteeApproval',
  GRADUATE_MEDICAL_EDUCATION_COMMITTEE_GMEC = 'GraduateMedicalEducationCommittee_GMEC',
  GROUP_ON_RESEARCH_IN_MEDICAL_EDUCATION_GRIME = 'GroupOnResearchInMedicalEducation_GRIME',
  IRB_ADMINISTRATIVE_REVIEWER = 'irb_Administrative_Reviewer',
  INVESTIGATOR_BROCHURE = 'InvestigatorBrochure',
  INVESTIGATOR_BROCHURE_TWO = 'InvestigatorBrochureTwo',
  SOM_CTO_APPROVAL_NON_UVA_ACADEMIA_NON_INDUSTRY_PI_OF_IDE = 'SOMCTOApprovalNonUVAAcademiaNonIndustryPIofIDE',
  SOM_CTO_NEED_FOR_IND_APPROVAL = 'SOMCTO_need_for_IND_Approval',
}
