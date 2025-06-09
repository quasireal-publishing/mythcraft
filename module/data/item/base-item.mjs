/**
 * A shared implementation for the system data model for items
 */
export default class BaseItemModel extends foundry.abstract.TypeDataModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = ["MYTHCRAFT.Item.Base"];

  /** @inheritdoc */
  static defineSchema() {
    // Schemas are made up of fields, which foundry provides in foundry.data.fields
    // This allows easier access to the fields within our schema definition
    const fields = foundry.data.fields;

    // defineSchema returns an object which gets turned into the `schema` property of the data model.
    return {
      // Whenever we want to create a nested object, use SchemaField
      description: new fields.SchemaField({
        // HTMLField must be paired with registering as an htmlField in system.json
        // The field definition *here* only applies in the client, the system.json registration enables server-side cleaning
        value: new fields.HTMLField(),
        // description.gm here is going to be an example of using a "gmOnly" field, which is another thing that must be registered in system.json
        gm: new fields.HTMLField({ gmOnly: true }),
      }),
      // A set of strings is more reusable and extensible than listing a bunch of booleans in your schema
      properties: new fields.SetField(new fields.StringField({ required: true, blank: false })),
    };
  }

  /**
   * Perform item subtype specific modifications to the actor roll data
   * @param {object} rollData   Pointer to the roll data object
   */
  modifyRollData(rollData) {}
}
