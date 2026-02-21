import { Request, Response } from 'express';
import * as userService from '../service/user.service';
import { SORT_KEYS, type SortKey } from '../model/user.model';
import type { CreateUserDto, UpdateUserDto, ListQuery } from '../model/user.model';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

function parseListQuery(req: Request): ListQuery {
  const page = Math.max(1, parseInt(String(req.query.page), 10) || DEFAULT_PAGE);
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(String(req.query.limit), 10) || DEFAULT_LIMIT));
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  const status = typeof req.query.status === 'string' && req.query.status.trim() ? req.query.status.trim() : null;
  const role = typeof req.query.role === 'string' && req.query.role.trim() ? req.query.role.trim() : null;
  const sortBy = SORT_KEYS.includes(req.query.sortBy as SortKey) ? (req.query.sortBy as SortKey) : 'created_at';
  const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc';
  return { search, status, role, page, limit, sortBy, sortOrder };
}

export async function list(req: Request, res: Response): Promise<void> {
  try {
    const query = parseListQuery(req);
    const result = await userService.listUsers(query);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
}

export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id ?? '');
    const user = await userService.getUserById(id);
    if (!user) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
}

export async function create(req: Request, res: Response): Promise<void> {
  try {
    const user = await userService.createUser(req.body as CreateUserDto);
    res.status(201).json(user);
  } catch (e) {
    if (e instanceof userService.ValidationError) {
      res.status(400).json({ error: e.message });
      return;
    }
    if (e instanceof userService.ConflictError) {
      res.status(409).json({ error: e.message });
      return;
    }
    res.status(500).json({ error: (e as Error).message });
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id ?? '');
    const user = await userService.updateUser(id, req.body as UpdateUserDto);
    if (!user) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json(user);
  } catch (e) {
    if (e instanceof userService.ValidationError) {
      res.status(400).json({ error: e.message });
      return;
    }
    if (e instanceof userService.ConflictError) {
      res.status(409).json({ error: e.message });
      return;
    }
    res.status(500).json({ error: (e as Error).message });
  }
}

export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id ?? '');
    const deleted = await userService.deleteUser(id);
    if (!deleted) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
}
