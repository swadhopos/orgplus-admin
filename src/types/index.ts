export interface User {
  uid: string;
  email: string | null;
  role?: 'systemAdmin' | 'admin' | 'orgMember';
  orgId?: string;
}

export interface Organization {
  _id: string;
  name: string;
  nicheTypeKey: string;
  type?: string; 
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
  subtype?: string;
  primaryColor?: string;
  secondaryColor?: string;
  createdAt: string;
  updatedAt: string;
  createdByUserId: string;
  isDeleted: boolean;
}

export interface CreateOrganizationData {
  name: string;
  nicheTypeKey: string;
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
  subtype?: string;
  primaryColor?: string;
  secondaryColor?: string;
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
