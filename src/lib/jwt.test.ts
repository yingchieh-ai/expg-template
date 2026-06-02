import { describe, test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { signToken, verifyToken } from '@/lib/jwt';

const SECRET = 'test-secret-at-least-32-chars-long';
const PAYLOAD = { sub: 'user-1', email: 'a@example.com' };

describe('signToken', () => {
  let savedSecret: string | undefined;
  let savedExpiresIn: string | undefined;
  let savedAppName: string | undefined;

  beforeEach(() => {
    savedSecret = process.env['JWT_SECRET'];
    savedExpiresIn = process.env['JWT_EXPIRES_IN'];
    savedAppName = process.env['APP_NAME'];
    process.env['JWT_SECRET'] = SECRET;
    process.env['APP_NAME'] = 'test-app';
    delete process.env['JWT_EXPIRES_IN'];
  });

  afterEach(() => {
    if (savedSecret === undefined) delete process.env['JWT_SECRET'];
    else process.env['JWT_SECRET'] = savedSecret;
    if (savedExpiresIn === undefined) delete process.env['JWT_EXPIRES_IN'];
    else process.env['JWT_EXPIRES_IN'] = savedExpiresIn;
    if (savedAppName === undefined) delete process.env['APP_NAME'];
    else process.env['APP_NAME'] = savedAppName;
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
  let savedAppName: string | undefined;

  beforeEach(() => {
    savedSecret = process.env['JWT_SECRET'];
    savedAppName = process.env['APP_NAME'];
    process.env['JWT_SECRET'] = SECRET;
    process.env['APP_NAME'] = 'test-app';
  });

  afterEach(() => {
    if (savedSecret === undefined) delete process.env['JWT_SECRET'];
    else process.env['JWT_SECRET'] = savedSecret;
    if (savedAppName === undefined) delete process.env['APP_NAME'];
    else process.env['APP_NAME'] = savedAppName;
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
    const expired = jwt.sign(PAYLOAD, SECRET, {
      expiresIn: 0,
      issuer: 'test-app',
      audience: 'test-app',
    });
    assert.throws(() => verifyToken(expired), { name: 'TokenExpiredError' });
  });

  test('throws when issuer or audience do not match', () => {
    const wrongClaims = jwt.sign(PAYLOAD, SECRET, { issuer: 'other', audience: 'other' });
    assert.throws(() => verifyToken(wrongClaims));
  });

  test('embeds iss and aud claims from APP_NAME', () => {
    const token = signToken(PAYLOAD);
    const decoded = jwt.decode(token) as Record<string, unknown>;
    assert.equal(decoded['iss'], 'test-app');
    assert.equal(decoded['aud'], 'test-app');
  });
});
