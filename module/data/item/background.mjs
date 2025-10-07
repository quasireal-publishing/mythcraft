import FormulaField from "../fields/formula-field.mjs";
import { requiredInteger } from "../fields/helpers.mjs";
import AdvancementModel from "./advancement.mjs";

/**
 * The system model for "background" items.
 */
export default class BackgroundModel extends AdvancementModel {
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

    schema.occupation = new fields.SchemaField({
      tag: new fields.StringField({ blank: false }),
      skill: new fields.StringField({ blank: false }),
      bonus: new fields.NumberField({ required: true, min: 0, integer: true, initial: 2 }),
    });

    schema.professions = new fields.NumberField(requiredInteger({ min: 0, initial: 1 }));

    schema.wealth = new FormulaField();

    return schema;
  }
}
