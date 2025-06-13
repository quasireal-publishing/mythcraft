import BaseItemModel from "./base-item.mjs";

/**
 * The system model for "lineage" items
 */
export default class LineageModel extends BaseItemModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = super.LOCALIZATION_PREFIXES.concat("MYTHCRAFT.Item.lineage");

  /** @inheritdoc */
  static defineSchema() {
    const schema = super.defineSchema();

    const fields = foundry.data.fields;

    schema.baseSpeed = new fields.SchemaField({ });

    // TODO: feature advancement

    return schema;
  }
}
