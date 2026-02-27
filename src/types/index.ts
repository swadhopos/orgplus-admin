export interface User {
  uid: string;
  email: string | null;
  role?: 'systemAdmin' | 'admin' | 'orgMember';
  orgId?: string;
}

export interface Organization {
  _id: string;
  name: string;
  type?: 'housing_society' | 'apartment_complex' | 'gated_community' | 'cooperative_society' | 'church' | 'mahallu' | 'temple' | 'other';
  registrationNumber?: string;
  establishedDate?: string;
  totalUnits?: number;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  contactEmail: string;
  contactPhone: string;
  alternatePhone?: string;
  website?: string;
  description?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
  createdByUserId: string;
  isDeleted: boolean;
}

export interface CreateOrganizationData {
  name: string;
  type?: 'housing_society' | 'apartment_complex' | 'gated_community' | 'cooperative_society' | 'church' | 'mahallu' | 'temple' | 'other';
  registrationNumber?: string;
  establishedDate?: string;
  totalUnits?: number;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  contactEmail: string;
  contactPhone: string;
  alternatePhone?: string;
  website?: string;
  description?: string;
  status?: 'active' | 'inactive' | 'suspended';
  adminEmail: string;
  adminPassword: string;
}

export interface CreateOrgAdminData {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}
