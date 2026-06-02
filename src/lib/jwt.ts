import jwt from 'jsonwebtoken';

export interface AppJwtPayload {
  sub: string;
  email: string;
}

function getAppName(): string {
  return process.env.APP_NAME ?? 'app';
}

export function signToken(payload: AppJwtPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  const expiresIn = process.env.JWT_EXPIRES_IN ?? '7d';
  const appName = getAppName();
  return jwt.sign(payload, secret, {
    expiresIn,
    issuer: appName,
    audience: appName,
  } as jwt.SignOptions);
}

export function verifyToken(token: string): AppJwtPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  const appName = getAppName();
  return jwt.verify(token, secret, { issuer: appName, audience: appName }) as AppJwtPayload;
}
