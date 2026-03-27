export type MembershipModel = 'group_required' | 'group_optional' | 'individual_only';
export type PaymentType = 'Voluntary_AdHoc' | 'Mandatory_Recurring';

export interface OrgLabels {
  groupLabel: string | null;
  memberLabel: string;
}

export interface OrgFeatures {
  hasMembers: boolean;
  hasGroups: boolean;
  hasEvents: boolean;
  hasCommittees: boolean;
  hasBMD: boolean;
  hasSubscriptions: boolean;
  hasNotices: boolean;
  hasLedger: boolean;
  hasStaff: boolean;
  hasCertificates: boolean;
  hasMembership: boolean;
}

export interface OrgFinancial {
  paymentType: PaymentType;
  canIssueTaxExemptions: boolean;
  fiscalYearStartMonth?: number;
  useCalendarYear?: boolean;
}

export interface OrgNicheType {
  _id: string;
  name: string;
  key: string;
  description: string;
  membershipModel: MembershipModel;
  labels: OrgLabels;
  features: OrgFeatures;
  financial: OrgFinancial;
  subtypes: { label: string; key: string }[];
  suggestedColors?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrgConfig {
  _id: string;
  organizationId: string;
  nicheTypeKey: string;
  membershipModel: MembershipModel;
  labels: OrgLabels;
  features: OrgFeatures;
  financial: OrgFinancial;
  idFormat: {
    format: 'group_member' | 'member_only';
  };
  createdAt: string;
  updatedAt: string;
}
