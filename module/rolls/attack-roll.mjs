import MythCraftRoll from "./base-roll.mjs";

export default class AttackRoll extends MythCraftRoll {
  constructor(formula, data, options = {}) {
    super(formula, data, options);
    const { weaponName, attribute, defenseType, critHit, critFail, damageFormula, damageType } = options;
    const attrLabel = game.i18n.localize(`MYTHCRAFT.Attributes.${attribute}.abbr`);
    this.options.flavor ??= `${weaponName ?? game.i18n.localize("MYTHCRAFT.Roll.Attack")} (${attrLabel})`;
  }

  get weaponName() { return this.options.weaponName; }
  get attribute() { return this.options.attribute; }
  get defenseType() { return this.options.defenseType; }
  get critHit() { return this.options.critHit ?? 20; }
  get critFail() { return this.options.critFail ?? 1; }
  get damageFormula() { return this.options.damageFormula; }
  get damageType() { return this.options.damageType; }
  get isCriticalHit() { return this.dice[0]?.total >= this.critHit; }
  get isCriticalFail() { return this.dice[0]?.total <= this.critFail; }

  /** @override */
  async toMessage(messageData = {}, options = {}) {
    const template = 'systems/mythcraft/templates/chat/attack-card.hbs';
    const templateData = {
      weaponName: this.weaponName,
      attributeLabel: this.options.attribute ? game.i18n.localize(`MYTHCRAFT.Attributes.${this.options.attribute}.abbr`) : '',
      isCriticalHit: this.isCriticalHit,
      isCriticalFail: this.isCriticalFail,
      damageFormula: this.damageFormula,
      damageType: this.damageType,
      rollHTML: await this.render()
    };
    const content = await renderTemplate(template, templateData);
    messageData.content = content;
    return super.toMessage(messageData, options);
  }
}
