import BaseItemModel from "./base-item.mjs";

/**
 * The system model for "talent" items
 */
export default class TalentModel extends BaseItemModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = super.LOCALIZATION_PREFIXES.concat("MYTHCRAFT.Item.talent");

  /** @inheritdoc */
  static defineSchema() {
    const schema = super.defineSchema();

    const fields = foundry.data.fields;

    return schema;
  }
}
