import EquipmentModel from "./equipment.mjs";
import * as constants from "../../constants.mjs";
import FormulaField from "../fields/formula-field.mjs";

/**
 * The system model for "weapon" type items
 */
export default class WeaponModel extends EquipmentModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = super.LOCALIZATION_PREFIXES.concat("MYTHCRAFT.Item.weapon");

  /** @inheritdoc */
  static defineSchema() {
    const schema = super.defineSchema();

    const fields = foundry.data.fields;

    schema.damage = new fields.SchemaField({
      formula: new FormulaField(),
      type: new fields.StringField({ blank: false, required: true, initial: "sharp" }),
    });

    schema.attr = new fields.StringField({ blank: false, required: true, initial: "str" });

    schema.range = new fields.SchemaField({
      value: new fields.NumberField(),
      type: new fields.StringField({ choices: constants.weaponRanges }),
      unit: new fields.StringField({ initial: "ft" }),
    });

    schema.apc = new FormulaField();

    return schema;
  }
}
