import type { JwtPayload } from '../middleware/auth';

declare global {
  namespace Express {
    interface Request {
      validatedBody?: unknown;
      validatedQuery?: unknown;
      validatedParams?: unknown;
      /** Set by auth middleware after successful JWT verification. */
      auth?: JwtPayload;
    }
  }
}

export {};
