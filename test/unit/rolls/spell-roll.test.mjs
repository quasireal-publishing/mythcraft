import { describe, it, expect } from 'vitest';
import SpellRoll from '../../../module/rolls/spell-roll.mjs';

describe('SpellRoll', () => {
  it('returns options values', () => {
    const roll = new SpellRoll('1d20', {}, {
      spellName: 'Fireball', source: 'arcane', isPrimary: true, spc: 5
    });
    expect(roll.spellName).toBe('Fireball');
    expect(roll.source).toBe('arcane');
    expect(roll.isPrimary).toBe(true);
    expect(roll.spc).toBe(5);
  });
  it('isPrimary defaults to true', () => {
    const roll = new SpellRoll('1d20', {}, {});
    expect(roll.isPrimary).toBe(true);
  });
  it('damageFormula from options', () => {
    const roll = new SpellRoll('1d20', {}, { damageFormula: '3d6', damageType: 'fire' });
    expect(roll.damageFormula).toBe('3d6');
    expect(roll.damageType).toBe('fire');
  });
});
