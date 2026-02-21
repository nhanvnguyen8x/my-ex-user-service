import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/** Payload attached to req.auth after successful JWT verification. */
export interface JwtPayload {
  sub: string;
  accountId?: string;
  email?: string;
  role?: string;
  scope?: string | string[];
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

const BEARER_PREFIX = 'Bearer ';

function getSecretOrPublicKey(): string {
  const publicKey = process.env.JWT_PUBLIC_KEY;
  if (publicKey) return publicKey.replace(/\\n/g, '\n');
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  throw new Error('JWT verification requires JWT_SECRET or JWT_PUBLIC_KEY');
}

function getAlgorithm(): jwt.Algorithm | jwt.Algorithm[] {
  if (process.env.JWT_PUBLIC_KEY) return ['RS256', 'RS384', 'RS512'];
  return process.env.JWT_ALGORITHM as jwt.Algorithm || 'HS256';
}

/**
 * Middleware that verifies the JWT from the Authorization: Bearer <token> header
 * and attaches the decoded payload to req.auth. Responds with 401 when missing or invalid.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const raw = req.headers.authorization;
  if (!raw || typeof raw !== 'string' || !raw.startsWith(BEARER_PREFIX)) {
    res.status(401).json({ error: 'Missing or invalid Authorization header (expected Bearer <token>)' });
    return;
  }
  const token = raw.slice(BEARER_PREFIX.length).trim();
  if (!token) {
    res.status(401).json({ error: 'Missing token' });
    return;
  }

  try {
    const secretOrKey = getSecretOrPublicKey();
    const algorithm = getAlgorithm();
    const decoded = jwt.verify(token, secretOrKey, {
      algorithms: Array.isArray(algorithm) ? algorithm : [algorithm],
      complete: false,
    }) as JwtPayload;
    (req as Request & { auth: JwtPayload }).auth = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expired' });
      return;
    }
    if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
    if (err instanceof Error && err.message.includes('JWT verification requires')) {
      res.status(500).json({ error: 'Server auth configuration error' });
      return;
    }
    res.status(401).json({ error: 'Unauthorized' });
  }
}

/**
 * Optional auth: if a valid Bearer token is present, sets req.auth; otherwise continues without it.
 * Use for routes that behave differently for authenticated vs anonymous users.
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  const raw = req.headers.authorization;
  if (!raw || typeof raw !== 'string' || !raw.startsWith(BEARER_PREFIX)) {
    next();
    return;
  }
  const token = raw.slice(BEARER_PREFIX.length).trim();
  if (!token) {
    next();
    return;
  }
  try {
    const secretOrKey = getSecretOrPublicKey();
    const algorithm = getAlgorithm();
    const decoded = jwt.verify(token, secretOrKey, {
      algorithms: Array.isArray(algorithm) ? algorithm : [algorithm],
      complete: false,
    }) as JwtPayload;
    (req as Request & { auth: JwtPayload }).auth = decoded;
  } catch {
    // Ignore invalid token for optional auth
  }
  next();
}
