import { describe, test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { signToken, verifyToken } from '@/lib/jwt';

const SECRET = 'test-secret-at-least-32-chars-long';
const PAYLOAD = { sub: 'user-1', email: 'a@example.com' };

describe('signToken', () => {
  let savedSecret: string | undefined;
  let savedExpiresIn: string | undefined;

  beforeEach(() => {
    savedSecret = process.env['JWT_SECRET'];
    savedExpiresIn = process.env['JWT_EXPIRES_IN'];
    process.env['JWT_SECRET'] = SECRET;
    delete process.env['JWT_EXPIRES_IN'];
  });

  afterEach(() => {
    if (savedSecret === undefined) delete process.env['JWT_SECRET'];
    else process.env['JWT_SECRET'] = savedSecret;
    if (savedExpiresIn === undefined) delete process.env['JWT_EXPIRES_IN'];
    else process.env['JWT_EXPIRES_IN'] = savedExpiresIn;
  });

  test('returns a non-empty string', () => {
    const token = signToken(PAYLOAD);
    assert.ok(token.length > 0);
  });

  test('throws when JWT_SECRET is not set', () => {
    delete process.env['JWT_SECRET'];
    assert.throws(() => signToken(PAYLOAD), { message: 'JWT_SECRET is not set' });
  });
});

describe('verifyToken', () => {
  let savedSecret: string | undefined;

  beforeEach(() => {
    savedSecret = process.env['JWT_SECRET'];
    process.env['JWT_SECRET'] = SECRET;
  });

  afterEach(() => {
    if (savedSecret === undefined) delete process.env['JWT_SECRET'];
    else process.env['JWT_SECRET'] = savedSecret;
  });

  test('round-trips the payload', () => {
    const token = signToken(PAYLOAD);
    const decoded = verifyToken(token);
    assert.equal(decoded.sub, PAYLOAD.sub);
    assert.equal(decoded.email, PAYLOAD.email);
  });

  test('throws when JWT_SECRET is not set', () => {
    const token = signToken(PAYLOAD);
    delete process.env['JWT_SECRET'];
    assert.throws(() => verifyToken(token), { message: 'JWT_SECRET is not set' });
  });

  test('throws on an invalid token string', () => {
    assert.throws(() => verifyToken('not.a.valid.token'));
  });

  test('throws on an expired token', () => {
    const expired = jwt.sign(PAYLOAD, SECRET, { expiresIn: 0 });
    assert.throws(() => verifyToken(expired), { name: 'TokenExpiredError' });
  });
});
