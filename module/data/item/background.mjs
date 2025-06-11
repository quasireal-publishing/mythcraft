import BaseItemModel from "./base-item.mjs";

/**
 * The system model for "background" items
 */
export default class BackgroundModel extends BaseItemModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = super.LOCALIZATION_PREFIXES.concat("MYTHCRAFT.Item.background");

  /** @inheritdoc */
  static defineSchema() {
    const schema = super.defineSchema();

    const fields = foundry.data.fields;

    return schema;
  }
}
