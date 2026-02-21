import { Router } from 'express';
import * as userController from '../controller/user.controller';

export const userRouter = Router();

userRouter.get('/', userController.list);
userRouter.get('/:id', userController.getById);
userRouter.post('/', userController.create);
userRouter.patch('/:id', userController.update);
userRouter.delete('/:id', userController.remove);
