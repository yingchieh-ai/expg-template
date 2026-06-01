import { randomBytes, timingSafeEqual } from 'crypto';
import type { CookieOptions, RequestHandler } from 'express';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export const CSRF_COOKIE = '__csrf';
export const CSRF_HEADER = 'x-csrf-token';

export function generateCsrfToken(): string {
  return randomBytes(32).toString('hex');
}

export function csrfCookieOptions(maxAge: number): CookieOptions {
  return {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
    path: '/',
  };
}

const csrf: RequestHandler = (req, res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();

  const cookieToken = req.cookies[CSRF_COOKIE] as string | undefined;
  const rawHeader = req.headers[CSRF_HEADER];
  const headerToken = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;

  if (!cookieToken || !headerToken) {
    res.status(403).json({ error: 'Invalid CSRF token' });
    return;
  }

  const bufA = Buffer.from(cookieToken);
  const bufB = Buffer.from(headerToken);

  if (bufA.length !== bufB.length || !timingSafeEqual(bufA, bufB)) {
    res.status(403).json({ error: 'Invalid CSRF token' });
    return;
  }

  next();
};

export default csrf;
