import { systemPath } from "../../constants.mjs";
import enrichHTML from "../../utils/enrich-html.mjs";
import BaseItemModel from "./base-item.mjs";

/**
 * @import { FormSelectOption } from "@client/applications/forms/fields.mjs";
 */

/**
 * The system model for "spell" items.
 */
export default class SpellModel extends BaseItemModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = super.LOCALIZATION_PREFIXES.concat("MYTHCRAFT.Item.spell");

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static defineSchema() {
    const schema = super.defineSchema();

    const fields = foundry.data.fields;

    schema.magicSource = new fields.StringField({ required: true });

    schema.apc = new fields.NumberField({ integer: true, min: 0 });

    schema.spc = new fields.NumberField({ integer: true, min: 0 });

    schema.range = new fields.SchemaField({
      value: new fields.NumberField(),
      unit: new fields.StringField({ initial: "ft" }),
    });

    schema.requirements = new fields.SetField(new fields.StringField({ required: true, blank: false }));

    schema.duration = new fields.SchemaField({
      value: new fields.NumberField(),
      unit: new fields.StringField({ initial: "instant" }),
    });

    return schema;
  }

  /* -------------------------------------------------- */

  /**
   * Formats the range as a human-readable string.
   * @type {string}
   */
  get rangeLabel() {
    return game.i18n.format("MYTHCRAFT.Item.spell.FIELDS.range.formatter", { value: this.range.value ?? "", unit: this.range.unit ?? "" }).trim();
  }

  /* -------------------------------------------------- */

  /**
   * Valid spell sources.
   * @type {FormSelectOption[]}
   */
  get magicSourceOptions() {
    return Object.entries(mythcraft.CONFIG.spells.sources).map(([value, { label }]) => ({ value, label }));
  }

  /* -------------------------------------------------- */

  /**
   * Requirements for the spell.
   * @type {FormSelectOption[]}
   */
  get requirementOptions() {
    const componentOptions = Object.entries(mythcraft.CONFIG.spells.components).map(([value, { label }]) => ({ value, label }));
    const requirementOptions = Object.entries(mythcraft.CONFIG.spells.requirements).map(([value, { label }]) => ({ value, label }));
    return componentOptions.concat(requirementOptions);
  }

  /* -------------------------------------------------- */

  /**
   * A human-readable list of requirements for this spell.
   * @type {string}
   */
  get requirementsList() {
    const requirementOptions = this.requirementOptions;
    const labels = this.requirements.map(r => game.i18n.localize(requirementOptions.find(({ value }) => r === value)?.label));
    const formatter = game.i18n.getListFormatter({ type: "unit" });
    return formatter.format(labels.filter(_ => _));
  }

  /* -------------------------------------------------- */

  /**
   * Formats the duration as a human-readable string.
   * @type {string}
   */
  get durationLabel() {
    return game.i18n.format("MYTHCRAFT.Item.spell.FIELDS.duration.formatter", { value: this.duration.value ?? "", unit: this.duration.unit ?? "" }).trim();
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async toEmbed(config, options = {}) {
    const enriched = await enrichHTML(this.description.value, { ...options, relativeTo: this.parent });

    const embed = document.createElement("div");
    embed.classList.add("mythcraft", this.parent.type);

    const content = await foundry.applications.handlebars.renderTemplate(systemPath("templates/item/embeds/spell.hbs"), {
      config,
      enriched,
      system: this,
      systemFields: this.schema.fields,
    });

    embed.insertAdjacentHTML("afterbegin", content);

    return embed;
  }
}
