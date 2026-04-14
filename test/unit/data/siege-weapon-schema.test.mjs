import { describe, it, expect } from 'vitest';
import SiegeWeaponData from '../../../module/data/actor/siege-weapon.mjs';

describe('SiegeWeaponData.defineSchema', () => {
  const schema = SiegeWeaponData.defineSchema();

  it('has all expected top-level keys', () => {
    const keys = Object.keys(schema);
    expect(keys).toEqual(expect.arrayContaining([
      'range', 'ammunition', 'reload', 'aoe', 'speed',
      'hp', 'ar', 'defenses', 'resistances', 'reduction', 'threshold', 'description'
    ]));
  });

  it('defenses has only ref and fort (not full actor defenses)', () => {
    const defKeys = Object.keys(schema.defenses.fields);
    expect(defKeys).toEqual(['ref', 'fort']);
  });

  it('resistances has resist, immune, vulnerable as SetFields', () => {
    const resKeys = Object.keys(schema.resistances.fields);
    expect(resKeys).toEqual(expect.arrayContaining(['resist', 'immune', 'vulnerable']));
  });
});
