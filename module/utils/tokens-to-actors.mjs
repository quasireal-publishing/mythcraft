/**
 * @import MythCraftTokenDocument from "../documents/token.mjs";
 * @import Token from "@client/canvas/placeables/token.mjs";
 * @import MythCraftActor from "../documents/actor.mjs";
 */

/**
 * Convenience method to get the unique actors of an array of tokens.
 * @param {(Token | MythCraftTokenDocument)[]} [tokens] Defaults to canvas.tokens.controlled.
 * @returns {Set<MythCraftActor>}    The set of actors of the controlled tokens.
 */
export default function tokensToActors(tokens) {
  tokens ??= canvas?.tokens?.controlled ?? [];
  const actors = tokens.map(token => token.actor).filter(_ => _);
  return new Set(actors);
}
