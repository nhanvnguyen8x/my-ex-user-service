import { Request, Response } from 'express';
import * as userService from '../service/user.service';

export async function list(req: Request, res: Response): Promise<void> {
  try {
    const query = req.validatedQuery!;
    const result = await userService.listUsers(query);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
}

export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const id = req.validatedParams!.id;
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
    const user = await userService.createUser(req.validatedBody as import('../schemas/user.schemas').CreateUserBody);
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
    const id = req.validatedParams!.id;
    const user = await userService.updateUser(id, req.validatedBody as import('../schemas/user.schemas').UpdateUserBody);
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
    const id = req.validatedParams!.id;
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
