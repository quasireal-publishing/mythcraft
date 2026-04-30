/**
 * A custom implementation of the Actor class.
 */
export default class MythCraftActor extends Actor {
  /**
   * Return a data object which defines the data schema against which dice rolls can be evaluated.
   * @returns {Record<string, any>}
   */
  getRollData() {
    // Shallow copy
    const rollData = { ...this.system, flags: this.flags, name: this.name, statuses: {} };

    // Adds in all of the statuses present on the actor effectively as booleans
    for (const status of this.statuses) {
      rollData.statuses[status] = 1;
    }

    // Allow system-specific modifications, e.g. adding getters
    if (this.system.modifyRollData instanceof Function) {
      this.system.modifyRollData(rollData);
    }

    return rollData;
  }

  /**
   * Toggle a status effect, with support for compound conditions that auto-apply/remove related conditions.
   * @inheritdoc
   * @param {object} [options.mythcraftFlags]  Update data applied to the created AE after toggling on.
   *   Keys must be `flags.mythcraft.*` dot-notation paths (e.g. `{ "flags.mythcraft.value": "1d6" }`).
   */
  async toggleStatusEffect(statusId, options = {}) {
    const result = await super.toggleStatusEffect(statusId, options);

    // result is the AE document if activated, false/undefined if deactivated.
    const becameActive = result instanceof foundry.documents.ActiveEffect;

    // Apply custom flags not supported by base toggleStatusEffect.
    if (becameActive && options.mythcraftFlags) {
      await result.update(options.mythcraftFlags);
    }

    const conditionConfig = mythcraft.CONFIG.conditions[statusId];
    if (!conditionConfig?.related?.length) return result;

    if (becameActive) {
      // Use super (not this) to prevent re-entry. As a result, related[] must contain
      // the full transitive closure — not just direct children (e.g. petrified → [paralyzed, helpless]).
      for (const relatedId of conditionConfig.related) {
        // Skip if the related condition is already active from another source.
        if (this.statuses.has(relatedId)) continue;
        const related = await super.toggleStatusEffect(relatedId, { active: true });
        // Tag the AE with its parent so it can be cleaned up when parent is removed.
        if (related instanceof foundry.documents.ActiveEffect) {
          await related.update({ "flags.mythcraft.source": statusId });
        }
      }
    } else {
      // Remove related conditions that were added by this parent.
      const toRemove = this.effects
        .filter(e =>
          conditionConfig.related.some(id => e.statuses.has(id)) &&
          (e.flags?.mythcraft?.source === statusId),
        )
        .map(e => e.id);
      if (toRemove.length) await this.deleteEmbeddedDocuments("ActiveEffect", toRemove);
    }

    return result;
  }
}
