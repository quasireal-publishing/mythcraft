export function createCharacterData(overrides = {}) {
  return {
    level: 1,
    attributes: { str: 0, dex: 0, end: 0, awr: 0, int: 0, cha: 0, luck: 0, cor: 0 },
    hp: { value: 10, max: 0, shield: 0 },
    ap: { value: 3, special: 0, override: null },
    initiative: { bonus: 0, override: null },
    critical: { hit: 20, fail: 1 },
    hpOverride: null,
    skills: {},
    defenses: {},
    ...overrides,
  };
}

export function createMockRoll(total, diceTotal = total) {
  const roll = new foundry.dice.Roll();
  roll._evaluated = true;
  roll.total = total;
  roll.dice = [{ total: diceTotal }];
  return roll;
}
