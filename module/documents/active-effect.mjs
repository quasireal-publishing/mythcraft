/** @import { StatusEffectConfig } from "@client/config.mjs" */
/** @import MythCraftActor from "./actor.mjs"; */

/**
 * A document subclass adding system-specific behavior and registered in CONFIG.ActiveEffect.documentClass.
 */
export default class MythCraftActiveEffect extends foundry.documents.ActiveEffect {
  /**
   * Checks if a status condition applies to the actor.
   * @param {StatusEffectConfig} status An entry in CONFIG.statusEffects.
   * @param {MythCraftActor} actor      The actor to check against for rendering.
   * @returns {boolean} Will be shown on the token hud for the actor.
   */
  static validHud(status, actor) {
    return (status.hud !== false) &&
      ((foundry.utils.getType(status.hud) !== "Object") || (status.hud.actorTypes?.includes(actor.type)));
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static async _fromStatusEffect(statusId, effectData, options) {
    if (effectData.rule) effectData.description = `@Embed[${effectData.rule} inline]`;

    const effect = await super._fromStatusEffect(statusId, effectData, options);
    return effect;
  }

  /* -------------------------------------------------- */

  /**
   * Automatically deactivate effects with expired durations.
   * @inheritdoc
   */
  get isSuppressed() {
    if (Number.isNumeric(this.duration.remaining)) return this.duration.remaining <= 0;
    // Checks `system.isSuppressed`
    else return super.isSuppressed;
  }

  /* -------------------------------------------------- */

  /** @import { ActiveEffectDuration, EffectDurationData } from "../data/effect/_types" */

  /**
   * Compute derived data related to active effect duration.
   * @returns {Omit<ActiveEffectDuration, keyof EffectDurationData>}
   * @protected
   * @inheritdoc
   */
  _prepareDuration() {
    return this.system._prepareDuration ?? super._prepareDuration();
  }

  /* -------------------------------------------------- */

  /**
   * Check if the effect's subtype has special handling, otherwise fallback to normal `duration` and `statuses` check.
   * @inheritdoc
   */
  get isTemporary() {
    return this.system._isTemporary ?? super.isTemporary;
  }

  /* -------------------------------------------------- */

  /**
   * Return a data object which defines the data schema against which dice rolls can be evaluated.
   * Potentially usable in the future. May also want to adjust details to care about.
   * @returns {object}
   */
  getRollData() {
    // Will naturally have actor data at the base & `item` for any relevant item data
    const rollData = this.parent?.getRollData() ?? {};

    // Shallow copy
    rollData.effect = { ...this.system, duration: this.duration, flags: this.flags, name: this.name, statuses: {} };

    // Statuses provided by *this* active effect
    for (const status of this.statuses) {
      rollData.effect.statuses[status] = 1;
    }

    if (this.system.modifyRollData instanceof Function) {
      this.system.modifyRollData(rollData);
    }

    return rollData;
  }
}
