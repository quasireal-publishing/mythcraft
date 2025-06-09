import BaseItemModel from "./base-item.mjs";
import * as constants from "../../constants.mjs";

/**
 * The system model for "equipment" type items
 */
export default class EquipmentModel extends BaseItemModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = super.LOCALIZATION_PREFIXES.concat("MYTHCRAFT.Item.Equipment");

  /** @inheritdoc */
  static defineSchema() {
    // Calling super allows us to build on top of the schema definition in BaseItemModel
    const schema = super.defineSchema();

    // Schemas are made up of fields, which foundry provides in foundry.data.fields
    // This allows easier access to the fields within our schema definition
    const fields = foundry.data.fields;

    // If you have a constant set of choices, then you can pass them to a NumberField or StringField for validation
    schema.category = new fields.StringField({ choices: constants.equipmentCategories });

    return schema;
  }
}
