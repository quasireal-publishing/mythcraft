import EquipmentModel from "./equipment.mjs";
import * as constants from "../../constants.mjs";
import FormulaField from "../fields/formula-field.mjs";

/**
 * The system model for "weapon" type items.
 */
export default class WeaponModel extends EquipmentModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = super.LOCALIZATION_PREFIXES.concat("MYTHCRAFT.Item.weapon");

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static defineSchema() {
    const schema = super.defineSchema();

    const fields = foundry.data.fields;

    schema.damage = new fields.SchemaField({
      formula: new FormulaField(),
      type: new fields.StringField({ required: true, initial: "sharp" }),
    });

    schema.attr = new fields.StringField({ required: true, initial: "str" });

    schema.apcFormula = new FormulaField({ initial: "3" });

    schema.range = new fields.SchemaField({
      type: new fields.StringField({ choices: constants.weaponRanges, required: true, initial: "melee" }),
      value: new fields.NumberField(),
      unit: new fields.StringField({ initial: "ft" }),
    });

    return schema;
  }

  /* -------------------------------------------------- */

  /**
   * The weapon's calculated APC cost.
   */
  get apc() {
    return mythcraft.utils.evaluateFormula(this.apcFormula || "0", this.parent.getRollData());
  }
}
