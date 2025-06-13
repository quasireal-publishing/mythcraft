import BaseItemModel from "./base-item.mjs";

/**
 * Shared model for armor, weapon, and gear.
 */
export default class EquipmentModel extends BaseItemModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = super.LOCALIZATION_PREFIXES.concat("MYTHCRAFT.Item.equipment");

  /** @inheritdoc */
  static defineSchema() {
    const schema = super.defineSchema();
    const fields = foundry.data.fields;

    schema.cost = new fields.NumberField({ min: 0, integer: true, nullable: false });

    schema.category = new fields.StringField({ blank: false });

    return schema;
  }
}
