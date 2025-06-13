import FormulaField from "../fields/formula-field.mjs";
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

    schema.skillPoints = new fields.NumberField({ min: 0, integer: true });

    schema.skills = new fields.TypedObjectField(new fields.SchemaField({
      max: new fields.NumberField({ min: 0, integer: true }),
      options: new fields.SetField(new fields.StringField({ required: true, blank: false })),
    }));

    // TODO: Occupational Bonus
    // TODO: Knave has multiple professions

    schema.wealth = new FormulaField();

    schema.startingEquipment = new fields.EmbeddedDataField(StartingEquipmentModel);

    return schema;
  }
}
