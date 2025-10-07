import BaseItemModel from "./base-item.mjs";

/**
 * The system model for "profession" items.
 */
export default class ProfessionModel extends BaseItemModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = super.LOCALIZATION_PREFIXES.concat("MYTHCRAFT.Item.profession");

  /** @inheritdoc */
  static defineSchema() {
    const schema = super.defineSchema();

    const fields = foundry.data.fields;

    schema.rank = new fields.NumberField({ integer: true, min: 1, max: 5, initial: 1 });

    return schema;
  }
}
