import { describe, it, expect } from 'vitest';
import { getHitDie, calculateHpMax, calculateApMax, calculateInitiative, calculateCriticalRanges } from '../../../module/utils/character-math.mjs';

describe('getHitDie', () => {
  it.each([
    [-3, 4], [0, 4], [2, 4],   // boundary: ≤2 → d4
    [3, 6], [5, 6],             // boundary: ≤5 → d6
    [6, 8], [8, 8],             // boundary: ≤8 → d8
    [9, 10], [11, 10],          // boundary: ≤11 → d10
    [12, 12],                   // boundary: ≥12 → d12
  ])('END %i → d%i', (end, expected) => {
    expect(getHitDie(end)).toBe(expected);
  });
});

describe('calculateHpMax', () => {
  it('level 1, END 0 (d4): 10 + 4 + 1 = 15', () => {
    expect(calculateHpMax(1, 0)).toBe(15);
  });
  it('level 5, END 5 (d6): 10 + 30 + 5 = 45', () => {
    expect(calculateHpMax(5, 5)).toBe(45);
  });
  it('level 10, END 12 (d12): 10 + 120 + 10 = 140', () => {
    expect(calculateHpMax(10, 12)).toBe(140);
  });
  it('override takes precedence', () => {
    expect(calculateHpMax(10, 12, 50)).toBe(50);
  });
  it('override null uses formula', () => {
    expect(calculateHpMax(1, 0, null)).toBe(15);
  });
});

describe('calculateApMax', () => {
  it.each([
    [0, null, 3],    // 3 + ceil(0) = 3
    [1, null, 4],    // 3 + ceil(0.5) = 4
    [6, null, 6],    // 3 + ceil(3) = 6
    [-3, null, 2],   // 3 + ceil(-1.5) = 2
    [6, 5, 5],       // override
  ])('COR %i, override %s → %i', (cor, override, expected) => {
    expect(calculateApMax(cor, override)).toBe(expected);
  });
});

describe('calculateInitiative', () => {
  it('AWR 3 + bonus 2 = 5', () => {
    expect(calculateInitiative(3, 2)).toBe(5);
  });
  it('negative AWR works', () => {
    expect(calculateInitiative(-2, 0)).toBe(-2);
  });
  it('override takes precedence', () => {
    expect(calculateInitiative(3, 2, 10)).toBe(10);
  });
});

describe('calculateCriticalRanges', () => {
  it('no luck → effectiveHit = hit', () => {
    expect(calculateCriticalRanges(20, 1, 0)).toEqual({ effectiveHit: 20, effectiveFail: 1 });
  });
  it('luck 3 → effectiveHit = 17', () => {
    expect(calculateCriticalRanges(20, 1, 3)).toEqual({ effectiveHit: 17, effectiveFail: 1 });
  });
  it('negative luck ignored', () => {
    expect(calculateCriticalRanges(20, 1, -2)).toEqual({ effectiveHit: 20, effectiveFail: 1 });
  });
  it('custom hit base', () => {
    expect(calculateCriticalRanges(18, 1, 2)).toEqual({ effectiveHit: 16, effectiveFail: 1 });
  });
});
