import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { parseDuration } from '@/routes/auth';

describe('parseDuration', () => {
  test("'7d' returns 7 days in ms", () => {
    assert.equal(parseDuration('7d'), 7 * 24 * 60 * 60 * 1000);
  });

  test("'1h' returns 1 hour in ms", () => {
    assert.equal(parseDuration('1h'), 60 * 60 * 1000);
  });

  test("'30m' returns 30 minutes in ms", () => {
    assert.equal(parseDuration('30m'), 30 * 60 * 1000);
  });

  test("'5s' returns 5 seconds in ms", () => {
    assert.equal(parseDuration('5s'), 5_000);
  });

  test('bare number is treated as seconds', () => {
    assert.equal(parseDuration('100'), 100_000);
  });

  test('invalid string falls back to 7-day default', () => {
    assert.equal(parseDuration('invalid'), 7 * 24 * 60 * 60 * 1000);
  });
});
