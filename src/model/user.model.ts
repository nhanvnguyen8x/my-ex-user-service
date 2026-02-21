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

export interface CreateUserDto {
  email: string;
  name?: string;
  role?: string;
  status?: string;
  avatar?: string;
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
  role?: string;
  status?: string;
  avatar?: string;
  review_count?: number;
}

export const SORT_KEYS = ['created_at', 'updated_at', 'email', 'name', 'role', 'status', 'review_count'] as const;
export type SortKey = (typeof SORT_KEYS)[number];

export interface ListQuery {
  search: string;
  status: string | null;
  role: string | null;
  page: number;
  limit: number;
  sortBy: SortKey;
  sortOrder: 'asc' | 'desc';
}

export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListUsersResult {
  data: User[];
  pagination: PaginationResult;
}

export const VALID_STATUSES: UserStatus[] = ['active', 'inactive', 'suspended'];
export const VALID_ROLES: UserRole[] = ['user', 'moderator', 'admin'];
