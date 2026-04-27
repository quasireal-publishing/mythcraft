import { describe, it, expect } from 'vitest';
import { migrateCurrencyData } from '../../../module/utils/migrations.mjs';

describe('migrateCurrencyData', () => {
  it('maps all old keys to new keys', () => {
    expect(migrateCurrencyData({ a: 10, sc: 20, q: 50, dc: 5 }))
      .toEqual({ astra: 10, scillings: 20, quints: 50, denarii: 5 });
  });
  it('handles partial keys', () => {
    expect(migrateCurrencyData({ a: 10 })).toEqual({ astra: 10 });
  });
  it('returns empty for empty object', () => {
    expect(migrateCurrencyData({})).toEqual({});
  });
  it('returns empty for null', () => {
    expect(migrateCurrencyData(null)).toEqual({});
  });
  it('returns empty for undefined', () => {
    expect(migrateCurrencyData(undefined)).toEqual({});
  });
});
