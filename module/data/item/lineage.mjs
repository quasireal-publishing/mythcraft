import { requiredInteger } from "../fields/helpers.mjs";
import AdvancementModel from "./advancement.mjs";

/**
 * The system model for "lineage" items.
 */
export default class LineageModel extends AdvancementModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = super.LOCALIZATION_PREFIXES.concat("MYTHCRAFT.Item.lineage");

  /** @inheritdoc */
  static defineSchema() {
    const schema = super.defineSchema();

    const fields = foundry.data.fields;

    schema.baseSpeed = new fields.SchemaField({
      walk: new fields.NumberField(requiredInteger({ initial: 20 })),
      climb: new fields.NumberField({ required: true }),
      swim: new fields.NumberField({ required: true }),
      fly: new fields.NumberField({ required: true }),
      burrow: new fields.NumberField({ required: true }),
    });

    return schema;
  }
}
