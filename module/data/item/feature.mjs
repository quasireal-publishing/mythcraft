import BaseItemModel from "./base-item.mjs";

/**
 * The system model for "feature" type items
 */
export default class FeatureModel extends BaseItemModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = super.LOCALIZATION_PREFIXES.concat("MYTHCRAFT.Item.Feature");

  /** @inheritdoc */
  static defineSchema() {
    // Calling super allows us to build on top of the schema definition in BaseItemModel
    const schema = super.defineSchema();

    // Schemas are made up of fields, which foundry provides in foundry.data.fields
    // This allows easier access to the fields within our schema definition
    const fields = foundry.data.fields;

    // An example of a range slider
    schema.level = new fields.NumberField({ min: 0, step: 1, max: 20, nullable: false });

    return schema;
  }
}
