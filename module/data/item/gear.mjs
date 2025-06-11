import EquipmentModel from "./equipment.mjs";
import * as constants from "../../constants.mjs";

/**
 * The system model for "gear" type items
 */
export default class GearModel extends EquipmentModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = super.LOCALIZATION_PREFIXES.concat("MYTHCRAFT.Item.Gear");

  /** @inheritdoc */
  static defineSchema() {
    const schema = super.defineSchema();

    const fields = foundry.data.fields;

    return schema;
  }
}
