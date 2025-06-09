/**
 * A shared implementation for the system data model for actors
 */
export default class BaseActorModel extends foundry.abstract.TypeDataModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = ["MYTHCRAFT.Actor.Base"];

  /** @inheritdoc */
  static defineSchema() {
    // Schemas are made up of fields, which foundry provides in foundry.data.fields
    // This allows easier access to the fields within our schema definition
    const fields = foundry.data.fields;

    // defineSchema returns an object which gets turned into the `schema` property of the data model.
    return {
      // Whenever we want to create a nested object, use SchemaField
      biography: new fields.SchemaField({
        // HTMLField must be paired with registering as an htmlField in system.json
        // The field definition *here* only applies in the client, the system.json registration enables server-side cleaning
        value: new fields.HTMLField(),
        // biography.gm here is going to be an example of using a "gmOnly" field, which is another thing that must be registered in system.json
        gm: new fields.HTMLField({ gmOnly: true }),
      }),
      // Foundry's token resource bars look for objects with a "value" and "max" key to represent as "Bar Attributes"
      hp: new fields.SchemaField({
        // Number fields are one of the most basic fields in Foundry. They provide
        value: new fields.NumberField({ integer: true, min: 0 }),
        max: new fields.NumberField({ integer: true, min: 0 }),
      }),
    };
  }

  /** @inheritdoc */
  prepareDerivedData() {
    this.hp.bloodied = Math.floor(this.hp.max / 2);
  }

  /**
   * Perform item subtype specific modifications to the actor roll data
   * @param {object} rollData   Pointer to the roll data object
   */
  modifyRollData(rollData) {}
}
