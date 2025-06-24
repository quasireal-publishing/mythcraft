import EquipmentModel from "./equipment.mjs";
import * as constants from "../../constants.mjs";
import { requiredInteger } from "../fields/helpers.mjs";

/**
 * The system model for "armor" type items
 */
export default class ArmorModel extends EquipmentModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = super.LOCALIZATION_PREFIXES.concat("MYTHCRAFT.Item.armor");

  /** @inheritdoc */
  static defineSchema() {
    const schema = super.defineSchema();

    const fields = foundry.data.fields;

    schema.ar = new fields.NumberField();

    schema.defenses = new fields.SchemaField({
      ref: new fields.NumberField(),
      fort: new fields.NumberField(),
      ant: new fields.NumberField(),
      log: new fields.NumberField(),
      will: new fields.NumberField(),
    });

    schema.strMin = new fields.NumberField();

    schema.dexMax = new fields.NumberField();

    schema.speedPenalty = new fields.NumberField();

    schema.resist = new fields.TypedObjectField(new fields.NumberField(requiredInteger({ min: 0, initial: 1 })));

    return schema;
  }
}
