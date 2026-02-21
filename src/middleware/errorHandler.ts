import type { Request, Response, NextFunction } from 'express';
import { logger } from '../logger';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  const log = (res as Response & { log?: typeof logger }).log ?? logger;
  const statusCode = (err as { statusCode?: number }).statusCode ?? 500;
  const message = err instanceof Error ? err.message : 'Internal server error';
  const stack = err instanceof Error ? err.stack : undefined;
  const errObj = err instanceof Error ? err : new Error(String(err));

  (res as Response & { err?: Error }).err = errObj;
  log.error(
    {
      err: { message, stack, ...(err && typeof err === 'object' && !(err instanceof Error) ? err : {}) },
      statusCode,
    },
    `Exception: ${message}`
  );

  if (!res.headersSent) {
    res.status(statusCode).json({ error: message });
  }
}
