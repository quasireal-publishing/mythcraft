const { SchemaField, NumberField, StringField, SetField, HTMLField } = foundry.data.fields;

export default class SiegeWeaponData extends foundry.abstract.TypeDataModel {

  static LOCALIZATION_PREFIXES = ["MYTHCRAFT.Actor.siege"];

  static defineSchema() {
    const schema = {};

    schema.range = new SchemaField({
      value: new NumberField({ integer: true, min: 0, initial: 0 }),
      unit: new StringField({ initial: "ft" }),
    });
    schema.ammunition = new SchemaField({
      value: new NumberField({ integer: true, min: 0, initial: 0 }),
      max: new NumberField({ integer: true, min: 0, initial: 0 }),
    });
    schema.reload = new NumberField({ integer: true, min: 0, initial: 0 });
    schema.aoe = new StringField();
    schema.speed = new NumberField({ integer: true, min: 0, initial: 0 });
    schema.heft = new NumberField({ integer: true, min: 0, initial: 0 });

    schema.hp = new SchemaField({
      value: new NumberField({ integer: true, min: 0, initial: 0 }),
      max: new NumberField({ integer: true, min: 0, initial: 0 }),
    });
    schema.ar = new NumberField({ integer: true, initial: 10 });

    schema.defenses = new SchemaField({
      ref: new NumberField({ integer: true, initial: 10 }),
      fort: new NumberField({ integer: true, initial: 10 }),
    });

    schema.resistances = new SchemaField({
      resist: new SetField(new StringField()),
      immune: new SetField(new StringField()),
      vulnerable: new SetField(new StringField()),
    });
    schema.reduction = new SchemaField({
      value: new NumberField({ integer: true, min: 0, initial: 0 }),
    });
    schema.threshold = new SchemaField({
      value: new NumberField({ integer: true, min: 0, initial: 0 }),
    });

    schema.description = new SchemaField({
      value: new HTMLField(),
      gm: new HTMLField(),
    });

    return schema;
  }

  /* -------------------------------------------------- */

  /**
   * Expose siege stat fields to roll formulas (e.g. `@AR`, `@SPEED`, `@HEFT`).
   * Flat numeric attack bonuses evaluate without this; it enables stat references.
   * @param {object} rollData   Pointer to the roll data object.
   */
  modifyRollData(rollData) {
    rollData.AR = this.ar;
    rollData.SPEED = this.speed;
    rollData.HEFT = this.heft;
  }
}
