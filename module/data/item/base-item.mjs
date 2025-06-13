/**
 * A shared implementation for the system data model for items
 */
export default class BaseItemModel extends foundry.abstract.TypeDataModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = ["MYTHCRAFT.Item.Base"];

  /** @inheritdoc */
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      description: new fields.SchemaField({
        value: new fields.HTMLField(),
        gm: new fields.HTMLField({ gmOnly: true }),
      }),

      tags: new fields.SetField(new fields.StringField({ required: true, blank: false })),

      _mcid: new fields.StringField({ blank: false, readonly: true }),
    };
  }

  /**
   * Perform item subtype specific modifications to the actor roll data
   * @param {object} rollData   Pointer to the roll data object
   */
  modifyRollData(rollData) {}
}
