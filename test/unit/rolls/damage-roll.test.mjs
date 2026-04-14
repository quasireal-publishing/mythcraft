import { describe, it, expect } from 'vitest';
import DamageRoll from '../../../module/rolls/damage-roll.mjs';

describe('DamageRoll', () => {
  describe('attributeModifier', () => {
    it('defaults to 0 when not set', () => {
      const roll = new DamageRoll('1d6', {}, {});
      expect(roll.attributeModifier).toBe(0);
    });
    it('returns the value when set', () => {
      const roll = new DamageRoll('1d6+3', {}, { attributeModifier: 3 });
      expect(roll.attributeModifier).toBe(3);
    });
  });

  describe('attributeLabel', () => {
    it('is undefined when not set', () => {
      const roll = new DamageRoll('1d6', {}, {});
      expect(roll.attributeLabel).toBeUndefined();
    });
    it('returns the value when set', () => {
      const roll = new DamageRoll('1d6+3', {}, { attributeLabel: 'Strength' });
      expect(roll.attributeLabel).toBe('Strength');
    });
  });

  describe('type', () => {
    it('returns the damage type from options', () => {
      const roll = new DamageRoll('1d6', {}, { type: 'fire' });
      expect(roll.type).toBe('fire');
    });
    it('defaults to empty string for non-heal rolls', () => {
      const roll = new DamageRoll('1d6', {}, {});
      expect(roll.type).toBe('');
    });
    it('defaults to "value" for heal rolls', () => {
      const roll = new DamageRoll('1d6', {}, { isHeal: true });
      expect(roll.type).toBe('value');
    });
  });

  describe('typeLabel', () => {
    it('localizes the damage type label', () => {
      globalThis.mythcraft.CONFIG.damage = { types: { fire: { label: 'MYTHCRAFT.Fire' } } };
      const roll = new DamageRoll('1d6', {}, { type: 'fire' });
      expect(roll.typeLabel).toBe('MYTHCRAFT.Fire');
    });
  });

  describe('ignoredImmunities', () => {
    it('defaults to empty array', () => {
      const roll = new DamageRoll('1d6', {}, {});
      expect(roll.ignoredImmunities).toEqual([]);
    });
    it('returns the value when set', () => {
      const roll = new DamageRoll('1d6', {}, { ignoredImmunities: ['fire'] });
      expect(roll.ignoredImmunities).toEqual(['fire']);
    });
  });

  describe('isHeal', () => {
    it('defaults to false', () => {
      const roll = new DamageRoll('1d6', {}, {});
      expect(roll.isHeal).toBe(false);
    });
    it('returns true when set', () => {
      const roll = new DamageRoll('1d6', {}, { isHeal: true });
      expect(roll.isHeal).toBe(true);
    });
  });
});
