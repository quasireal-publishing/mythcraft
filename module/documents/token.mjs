/**
 * A custom implementation of the TokenDocument class.
 */
export default class MythCraftTokenDocument extends foundry.documents.TokenDocument {
  /**
   * A collection of non-null movement types for this Token's actor.
   * @type {Set<string>}
   */
  get movementTypes() {
    const movement = this.actor?.system?.movement ?? {};
    return new Set(Object.entries(movement).reduce((arr, [key, value]) => {
      if (value !== null) arr.push(key);
      return arr;
    }, []));
  }
}
