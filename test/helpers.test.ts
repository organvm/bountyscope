import { describe, it, expect } from 'vitest';
import { genApiKey, normalizeTier, extractApiKey, quotaIdent, tryParseJson } from '../src/index';

describe('genApiKey', () => {
  it('produces a bsk_-prefixed key of 48 hex chars', () => {
    const key = genApiKey();
    expect(key).toMatch(/^bsk_[0-9a-f]{48}$/);
  });

  it('is unique across calls', () => {
    expect(genApiKey()).not.toBe(genApiKey());
  });
});

describe('normalizeTier', () => {
  it('maps known tiers through', () => {
    expect(normalizeTier('pro')).toBe('pro');
    expect(normalizeTier('team')).toBe('team');
  });

  it('falls back to free for anything else', () => {
    expect(normalizeTier('free')).toBe('free');
    expect(normalizeTier('enterprise')).toBe('free');
    expect(normalizeTier(undefined)).toBe('free');
    expect(normalizeTier(null)).toBe('free');
    expect(normalizeTier(42)).toBe('free');
  });
});

describe('extractApiKey', () => {
  const make = (headers: Record<string, string>) => new Request('https://x/', { headers });

  it('reads a Bearer token', () => {
    expect(extractApiKey(make({ authorization: 'Bearer bsk_abc' }))).toBe('bsk_abc');
  });

  it('is case-insensitive on the Bearer scheme', () => {
    expect(extractApiKey(make({ authorization: 'bearer bsk_xyz' }))).toBe('bsk_xyz');
  });

  it('falls back to x-api-key (trimmed)', () => {
    expect(extractApiKey(make({ 'x-api-key': '  bsk_trim  ' }))).toBe('bsk_trim');
  });

  it('returns null when no key is present', () => {
    expect(extractApiKey(make({}))).toBeNull();
    expect(extractApiKey(make({ 'x-api-key': '   ' }))).toBeNull();
  });
});

describe('quotaIdent', () => {
  const req = new Request('https://x/', { headers: { 'cf-connecting-ip': '203.0.113.7' } });

  it('keys by API key when present', () => {
    expect(quotaIdent(req, 'bsk_k')).toBe('bsk_k');
  });

  it('keys by client IP when no API key', () => {
    expect(quotaIdent(req, null)).toBe('ip:203.0.113.7');
  });

  it('falls back to unknown IP', () => {
    expect(quotaIdent(new Request('https://x/'), null)).toBe('ip:unknown');
  });
});

describe('tryParseJson', () => {
  it('parses plain JSON', () => {
    expect(tryParseJson('{"a":1}')).toEqual({ a: 1 });
  });

  it('strips ```json fences', () => {
    expect(tryParseJson('```json\n{"b":2}\n```')).toEqual({ b: 2 });
  });

  it('passes objects through untouched', () => {
    const o = { c: 3 };
    expect(tryParseJson(o)).toBe(o);
  });

  it('returns null on nullish or invalid input', () => {
    expect(tryParseJson(null)).toBeNull();
    expect(tryParseJson(undefined)).toBeNull();
    expect(tryParseJson('not json')).toBeNull();
  });
});
