const { ActiveEffectConfig } = foundry.applications.sheets;

/**
 * MythCraft-branded ActiveEffect configuration sheet.
 * Adds the .mythcraft.sheet classes so the system's paper theme applies;
 * otherwise inherits all of Foundry's stock behaviour.
 */
export default class MythCraftActiveEffectConfig extends ActiveEffectConfig {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["mythcraft", "sheet"],
  };
}
