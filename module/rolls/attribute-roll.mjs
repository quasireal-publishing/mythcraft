import MythCraftRoll from "./base-roll.mjs";

export default class AttributeRoll extends MythCraftRoll {
  constructor(formula = "1d20", data = {}, options = {}) {
    if (!options.flavor && options.attribute) {
      const abbr = _loc(`MYTHCRAFT.Actor.base.FIELDS.attributes.${options.attribute}.label`);

      options.flavor = options.skill ?
        _loc("MYTHCRAFT.Roll.AttributeRoll.Flavor.Skill", { abbr, skill: _loc(mythcraft.CONFIG.skills.list[options.skill]?.label) }) :
        _loc("MYTHCRAFT.Roll.AttributeRoll.Flavor.Attribute", { abbr });
    }
    super(formula, data, options);
  }
}
