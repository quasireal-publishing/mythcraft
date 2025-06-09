import BaseActorModel from "./base-actor.mjs";

/**
 * The system model for "npc" type actors
 */
export default class NpcModel extends BaseActorModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = super.LOCALIZATION_PREFIXES.concat("MYTHCRAFT.Actor.NPC");

  /** @inheritdoc */
  static defineSchema() {
    // Calling super allows us to build on top of the schema definition in BaseActorModel
    const schema = super.defineSchema();

    // Schemas are made up of fields, which foundry provides in foundry.data.fields
    // This allows easier access to the fields within our schema definition
    const fields = foundry.data.fields;

    return schema;
  }
}
