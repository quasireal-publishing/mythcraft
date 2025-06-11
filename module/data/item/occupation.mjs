import BaseItemModel from "./base-item.mjs";

/**
 * The system model for "occupation" items
 */
export default class OccupationModel extends BaseItemModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = super.LOCALIZATION_PREFIXES.concat("MYTHCRAFT.Item.occupation");

  /** @inheritdoc */
  static defineSchema() {
    const schema = super.defineSchema();

    const fields = foundry.data.fields;

    return schema;
  }
}
