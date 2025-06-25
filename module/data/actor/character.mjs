import { requiredInteger } from "../fields/helpers.mjs";
import BaseActorModel from "./base-actor.mjs";

const fields = foundry.data.fields;

/**
 * The system model for "character" type actors
 */
export default class CharacterModel extends BaseActorModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = super.LOCALIZATION_PREFIXES.concat("MYTHCRAFT.Actor.Character");

  /** @inheritdoc */
  static defineSchema() {
    const schema = super.defineSchema();

    schema.ap = new fields.SchemaField({
      value: new fields.NumberField(requiredInteger({ min: 0, initial: 3 })),
    }),
    schema.sp = new fields.SchemaField({
      value: new fields.NumberField({ integer: true, min: 0 }),
      max: new fields.NumberField({ integer: true, min: 0 }),
    });

    return schema;
  }

  static defineAttributes() {
    const attributes = super.defineAttributes();

    const attributeOptions = () => requiredInteger({ min: -3, max: 12, initial: 0 });

    return Object.assign(attributes, {
      luck: new fields.NumberField(attributeOptions()),
      cor: new fields.NumberField(attributeOptions()),
    });
  }

  /** @inheritdoc */
  async _preCreate(data, options, user) {
    const allowed = await super._preCreate(data, options, user);
    if (allowed === false) return false;

    const updates = {
      prototypeToken: {
        actorLink: true,
        disposition: CONST.TOKEN_DISPOSITIONS.FRIENDLY,
        sight: {
          enabled: true,
        },
      },
    };
    this.parent.updateSource(updates);
  }
}
