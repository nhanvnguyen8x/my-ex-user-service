import { Request, Response } from 'express';
import * as userService from '../service/user.service';
import type { CreateUserBody, UpdateUserBody, ListUsersQuery } from '../schemas/user.schemas';
import { asyncHandler } from '../middleware/asyncHandler';

function getId(req: Request): string {
  return (req.validatedParams as { id: string }).id;
}

export const list = asyncHandler(async (req, res) => {
  const query = req.validatedQuery as ListUsersQuery;
  const result = await userService.listUsers(query);
  res.json(result);
});

export const getById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(getId(req));
  if (!user) throw new userService.NotFoundError();
  res.json(user);
});

export const create = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.validatedBody as CreateUserBody);
  res.status(201).json(user);
});

export const update = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(getId(req), req.validatedBody as UpdateUserBody);
  if (!user) throw new userService.NotFoundError();
  res.json(user);
});

export const remove = asyncHandler(async (req, res) => {
  const deleted = await userService.deleteUser(getId(req));
  if (!deleted) throw new userService.NotFoundError();
  res.status(204).send();
});
