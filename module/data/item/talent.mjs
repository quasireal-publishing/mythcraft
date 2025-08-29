import AdvancementModel from "./advancement.mjs";

/**
 * The system model for "talent" items.
 */
export default class TalentModel extends AdvancementModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = super.LOCALIZATION_PREFIXES.concat("MYTHCRAFT.Item.talent");

  /** @inheritdoc */
  static defineSchema() {
    const schema = super.defineSchema();

    const fields = foundry.data.fields;

    schema.prerequisites = new fields.StringField({ required: true });

    schema.incompatibilities = new fields.StringField({ required: true });

    return schema;
  }
}
