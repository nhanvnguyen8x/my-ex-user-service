import { z } from 'zod';
import { SORT_KEYS } from '../model/user.model';

const statusEnum = z.enum(['active', 'inactive', 'suspended']);
const roleEnum = z.enum(['user', 'moderator', 'admin']);
const sortKeyEnum = z.enum(SORT_KEYS);
const sortOrderEnum = z.enum(['asc', 'desc']);

export const createUserBodySchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email').transform((s) => s.trim()),
  name: z.string().max(255).optional().transform((s) => (s?.trim() || undefined)),
  role: roleEnum.optional().default('user'),
  status: statusEnum.optional().default('active'),
  avatar: z.string().max(512).optional().transform((s) => (s?.trim() || undefined)),
});

export const updateUserBodySchema = z
  .object({
    email: z.string().email('Invalid email').transform((s) => s.trim()).optional(),
    name: z.string().max(255).optional().transform((s) => (s?.trim() || undefined)),
    role: roleEnum.optional(),
    status: statusEnum.optional(),
    avatar: z.string().max(512).optional().transform((s) => (s?.trim() || undefined)),
    reviewCount: z.coerce.number().int().min(0).optional(),
  })
  .strict();

export const listUsersQuerySchema = z.object({
  search: z.string().optional().default('').transform((s) => (typeof s === 'string' ? s.trim() : '')),
  status: statusEnum.optional().catch(undefined).transform((s) => s ?? null),
  role: roleEnum.optional().catch(undefined).transform((s) => s ?? null),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  sortBy: sortKeyEnum.optional().default('createdAt'),
  sortOrder: sortOrderEnum.optional().default('desc'),
});

export const uuidParamSchema = z.object({
  id: z.string().uuid('Invalid user ID'),
});

export type CreateUserBody = z.infer<typeof createUserBodySchema>;
export type UpdateUserBody = z.infer<typeof updateUserBodySchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
