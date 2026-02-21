import { pool } from '../db';
import type { User, CreateUserDto, UpdateUserDto, ListQuery, ListUsersResult } from '../model/user.model';

const SELECT_COLUMNS = 'id, email, name, role, status, avatar, review_count, created_at, updated_at';

export async function findAll(query: ListQuery): Promise<ListUsersResult> {
  const { search, status, role, page, limit, sortBy, sortOrder } = query;
  const offset = (page - 1) * limit;
  const safeOrder = sortOrder === 'asc' ? 'ASC' : 'DESC';

  let whereClause = 'WHERE 1=1';
  const params: (string | number)[] = [];
  let paramIndex = 1;

  if (search) {
    whereClause += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }
  if (status) {
    whereClause += ` AND status = $${paramIndex}`;
    params.push(status);
    paramIndex++;
  }
  if (role) {
    whereClause += ` AND role = $${paramIndex}`;
    params.push(role);
    paramIndex++;
  }

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM users ${whereClause}`,
    params
  );
  const total = countResult.rows[0]?.total ?? 0;

  const selectParams = [...params, limit, offset];
  const { rows } = await pool.query(
    `SELECT ${SELECT_COLUMNS} FROM users ${whereClause}
     ORDER BY ${sortBy} ${safeOrder}
     LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    selectParams
  );

  return {
    data: rows as User[],
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function findById(id: string): Promise<User | null> {
  const { rows } = await pool.query(
    `SELECT ${SELECT_COLUMNS} FROM users WHERE id = $1`,
    [id]
  );
  return rows.length > 0 ? (rows[0] as User) : null;
}

export async function create(data: CreateUserDto): Promise<User> {
  const { email, name, role, status, avatar } = data;
  const { rows } = await pool.query(
    `INSERT INTO users (email, name, role, status, avatar)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${SELECT_COLUMNS}`,
    [email, name ?? null, role ?? 'user', status ?? 'active', avatar ?? null]
  );
  return rows[0] as User;
}

export async function update(id: string, data: Partial<UpdateUserDto>): Promise<User | null> {
  const updates: string[] = [];
  const values: (string | number | null)[] = [];
  let paramIndex = 1;

  if (data.email !== undefined) {
    updates.push(`email = $${paramIndex}`);
    values.push(data.email);
    paramIndex++;
  }
  if (data.name !== undefined) {
    updates.push(`name = $${paramIndex}`);
    values.push(data.name);
    paramIndex++;
  }
  if (data.role !== undefined) {
    updates.push(`role = $${paramIndex}`);
    values.push(data.role);
    paramIndex++;
  }
  if (data.status !== undefined) {
    updates.push(`status = $${paramIndex}`);
    values.push(data.status);
    paramIndex++;
  }
  if (data.avatar !== undefined) {
    updates.push(`avatar = $${paramIndex}`);
    values.push(data.avatar);
    paramIndex++;
  }
  if (data.review_count !== undefined) {
    updates.push(`review_count = $${paramIndex}`);
    values.push(data.review_count);
    paramIndex++;
  }

  if (updates.length === 0) {
    return findById(id);
  }

  updates.push('updated_at = NOW()');
  values.push(id);

  const { rows } = await pool.query(
    `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex}
     RETURNING ${SELECT_COLUMNS}`,
    values
  );
  return rows.length > 0 ? (rows[0] as User) : null;
}

export async function remove(id: string): Promise<boolean> {
  const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}
