import FormulaField from "../fields/formula-field.mjs";
import { requiredInteger, setOptions } from "../fields/helpers.mjs";
import AttributeRollDialog from "../../applications/apps/attribute-roll.mjs";
import AttributeRoll from "../../rolls/attribute-roll.mjs";

/**
 * @import ChatMessage from "@client/documents/chat-message.mjs";
 */

const fields = foundry.data.fields;

/**
 * A shared implementation for the system data model for actors.
 */
export default class BaseActorModel extends foundry.abstract.TypeDataModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = ["MYTHCRAFT.Actor.base"];

  /* -------------------------------------------------- */

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
      sp: new fields.SchemaField({
        value: new fields.NumberField({ integer: true, min: 0 }),
        max: new fields.NumberField({ integer: true, min: 0 }),
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
        walk: new fields.NumberField(requiredInteger({ initial: 20, min: 0 })),
        climb: new fields.NumberField({ required: true, min: 0 }),
        swim: new fields.NumberField({ required: true, min: 0 }),
        fly: new fields.NumberField({ required: true, min: 0 }),
        burrow: new fields.NumberField({ required: true, min: 0 }),
      }),
      senses: new fields.TypedObjectField(new fields.SchemaField({
        value: new fields.NumberField(requiredInteger({ initial: 0 })),
      })),
      skills: new fields.TypedObjectField(new fields.SchemaField({
        value: new fields.NumberField(requiredInteger({ min: 0, initial: 0 })),
      })),
      conditions: new fields.SchemaField({
        absorb: new fields.NumberField({ integer: true, min: 0 }),
        affinity: new fields.SetField(setOptions()),
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
    };
  }

  /* -------------------------------------------------- */

  /**
   * Dataschema of attributes for this actor subtype.
   * @returns {import("@common/abstract/_types.mjs").DataSchema}
   */
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

  /* -------------------------------------------------- */

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

    for (const [key, data] of Object.entries(this.skills)) {
      const skillInfo = mythcraft.CONFIG.skills.list[key];
      if (skillInfo) data.bonus = this.attributes[skillInfo.attribute] + data.value;
    }
  }

  /* -------------------------------------------------- */

  /**
   * @inheritdoc
   * @param {Record<string, unknown>} changes
   * @param {import("@common/abstract/_types.mjs").DatabaseUpdateOperation} operation
   * @param {User} user
   */
  async _preUpdate(changes, options, user) {
    const allowed = await super._preUpdate(changes, options, user);
    if (allowed === false) return false;

    if (changes.system?.hp) {
      options.mythcraft ??= {};
      options.mythcraft.previousHp = { ...this.hp };
    }
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  _onUpdate(changed, options, userId) {
    super._onUpdate(changed, options, userId);

    if (options.mythcraft?.previousHp && changed.system?.hp) {
      const hpDiff = options.mythcraft.previousHp.value - (changed.system.hp.value || options.mythcraft.previousHp.value);
      const shieldDiff = options.mythcraft.previousHp.shield - (changed.system.hp.temporary || options.mythcraft.previousHp.shield);
      const diff = hpDiff + shieldDiff;
      this.displayStaminaChange(diff, options.mythcraft.damageType);
    }
  }

  /* -------------------------------------------------- */

  /**
   * Display actor stamina changes on active tokens.
   *
   * @param {number} diff The amount the actor's stamina has changed.
   * @param {string} [damageType=""] The type of damage being dealt.
   */
  async displayStaminaChange(diff, damageType = "") {
    if (!diff || !canvas.scene) {
      return;
    }

    const damageColor = mythcraft.CONFIG.damage.types[damageType]?.color ?? null;
    const tokens = this.parent.getActiveTokens();
    const displayedDiff = (-1 * diff).signedString();
    const defaultFill = (diff < 0 ? "lightgreen" : "white");
    const displayArgs = {
      fill: damageColor ?? defaultFill,
      fontSize: 32,
      stroke: 0x000000,
      strokeThickness: 4,
    };

    tokens.forEach((token) => {
      if (!token.visible || token.document.isSecret) {
        return;
      }

      const scrollingTextArgs = [
        token.center,
        displayedDiff,
        displayArgs,
      ];

      canvas.interface.createScrollingText(...scrollingTextArgs);
    });
  }

  /* -------------------------------------------------- */

  /**
   * Perform item subtype specific modifications to the actor roll data.
   * @param {object} rollData   Pointer to the roll data object.
   */
  modifyRollData(rollData) {}

  /* -------------------------------------------------- */

  /**
   * Perform an attribute roll.
   * @param {string} attribute
   * @returns {ChatMessage}
   */
  async rollAttribute(attribute) {
    const formula = `1d20 + @attributes.${attribute} + @situationalBonus`;
    const fd = await AttributeRollDialog.create({ context: { attribute, formula } });
    if (!fd) throw new Error("Roll Dialog Cancelled");
    const { situationalBonus, rollMode } = fd;
    const rollData = this.parent.getRollData();
    rollData.situationalBonus = situationalBonus || 0;
    const roll = new AttributeRoll(formula, rollData, { attribute });
    return roll.toMessage({ speaker: ChatMessage.getSpeaker({ actor: this.parent }) }, { rollMode });
  }

  /* -------------------------------------------------- */

  /**
   * Perform a skill roll.
   * @param {string} skill
   * @returns {ChatMessage}
   */
  async rollSkill(skill) {
    const formula = `1d20 + @skills.${skill}.bonus + @situationalBonus`;
    const attribute = mythcraft.CONFIG.skills.list[skill].attribute;
    const fd = await AttributeRollDialog.create({ context: { attribute, skill, formula } });
    if (!fd) throw new Error("Roll Dialog Cancelled");
    const { situationalBonus, rollMode } = fd;
    const rollData = this.parent.getRollData();
    rollData.situationalBonus = situationalBonus || 0;
    const roll = new AttributeRoll(formula, rollData, { attribute, skill });
    return roll.toMessage({ speaker: ChatMessage.getSpeaker({ actor: this.parent }) }, { rollMode });
  }

  /* -------------------------------------------------- */

  /**
   * A method that applies damage to the actor, accounting for the rules of MythCraft.
   * @param {number} damage                 The damage amount.
   * @param {object} [options]
   * @param {string} [options.type]   A key in {@link mythcraft.CONFIG.damage.types}.
   */
  async takeDamage(damage, options = {}) {
    const damageInfo = this.damage[options.type];
    let zeroMessage = "MythCraft.Actor.DamageNotification.AbsorbReducedToZero";
    if (damageInfo) {
      damage = Math.max(damage - damageInfo.absorb, 0);
      if (damageInfo.immune) {
        damage = 0;
        zeroMessage = "MythCraft.Actor.DamageNotification.ImmuneReducedToZero";
      }
    }

    if (damage === 0) {
      ui.notifications.info(zeroMessage, { format: { name: this.parent.name } });
      return this.parent;
    }

    const damageTypeOption = { mythcraft: { damageType: options.type } };
    // If there's damage left after weakness/immunities, apply damage to temporary stamina then stamina value
    const hpUpdates = {};
    const damageToShield = Math.min(damage, this.hp.shield);
    hpUpdates.shield = Math.max(0, this.hp.shield - damageToShield);

    const remainingDamage = Math.max(0, damage - damageToShield);
    if (remainingDamage > 0) hpUpdates.value = this.hp.value - remainingDamage;

    return this.parent.update({ "system.hp": hpUpdates }, damageTypeOption);
  }
}
