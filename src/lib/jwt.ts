import jwt from 'jsonwebtoken';

export interface AppJwtPayload {
  sub: string;
  email: string;
}

export function signToken(payload: AppJwtPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  const expiresIn = process.env.JWT_EXPIRES_IN ?? '7d';
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string): AppJwtPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return jwt.verify(token, secret) as AppJwtPayload;
}
