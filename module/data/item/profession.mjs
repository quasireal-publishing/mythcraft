import BaseItemModel from "./base-item.mjs";
import StartingEquipmentModel from "./models/starting-equipment.mjs";

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

    schema.startingEquipment = new fields.EmbeddedDataField(StartingEquipmentModel);

    schema.skills = new fields.TypedObjectField(new fields.SchemaField({
      // TODO
    }));

    // TODO: Professional Benefits

    return schema;
  }
}
