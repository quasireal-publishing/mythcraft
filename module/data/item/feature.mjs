import FormulaField from "../fields/formula-field.mjs";
import BaseItemModel from "./base-item.mjs";

/**
 * The system model for "feature" type items.
 */
export default class FeatureModel extends BaseItemModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = super.LOCALIZATION_PREFIXES.concat("MYTHCRAFT.Item.feature");

  /** @inheritdoc */
  static defineSchema() {
    const schema = super.defineSchema();

    const fields = foundry.data.fields;

    // TODO: Features that give skill points?
    // starting features vs. advanceables

    schema.prerequisites = new fields.StringField({ required: true });

    schema.uses = new fields.SchemaField({
      spent: new fields.NumberField({ integer: true }),
      maxFormula: new FormulaField({ deterministic: true }),
      recharge: new fields.StringField({ blank: false }),
    });

    return schema;
  }

  /** @inheritdoc */
  prepareDerivedData() {
    this.uses.max = Roll.create(this.uses.maxFormula || "0", this.parent.getRollData()).evaluateSync().total;
    this.uses.value = this.uses.max - this.uses.spent;
  }
}
