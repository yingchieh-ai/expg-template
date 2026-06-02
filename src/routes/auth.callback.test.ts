import { describe, test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { createAuthRouter } from '@/routes/auth';

const MOCK_USER = { id: 'user-1', email: 'test@example.com' };

let handleCallbackCalls: string[] = [];

const mockProviders = {
  google: {
    getAuthUrl: (state: string) => `https://oauth.google.com/auth?state=${state}`,
    handleCallback: async (code: string) => {
      handleCallbackCalls.push(code);
      return MOCK_USER;
    },
  },
};

function buildApp() {
  const app = express();
  app.use(cookieParser());
  app.use('/auth', createAuthRouter(mockProviders));
  return app;
}

beforeEach(() => {
  handleCallbackCalls = [];
  process.env['JWT_SECRET'] = 'test-secret-at-least-32-chars-long';
  process.env['APP_NAME'] = 'test-app';
});

describe('GET /auth/:provider', () => {
  test('returns 404 for unknown provider', async () => {
    const res = await request(buildApp()).get('/auth/unknown');
    assert.equal(res.status, 404);
    assert.deepEqual(res.body, { error: 'Unknown provider' });
  });

  test('redirects to OAuth URL and sets state cookie', async () => {
    const res = await request(buildApp()).get('/auth/google');
    assert.equal(res.status, 302);
    assert.ok(res.headers['location']?.startsWith('https://oauth.google.com'));
    const raw = res.headers['set-cookie'];
    const cookies: string[] = Array.isArray(raw) ? raw : raw ? [raw] : [];
    assert.ok(
      cookies.some((c) => c.startsWith('__oauth_state=')),
      'state cookie missing'
    );
  });
});

describe('GET /auth/:provider/callback', () => {
  test('returns 404 for unknown provider', async () => {
    const res = await request(buildApp()).get('/auth/unknown/callback');
    assert.equal(res.status, 404);
  });

  test('redirects with error when OAuth error param is present', async () => {
    const res = await request(buildApp()).get('/auth/google/callback?error=access_denied');
    assert.equal(res.status, 302);
    assert.match(res.headers['location'] ?? '', /\?error=auth_failed/);
  });

  test('returns 400 when state is missing', async () => {
    const res = await request(buildApp()).get('/auth/google/callback?code=abc123');
    assert.equal(res.status, 400);
    assert.deepEqual(res.body, { error: 'Invalid state parameter' });
  });

  test('returns 400 when state does not match cookie', async () => {
    const res = await request(buildApp())
      .get('/auth/google/callback?code=abc123&state=wrong')
      .set('Cookie', '__oauth_state=correct');
    assert.equal(res.status, 400);
    assert.deepEqual(res.body, { error: 'Invalid state parameter' });
  });

  test('returns 400 when code is missing', async () => {
    const res = await request(buildApp())
      .get('/auth/google/callback?state=test-state')
      .set('Cookie', '__oauth_state=test-state');
    assert.equal(res.status, 400);
    assert.deepEqual(res.body, { error: 'Missing authorization code' });
  });

  test('sets session and CSRF cookies on successful callback', async () => {
    const state = 'valid-state-xyz';
    const res = await request(buildApp())
      .get(`/auth/google/callback?code=auth-code-123&state=${state}`)
      .set('Cookie', `__oauth_state=${state}`);

    assert.equal(res.status, 302);
    const raw = res.headers['set-cookie'];
    const cookies: string[] = Array.isArray(raw) ? raw : raw ? [raw] : [];
    assert.ok(
      cookies.some((c) => c.startsWith('session=')),
      'session cookie missing'
    );
    assert.ok(
      cookies.some((c) => c.startsWith('__csrf=')),
      'CSRF cookie missing'
    );
    assert.deepEqual(handleCallbackCalls, ['auth-code-123']);
  });
});
