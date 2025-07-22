import MythCraftRoll from "./base-roll.mjs";

export default class AttributeRoll extends MythCraftRoll {
  constructor(formula = "1d20", data = {}, options = {}) {
    if (!options.flavor && options.attribute) {
      const abbr = game.i18n.localize(`MYTHCRAFT.Actor.base.FIELDS.attributes.${options.attribute}.label`);

      options.flavor = options.skill ?
        game.i18n.format("MYTHCRAFT.Roll.AttributeRoll.Flavor.Skill", { abbr, skill: game.i18n.localize(mythcraft.CONFIG.skills.list[options.skill]?.label) }) :
        game.i18n.format("MYTHCRAFT.Roll.AttributeRoll.Flavor.Attribute", { abbr });
    }
    super(formula, data, options);
  }
}
