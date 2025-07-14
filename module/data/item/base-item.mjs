import SourceModel from "../models/source.mjs";

/**
 * A shared implementation for the system data model for items
 */
export default class BaseItemModel extends foundry.abstract.TypeDataModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = ["MYTHCRAFT.Source", "MYTHCRAFT.Item.base"];

  /** @inheritdoc */
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      description: new fields.SchemaField({
        value: new fields.HTMLField(),
        gm: new fields.HTMLField({ gmOnly: true }),
      }),

      source: new fields.EmbeddedDataField(SourceModel),

      tags: new fields.SetField(new fields.StringField({ required: true, blank: false })),

      _mcid: new fields.StringField({ required: true, readonly: true }),
    };
  }

  /** @inheritdoc */
  prepareDerivedData() {
    this.source.prepareData(this.parent._stats?.compendiumSource ?? this.parent.uuid);
  }

  /**
   * Perform item subtype specific modifications to the actor roll data
   * @param {object} rollData   Pointer to the roll data object
   */
  modifyRollData(rollData) {}

  /** @inheritdoc */
  async _preCreate(data, options, user) {
    if (!this._mcid) this.updateSource({ _mcid: data.name.slugify({ strict: true }) });
  }

}
