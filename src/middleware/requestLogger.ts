import { randomUUID } from 'node:crypto';
import type { Request, Response } from 'express';
import pinoHttp from 'pino-http';
import { logger } from '../logger';

function genReqId(req: Request, res: Response): string {
  const id = (req.headers['x-request-id'] as string) || randomUUID();
  res.setHeader('X-Request-Id', id);
  return id;
}

export const requestLogger = pinoHttp({
  logger,
  genReqId,
  customLogLevel(_req, res, err) {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage(req, res, _responseTime) {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },
  customErrorMessage(req, res, err) {
    return `${req.method} ${req.url} ${res.statusCode} - ${err?.message ?? 'error'}`;
  },
  serializers: {
    req: (req) => {
      const payload: Record<string, unknown> = {
        method: req.method,
        path: req.path,
        query: Object.keys(req.query || {}).length ? req.query : undefined,
      };
      if (req.body != null && typeof req.body === 'object' && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
        payload.body = req.body;
      }
      return payload;
    },
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});
