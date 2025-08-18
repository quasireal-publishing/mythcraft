import { requiredInteger } from "../fields/helpers.mjs";
import SourceModel from "../models/source.mjs";
import BaseActorModel from "./base-actor.mjs";

const fields = foundry.data.fields;

/**
 * The system model for "npc" type actors.
 */
export default class NpcModel extends BaseActorModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = super.LOCALIZATION_PREFIXES.concat("MYTHCRAFT.Source", "MYTHCRAFT.Actor.npc");

  /** @inheritdoc */
  static defineSchema() {

    // features/actions/reactions are items
    const schema = super.defineSchema();

    schema.traits = new fields.TypedObjectField(new fields.SchemaField({
      value: new fields.NumberField(requiredInteger({ initial: 1 })),
    }));

    schema.source = new fields.EmbeddedDataField(SourceModel);

    return schema;
  }

  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();
    this.source.prepareData(this.parent._stats?.compendiumSource ?? this.parent.uuid);
  }

}
