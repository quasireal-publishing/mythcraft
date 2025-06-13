import BaseItemModel from "./base-item.mjs";

/**
 * The system model for "feature" type items
 */
export default class FeatureModel extends BaseItemModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = super.LOCALIZATION_PREFIXES.concat("MYTHCRAFT.Item.Feature");

  /** @inheritdoc */
  static defineSchema() {
    const schema = super.defineSchema();

    const fields = foundry.data.fields;

    schema.prerequisites = new fields.StringField({ required: true });

    // TODO: prerequisites
    // TODO: Features that give skill points?
    // starting features vs. advanceables

    return schema;
  }
}
