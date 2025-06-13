import BaseItemModel from "./base-item.mjs";

/**
 * The system model for "spell" items
 */
export default class SpellModel extends BaseItemModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = super.LOCALIZATION_PREFIXES.concat("MYTHCRAFT.Item.spell");

  /** @inheritdoc */
  static defineSchema() {
    const schema = super.defineSchema();

    const fields = foundry.data.fields;

    schema.apc = new fields.NumberField({ integer: true, min: 0 });

    schema.range = new fields.SchemaField({
      value: new fields.NumberField(),
      unit: new fields.StringField({ initial: "ft" }),
    });

    schema.requirements = new fields.SetField(new fields.StringField({ required: true, blank: false }));

    schema.duration = new fields.SchemaField({
      value: new fields.NumberField(),
      unit: new fields.StringField({ initial: "instant" }),
    });

    return schema;
  }
}
