/**
 * A custom implementation of the Actor class
 */
export default class SystemActor extends Actor {
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
}
