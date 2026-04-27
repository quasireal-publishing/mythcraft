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
    const schema = super.defineSchema();

    // Free-text overrides for fields that aren't tag-like.
    // GMs type "Walk 30 ft., Fly 60 ft." rather than filling numeric subfields.
    schema.movement = new fields.StringField();
    schema.senses = new fields.StringField();

    // Traits: was TypedObjectField; now a SetField driven by <tag-input>.
    schema.traits = new fields.SetField(new fields.StringField({ required: true, blank: false }));

    // Damage modifications: tag-like fields stay arrays (SetField, inherited
    // for affinity/immune from base). reduction is free text — was {value,
    // bypasses} SchemaField. resist/vulnerable already StringField in base.
    schema.damage = new fields.SchemaField({
      resist: new fields.StringField(),
      vulnerable: new fields.StringField(),
      absorb: new fields.TypedObjectField(
        new fields.NumberField({ integer: true, min: 0, nullable: false }),
      ),
      affinity: new fields.SetField(new fields.StringField({ required: true, blank: false })),
      immune: new fields.SetField(new fields.StringField({ required: true, blank: false })),
      reduction: new fields.StringField(),
      threshold: new fields.NumberField({ integer: true, min: 0, nullable: false }),
    });

    // NPC stat block fields
    schema.source = new fields.EmbeddedDataField(SourceModel);
    schema.actions = new fields.HTMLField();

    return schema;
  }

  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();
    this.source.prepareData(this.parent._stats?.compendiumSource ?? this.parent.uuid);
  }

  /**
   * Migrate legacy structured NPC data to StringField format.
   * The bestiary pack is currently empty so no pack migration is needed,
   * but world actors created with the old schema need graceful coercion.
   * @inheritdoc
   */
  static migrateData(source) {
    source = super.migrateData(source);

    // movement: {walk, climb, swim, fly, burrow} → "Walk 30 ft., Fly 60 ft."
    if (source.movement && (typeof source.movement === "object")) {
      const labels = { walk: "Walk", climb: "Climb", swim: "Swim", fly: "Fly", burrow: "Burrow" };
      source.movement = Object.entries(labels)
        .filter(([k]) => source.movement[k])
        .map(([k, l]) => `${l} ${source.movement[k]} ft.`)
        .join(", ");
    }

    // senses: TypedObjectField {key: {value: N}} → "darkvision 60 ft."
    if (source.senses && (typeof source.senses === "object") && !Array.isArray(source.senses)) {
      source.senses = Object.entries(source.senses)
        .filter(([, d]) => d?.value)
        .map(([k, d]) => `${k} ${d.value} ft.`)
        .join(", ");
    }

    // tags: legacy comma string → array (current schema is SetField).
    if (typeof source.tags === "string") {
      source.tags = source.tags.split(",").map(s => s.trim()).filter(Boolean);
    }

    // traits: TypedObjectField {key: {...}} → array of keys.
    // Or legacy comma-string from interim StringField → array.
    if (typeof source.traits === "string") {
      source.traits = source.traits.split(",").map(s => s.trim()).filter(Boolean);
    } else if (source.traits && (typeof source.traits === "object") && !Array.isArray(source.traits)) {
      source.traits = Object.keys(source.traits);
    }

    // damage sub-fields — split legacy comma strings back to arrays.
    if (source.damage) {
      if (typeof source.damage.affinity === "string") {
        source.damage.affinity = source.damage.affinity.split(",").map(s => s.trim()).filter(Boolean);
      }
      if (typeof source.damage.immune === "string") {
        source.damage.immune = source.damage.immune.split(",").map(s => s.trim()).filter(Boolean);
      }
      // reduction: legacy {value, bypasses} → free-text descriptor.
      if (source.damage.reduction && (typeof source.damage.reduction === "object")) {
        const { value, bypasses } = source.damage.reduction;
        source.damage.reduction = [
          value ? `DR ${value}` : null,
          bypasses ? `(bypassed by ${bypasses})` : null,
        ].filter(Boolean).join(" ");
      }
    }

    return source;
  }

  /**
   * Apply damage to this NPC, accounting only for shield.
   * NPCs use text-based damage descriptors — automated immunity/absorb
   * checks are skipped. Revisit post-testing if automation is needed.
   * @inheritdoc
   */
  async takeDamage(damage, options = {}) {
    const hpUpdates = {};
    const damageToShield = Math.min(damage, this.hp.shield);
    hpUpdates.shield = Math.max(0, this.hp.shield - damageToShield);
    const remainingDamage = Math.max(0, damage - damageToShield);
    if (remainingDamage > 0) hpUpdates.value = this.hp.value - remainingDamage;
    return this.parent.update(
      { "system.hp": hpUpdates },
      { mythcraft: { damageType: options.type } },
    );
  }
}
