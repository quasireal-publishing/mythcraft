import { requiredInteger } from "../fields/helpers.mjs";

const fields = foundry.data.fields;

/**
 * A shared implementation for the system data model for actors
 */
export default class BaseActorModel extends foundry.abstract.TypeDataModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = ["MYTHCRAFT.Actor.Base"];

  /** @inheritdoc */
  static defineSchema() {

    return {
      biography: new fields.SchemaField({
        value: new fields.HTMLField(),
        gm: new fields.HTMLField({ gmOnly: true }),
      }),
      hp: new fields.SchemaField({
        value: new fields.NumberField(requiredInteger({ min: 0, initial: 0 })),
        max: new fields.NumberField(requiredInteger({ min: 0, initial: 0 })),
      }),
      death: new fields.SchemaField({
        value: new fields.NumberField(requiredInteger({ min: 0, initial: 0 })),
        max: new fields.NumberField(requiredInteger({ min: 0, initial: 0 })),
      }),
      attributes: new fields.SchemaField(this.defineAttributes()),
      defenses: new fields.SchemaField({
        ar: new fields.NumberField(requiredInteger({ min: 0, initial: 10 })),
        ref: new fields.NumberField(requiredInteger({ min: 0, initial: 10 })),
        fort: new fields.NumberField(requiredInteger({ min: 0, initial: 10 })),
        ant: new fields.NumberField(requiredInteger({ min: 0, initial: 10 })),
        log: new fields.NumberField(requiredInteger({ min: 0, initial: 10 })),
        will: new fields.NumberField(requiredInteger({ min: 0, initial: 10 })),
      }),
      movement: new fields.SchemaField(),
      ap: new fields.SchemaField({
        value: new fields.NumberField({ integer: true, min: 0, nullable: false, required: true }),
      }),
      // resists
      // immunities
      // vulnerabilities
      // damage reduction
      // skills
      // senses
      // traits
    };
  }

  static defineAttributes() {
    const attributeOptions = () => requiredInteger({ min: -3, max: 12, initial: 0 });

    return {
      str: new fields.NumberField(attributeOptions()),
      dex: new fields.NumberField(attributeOptions()),
      end: new fields.NumberField(attributeOptions()),
      awr: new fields.NumberField(attributeOptions()),
      int: new fields.NumberField(attributeOptions()),
      cha: new fields.NumberField(attributeOptions()),
    };
  }

  /** @inheritdoc */
  prepareDerivedData() {
    /** @type {Set<string>} */
    const statuses = this.parent.statuses;

    if (statuses.has("rallied")) {
      statuses.delete("demoralized");
      statuses.delete("frightened");
      statuses.delete("shaken");
    }
    this.hp.bloodied = Math.floor(this.hp.max / 2);
  }

  /**
   * Perform item subtype specific modifications to the actor roll data
   * @param {object} rollData   Pointer to the roll data object
   */
  modifyRollData(rollData) {}
}
