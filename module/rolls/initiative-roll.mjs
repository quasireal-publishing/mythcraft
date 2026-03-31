import MythCraftRoll from './base-roll.mjs';

/**
 * Roll class for initiative checks in combat.
 */
export default class InitiativeRoll extends MythCraftRoll {
  constructor(formula, data, options = {}) {
    super(formula, data, options);
    this.options.flavor ??= game.i18n.localize('MYTHCRAFT.Roll.Initiative');
  }
}
