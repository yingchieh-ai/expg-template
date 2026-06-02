import { describe, test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import csrf, {
  generateCsrfToken,
  csrfCookieOptions,
  CSRF_COOKIE,
  CSRF_HEADER,
} from '@/middlewares/csrf';

type Req = Parameters<typeof csrf>[0];
type Res = Parameters<typeof csrf>[1];
type Next = Parameters<typeof csrf>[2];

function makeReq(
  method: string,
  cookies: Record<string, string> = {},
  headers: Record<string, string> = {}
): Req {
  return { method, cookies, headers } as unknown as Req;
}

function makeRes(): Res & { _status: number; _body: unknown } {
  const res = {
    _status: 200,
    _body: undefined as unknown,
    status(code: number) {
      this._status = code;
      return this;
    },
    json(body: unknown) {
      this._body = body;
      return this;
    },
  };
  return res as unknown as Res & { _status: number; _body: unknown };
}

describe('generateCsrfToken', () => {
  test('returns a 64-character hex string', () => {
    assert.match(generateCsrfToken(), /^[0-9a-f]{64}$/);
  });

  test('returns a different value each call', () => {
    assert.notEqual(generateCsrfToken(), generateCsrfToken());
  });
});

describe('csrfCookieOptions', () => {
  let savedNodeEnv: string | undefined;

  beforeEach(() => {
    savedNodeEnv = process.env['NODE_ENV'];
  });

  afterEach(() => {
    if (savedNodeEnv === undefined) delete process.env['NODE_ENV'];
    else process.env['NODE_ENV'] = savedNodeEnv;
  });

  test('secure is false outside production', () => {
    process.env['NODE_ENV'] = 'development';
    assert.equal(csrfCookieOptions(3600).secure, false);
  });

  test('secure is true in production', () => {
    process.env['NODE_ENV'] = 'production';
    assert.equal(csrfCookieOptions(3600).secure, true);
  });

  test('sets expected static options', () => {
    const opts = csrfCookieOptions(60_000);
    assert.equal(opts.httpOnly, false);
    assert.equal(opts.sameSite, 'lax');
    assert.equal(opts.path, '/');
    assert.equal(opts.maxAge, 60_000);
  });
});

describe('csrf middleware', () => {
  test('calls next for GET', () => {
    let called = false;
    csrf(makeReq('GET'), makeRes(), (() => {
      called = true;
    }) as Next);
    assert.ok(called);
  });

  test('calls next for HEAD', () => {
    let called = false;
    csrf(makeReq('HEAD'), makeRes(), (() => {
      called = true;
    }) as Next);
    assert.ok(called);
  });

  test('calls next for OPTIONS', () => {
    let called = false;
    csrf(makeReq('OPTIONS'), makeRes(), (() => {
      called = true;
    }) as Next);
    assert.ok(called);
  });

  test('returns 403 when cookie token is missing', () => {
    const res = makeRes();
    let called = false;
    csrf(makeReq('POST', {}, { [CSRF_HEADER]: 'abc' }), res, (() => {
      called = true;
    }) as Next);
    assert.equal(res._status, 403);
    assert.ok(!called);
  });

  test('returns 403 when header token is missing', () => {
    const res = makeRes();
    let called = false;
    csrf(makeReq('POST', { [CSRF_COOKIE]: 'abc' }), res, (() => {
      called = true;
    }) as Next);
    assert.equal(res._status, 403);
    assert.ok(!called);
  });

  test('returns 403 when tokens do not match', () => {
    const res = makeRes();
    let called = false;
    csrf(makeReq('POST', { [CSRF_COOKIE]: 'aaaa' }, { [CSRF_HEADER]: 'bbbb' }), res, (() => {
      called = true;
    }) as Next);
    assert.equal(res._status, 403);
    assert.ok(!called);
  });

  test('calls next when tokens match', () => {
    const token = generateCsrfToken();
    let called = false;
    csrf(makeReq('POST', { [CSRF_COOKIE]: token }, { [CSRF_HEADER]: token }), makeRes(), (() => {
      called = true;
    }) as Next);
    assert.ok(called);
  });
});
