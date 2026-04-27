import { describe, it, expect } from 'vitest';

describe('evaluateFormula (smoke test)', () => {
  it('evaluates simple arithmetic', () => {
    const roll = new foundry.dice.Roll('10 + 5', {});
    roll.evaluateSync();
    expect(roll.total).toBe(15);
  });

  it('substitutes @variables from data', () => {
    const roll = new foundry.dice.Roll('10 + @bonus', { bonus: 3 });
    roll.evaluateSync();
    expect(roll.total).toBe(13);
  });
});
