import FormulaField from "../fields/formula-field.mjs";
import { requiredInteger } from "../fields/helpers.mjs";
import BaseItemModel from "./base-item.mjs";

/**
 * The system model for "feature" type items, which are used by ancestries and monsters.
 */
export default class FeatureModel extends BaseItemModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = super.LOCALIZATION_PREFIXES.concat("MYTHCRAFT.Item.feature");

  /** @inheritdoc */
  static defineSchema() {
    const schema = super.defineSchema();

    const fields = foundry.data.fields;

    schema.category = new fields.StringField({ initial: "passive", choices: {
      passive: "MYTHCRAFT.Item.feature.category.passive",
      action: "MYTHCRAFT.Item.feature.category.action",
      reaction: "MYTHCRAFT.Item.feature.category.reaction",
    } });

    schema.prerequisites = new fields.StringField({ required: true });

    schema.uses = new fields.SchemaField({
      spent: new fields.NumberField({ integer: true }),
      maxFormula: new FormulaField({ deterministic: true }),
      recharge: new fields.StringField({ blank: false }),
    });

    schema.tier = new fields.NumberField(requiredInteger({ min: 1, initial: 1 }));

    return schema;
  }

  /* -------------------------------------------------- */

  /**
   * Display the tier information for this feature?
   * @type {boolean}
   */
  get showTier() {
    return (this.category === "action") && (this.parent.parent?.type === "npc");
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  prepareDerivedData() {
    this.uses.max = Roll.create(this.uses.maxFormula || "0", this.parent.getRollData()).evaluateSync().total;
    this.uses.value = this.uses.max - this.uses.spent;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _preUpdate(changes, options, user) {
    const allowed = await super._preUpdate(changes, options, user);
    if (allowed === false) return false;

    const hasValue = foundry.utils.hasProperty(changes, "system.uses.value");
    if (hasValue) {
      foundry.utils.setProperty(changes, "system.uses.spent", this.uses.max - changes.system.uses.value);
    }
  }
}
