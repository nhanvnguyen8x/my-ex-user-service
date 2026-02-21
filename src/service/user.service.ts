import * as userRepository from '../repository/user.repository';
import { isValidEmail, isValidStatus, isValidRole, sanitizeString } from '../validation';
import type { User, CreateUserDto, UpdateUserDto, ListQuery, ListUsersResult } from '../model/user.model';

export async function listUsers(query: ListQuery): Promise<ListUsersResult> {
  return userRepository.findAll(query);
}

export async function getUserById(id: string): Promise<User | null> {
  return userRepository.findById(id);
}

export async function createUser(dto: CreateUserDto): Promise<User> {
  if (!dto.email?.trim() || !isValidEmail(dto.email)) {
    throw new ValidationError('Valid email is required');
  }
  const email = dto.email.trim();
  const name = sanitizeString(dto.name, 255) ?? undefined;
  const role = dto.role && isValidRole(dto.role) ? dto.role : 'user';
  const status = dto.status && isValidStatus(dto.status) ? dto.status : 'active';
  const avatar = sanitizeString(dto.avatar, 512) ?? undefined;

  try {
    return await userRepository.create({ email, name, role, status, avatar });
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'code' in e && (e as { code: string }).code === '23505') {
      throw new ConflictError('Email already exists');
    }
    throw e;
  }
}

export async function updateUser(id: string, dto: UpdateUserDto): Promise<User | null> {
  const existing = await userRepository.findById(id);
  if (!existing) return null;

  const data: Partial<UpdateUserDto> = {};

  if (dto.email !== undefined) {
    if (!isValidEmail(dto.email)) throw new ValidationError('Invalid email');
    data.email = dto.email.trim();
  }
  if (dto.name !== undefined) data.name = sanitizeString(dto.name, 255) ?? undefined;
  if (dto.role !== undefined) {
    if (!isValidRole(dto.role)) throw new ValidationError('Invalid role');
    data.role = dto.role;
  }
  if (dto.status !== undefined) {
    if (!isValidStatus(dto.status)) throw new ValidationError('Invalid status');
    data.status = dto.status;
  }
  if (dto.avatar !== undefined) data.avatar = sanitizeString(dto.avatar, 512) ?? undefined;
  if (dto.reviewCount !== undefined) {
    const n = Number(dto.reviewCount);
    if (!Number.isInteger(n) || n < 0) throw new ValidationError('reviewCount must be a non-negative integer');
    data.reviewCount = n;
  }

  try {
    return await userRepository.update(id, data);
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'code' in e && (e as { code: string }).code === '23505') {
      throw new ConflictError('Email already exists');
    }
    throw e;
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  return userRepository.remove(id);
}

export class ValidationError extends Error {
  readonly statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  readonly statusCode = 404;
  constructor(message = 'Not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error {
  readonly statusCode = 409;
  constructor(message = 'Conflict') {
    super(message);
    this.name = 'ConflictError';
  }
}
