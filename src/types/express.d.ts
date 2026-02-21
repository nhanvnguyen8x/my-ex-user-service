import type { CreateUserBody, UpdateUserBody, ListUsersQuery } from '../schemas/user.schemas';

declare global {
  namespace Express {
    interface Request {
      validatedBody?: CreateUserBody | UpdateUserBody;
      validatedQuery?: ListUsersQuery;
      validatedParams?: { id: string };
    }
  }
}

export {};
