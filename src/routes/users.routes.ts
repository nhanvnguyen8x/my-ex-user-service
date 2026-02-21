import { Router } from 'express';
import * as userController from '../controller/user.controller';
import { validateBody, validateQuery, validateParams } from '../middleware/validate';
import {
  createUserBodySchema,
  updateUserBodySchema,
  listUsersQuerySchema,
  uuidParamSchema,
} from '../schemas/user.schemas';

export const userRouter = Router();

userRouter.get('/', validateQuery(listUsersQuerySchema), userController.list);
userRouter.get('/:id', validateParams(uuidParamSchema), userController.getById);
userRouter.post('/', validateBody(createUserBodySchema), userController.create);
userRouter.patch('/:id', validateParams(uuidParamSchema), validateBody(updateUserBodySchema), userController.update);
userRouter.delete('/:id', validateParams(uuidParamSchema), userController.remove);
