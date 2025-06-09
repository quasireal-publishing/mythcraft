/**
 * A custom implementation of the Actor class
 */
export default class SystemItem extends foundry.documents.Item {
  /**
   * Return a data object which defines the data schema against which dice rolls can be evaluated.
   * @returns {Record<string, any>}
   */
  getRollData() {
    // Start with the parent actor roll data, if it's available
    const rollData = this.actor?.getRollData() ?? {};

    // Shallow copy
    rollData.item = { ...this.system, flags: this.flags, name: this.name };

    // Allow system-specific modifications, e.g. adding getters
    if (this.system.modifyRollData instanceof Function) {
      this.system.modifyRollData(rollData);
    }

    return rollData;
  }
}
