import MythCraftRoll from "./base-roll.mjs";

export default class SpellRoll extends MythCraftRoll {
  constructor(formula, data, options = {}) {
    super(formula, data, options);
    const {spellName, source, isPrimary} = options;
    const sourceLabel = source ? game.i18n.localize(`MYTHCRAFT.Spells.Sources.${source}`) : "";
    this.options.flavor ??= `${spellName ?? game.i18n.localize("MYTHCRAFT.Roll.Spell")} (${sourceLabel})`;
  }

  get spellName() { return this.options.spellName; }
  get source() { return this.options.source; }
  get isPrimary() { return this.options.isPrimary ?? true; }
  get range() { return this.options.range; }
  get duration() { return this.options.duration; }
  get spc() { return this.options.spc; }
  get damageFormula() { return this.options.damageFormula; }
  get damageType() { return this.options.damageType; }

  /** @override */
  async toMessage(messageData = {}, options = {}) {
    const template = 'systems/mythcraft/templates/chat/spell-card.hbs';
    const sourceLabel = this.source ? game.i18n.localize(`MYTHCRAFT.Spells.Sources.${this.source}`) : '';
    const templateData = {
      spellName: this.spellName,
      source: this.source,
      sourceLabel,
      isPrimary: this.isPrimary,
      hasRoll: this.terms.length > 0,
      range: this.range,
      duration: this.duration,
      spc: this.spc,
      damageFormula: this.damageFormula,
      damageType: this.damageType,
      rollHTML: await this.render()
    };
    const content = await renderTemplate(template, templateData);
    messageData.content = content;
    return super.toMessage(messageData, options);
  }
}
