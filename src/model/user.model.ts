export type UserStatus = 'active' | 'inactive' | 'suspended';
export type UserRole = 'user' | 'moderator' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  status: string;
  avatar: string | null;
  reviewCount: number;
  createdAt: string;
  updatedAt: string | null;
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
  reviewCount?: number;
}

export const SORT_KEYS = ['createdAt', 'updatedAt', 'email', 'name', 'role', 'status', 'reviewCount'] as const;
export type SortKey = (typeof SORT_KEYS)[number];

/** Map camelCase sort key to DB column name (snake_case). */
export const SORT_KEY_TO_COLUMN: Record<SortKey, string> = {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  email: 'email',
  name: 'name',
  role: 'role',
  status: 'status',
  reviewCount: 'review_count',
};

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
