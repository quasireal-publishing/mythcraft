import FormulaField from "../fields/formula-field.mjs";
import { requiredInteger, setOptions } from "../fields/helpers.mjs";

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
        shield: new fields.NumberField(requiredInteger({ min: 0, initial: 0 })),
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
      movement: new fields.SchemaField({
        walk: new fields.NumberField(requiredInteger({ initial: 20 })),
        climb: new fields.NumberField({ required: true }),
        swim: new fields.NumberField({ required: true }),
        fly: new fields.NumberField({ required: true }),
        burrow: new fields.NumberField({ required: true }),
      }),
      ap: new fields.SchemaField({
        value: new fields.NumberField({ integer: true, min: 0, nullable: false, required: true }),
      }),
      conditions: new fields.SchemaField({
        absorb: new fields.NumberField({ integer: true, min: 0 }),
        affinity: new fields.SetField(setOptions({ choices: mythcraft.CONFIG.damageTypes })),
        bleeding: new FormulaField(),
        burning: new FormulaField(),
      }),
      damage: new fields.TypedObjectField(new fields.SchemaField({
        resist: new fields.NumberField(requiredInteger({ initial: 0 })),
        vulnerable: new fields.NumberField(requiredInteger({ initial: 0 })),
        immune: new fields.BooleanField(),
        reduction: new fields.NumberField(requiredInteger({ initial: 0 })),
        threshold: new fields.NumberField(requiredInteger({ initial: 0 })),
      })),
      skills: new fields.TypedObjectField(new fields.SchemaField({
        value: new fields.NumberField(requiredInteger({ initial: 0 })),
      })),
      senses: new fields.TypedObjectField(new fields.SchemaField({
        value: new fields.NumberField(requiredInteger({ initial: 0 })),
      })),
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
