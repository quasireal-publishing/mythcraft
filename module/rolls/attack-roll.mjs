import MythCraftRoll from "./base-roll.mjs";

export default class AttackRoll extends MythCraftRoll {
  constructor(formula, data, options = {}) {
    super(formula, data, options);
    const { weaponName, attribute } = options;
    const attrLabel = attribute
      ? game.i18n.localize(`MYTHCRAFT.Attributes.${attribute}.abbr`)
      : "";
    this.options.flavor ??= `${weaponName ?? game.i18n.localize("MYTHCRAFT.Roll.Attack")}${attrLabel ? ` (${attrLabel})` : ""}`;
  }

  get weaponName() { return this.options.weaponName; }
  get attribute() { return this.options.attribute; }
  get defenseTarget() { return this.options.defenseTarget ?? "ar"; }
  get critHit() { return this.options.critHit ?? 20; }
  get critFail() { return this.options.critFail ?? 1; }
  /** @type {Array<{formula: string, type: string}>} */
  get damage() { return this.options.damage ?? []; }
  get isCriticalHit() { return this.dice[0]?.total >= this.critHit; }
  get isCriticalFail() { return this.dice[0]?.total <= this.critFail; }

  get defenseTargetLabel() {
    return game.i18n.localize(`MYTHCRAFT.Defenses.${this.defenseTarget}.abbr`)
      || this.defenseTarget.toUpperCase();
  }

  /** @override */
  async toMessage(messageData = {}, options = {}) {
    const template = "systems/mythcraft/templates/chat/attack-card.hbs";
    const saveAttribute = this.options.saveAttribute
      ? game.i18n.localize(`MYTHCRAFT.Attributes.${this.options.saveAttribute}.abbr`)
      : "";
    const templateData = {
      weaponName: this.weaponName,
      attributeLabel: this.options.attribute
        ? game.i18n.localize(`MYTHCRAFT.Attributes.${this.options.attribute}.abbr`)
        : "",
      defenseTargetLabel: this.defenseTargetLabel,
      isCriticalHit: this.isCriticalHit,
      isCriticalFail: this.isCriticalFail,
      damage: this.damage,
      hasSave: this.options.hasSave ?? false,
      saveDC: this.options.saveDC ?? null,
      saveAttribute,
      rollHTML: await this.render(),
    };
    const content = await renderTemplate(template, templateData);
    messageData.content = content;
    return super.toMessage(messageData, options);
  }
}
