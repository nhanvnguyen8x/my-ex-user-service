import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

function formatZodError(err: ZodError): { message: string; details: Array<{ path: string[]; message: string }> } {
  const details = err.issues.map((e: z.ZodIssue) => ({
    path: e.path.map(String),
    message: e.message,
  }));
  const first = err.issues[0];
  const message = first ? `${first.path.join('.')}: ${first.message}` : 'Validation failed';
  return { message, details };
}

export function validateBody<T>(schema: z.ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (result.success) {
      (req as Request & { validatedBody?: T }).validatedBody = result.data;
      next();
      return;
    }
    res.status(400).json(formatZodError(result.error));
  };
}

export function validateQuery<T>(schema: z.ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (result.success) {
      (req as Request & { validatedQuery?: T }).validatedQuery = result.data;
      next();
      return;
    }
    res.status(400).json(formatZodError(result.error));
  };
}

export function validateParams<T>(schema: z.ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);
    if (result.success) {
      (req as Request & { validatedParams?: T }).validatedParams = result.data;
      next();
      return;
    }
    res.status(400).json(formatZodError(result.error));
  };
}
