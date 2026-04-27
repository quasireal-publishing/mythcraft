import { describe, it, expect } from 'vitest';
import AttackRoll from '../../../module/rolls/attack-roll.mjs';

describe('AttackRoll', () => {
  describe('critical detection', () => {
    function makeRoll(diceTotal, critHit = 20, critFail = 1) {
      const roll = new AttackRoll('1d20', {}, { critHit, critFail, weaponName: 'Test', attribute: 'str' });
      roll.dice = [{ total: diceTotal }];
      return roll;
    }

    it('d20=20, critHit=20 → critical hit', () => {
      expect(makeRoll(20).isCriticalHit).toBe(true);
    });
    it('d20=19, critHit=20 → not critical hit', () => {
      expect(makeRoll(19).isCriticalHit).toBe(false);
    });
    it('d20=18, critHit=18 → critical hit', () => {
      expect(makeRoll(18, 18).isCriticalHit).toBe(true);
    });
    it('d20=1, critFail=1 → critical fail', () => {
      expect(makeRoll(1).isCriticalFail).toBe(true);
    });
    it('d20=2, critFail=1 → not critical fail', () => {
      expect(makeRoll(2).isCriticalFail).toBe(false);
    });
    it('d20=2, critFail=3 → critical fail', () => {
      expect(makeRoll(2, 20, 3).isCriticalFail).toBe(true);
    });
  });

  describe('getters', () => {
    it('returns options values', () => {
      const roll = new AttackRoll('1d20', {}, {
        weaponName: 'Longsword', attribute: 'str',
        defenseType: 'ref', damageFormula: '2d6', damageType: 'sharp'
      });
      expect(roll.weaponName).toBe('Longsword');
      expect(roll.defenseType).toBe('ref');
      expect(roll.damageFormula).toBe('2d6');
    });
    it('defaults critHit=20, critFail=1', () => {
      const roll = new AttackRoll('1d20', {}, {});
      expect(roll.critHit).toBe(20);
      expect(roll.critFail).toBe(1);
    });
  });
});
