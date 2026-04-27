/**
 * A custom implementation of the TokenDocument class.
 */
export default class MythCraftTokenDocument extends foundry.documents.TokenDocument {
  /**
   * A collection of non-null movement types for this Token's actor.
   * Returns an empty Set for actors whose movement field is a string
   * (e.g. NPCs after the v1 features migration to StringField).
   * @type {Set<string>}
   */
  get movementTypes() {
    const movement = this.actor?.system?.movement ?? {};
    // Guard: NPC movement becomes a StringField in the v1 features plan.
    // Object.entries() on a string iterates characters, not movement types.
    if (typeof movement !== "object" || movement === null) return new Set();
    return new Set(Object.entries(movement).reduce((arr, [key, value]) => {
      if (value !== null) arr.push(key);
      return arr;
    }, []));
  }
}
