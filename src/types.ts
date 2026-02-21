export type UserStatus = 'active' | 'inactive' | 'suspended';
export type UserRole = 'user' | 'moderator' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  status: string;
  avatar: string | null;
  review_count: number;
  created_at: string;
  updated_at: string | null;
}

export interface CreateUserBody {
  email: string;
  name?: string;
  role?: string;
  status?: string;
  avatar?: string;
}

export interface UpdateUserBody {
  email?: string;
  name?: string;
  role?: string;
  status?: string;
  avatar?: string;
  review_count?: number;
}

export const VALID_STATUSES: UserStatus[] = ['active', 'inactive', 'suspended'];
export const VALID_ROLES: UserRole[] = ['user', 'moderator', 'admin'];
