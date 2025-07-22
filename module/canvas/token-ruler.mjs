/** @import { TokenMovementActionConfig, TokenRulerWaypoint } from "@client/_types.mjs" */
/** @import { DeepReadonly } from "@common/_types.mjs" */

/**
 * MythCraft implementation of the core token ruler.
 */
export default class MythCraftTokenRuler extends foundry.canvas.placeables.tokens.TokenRuler {
  /**
   * Helper function called in `init` hook.
   * @internal
   */
  static applyMCMovementConfig() {
    foundry.utils.mergeObject(CONFIG.Token.movement.actions, {
      /** @type {TokenMovementActionConfig} */
      climb: {
        getCostFunction: (token, _options) => {
          if (token.movementTypes.has("climb")) return cost => cost;
          else return cost => cost * 2;
        },
      },
      /** @type {TokenMovementActionConfig} */
      jump: {
        // default for jump is cost * 2
        getCostFunction: () => cost => cost,
      },
      /** @type {TokenMovementActionConfig} */
      swim: {
        getCostFunction: (token, _options) => {
          if (token.movementTypes.has("swim")) return cost => cost;
          else return cost => cost * 2;
        },
      },
    }, { performDeletions: true });
  }

  /* -------------------------------------------------- */

  /**
   * @inheritdoc
   * @param {DeepReadonly<TokenRulerWaypoint>} waypoint
   */
  _getSegmentStyle(waypoint) {
    const style = super._getSegmentStyle(waypoint);
    this.#speedValueStyle(style, waypoint);
    return style;
  }

  /* -------------------------------------------------- */

  /**
   * @inheritdoc
   * @param {DeepReadonly<Omit<TokenRulerWaypoint, "index"|"center"|"size"|"ray">>} waypoint
   * @param {DeepReadonly<foundry.grid.types.GridOffset3D>} offset
   */
  _getGridHighlightStyle(waypoint, offset) {
    const style = super._getGridHighlightStyle(waypoint, offset);
    this.#speedValueStyle(style, waypoint);
    return style;
  }

  /* -------------------------------------------------- */

  /**
   * Adjusts the grid or segment style based on the token's movement characteristics.
   * @param {{ color?: PIXI.ColorSource }} style        The calculated style properties from the parent class.
   * @param {DeepReadonly<TokenRulerWaypoint>} waypoint The waypoint being adjusted.
   * @protected
   */
  #speedValueStyle(style, waypoint) {
    if (waypoint.actionConfig.teleport) return style;
    else {
      let actorMovement = foundry.utils.getProperty(this, "token.document.actor.system.movement");
      if (foundry.utils.isEmpty(actorMovement)) return style;
      let value = actorMovement.walk;
      switch (waypoint.action) {
        case "fly":
          if (actorMovement.fly !== null) value = actorMovement.fly;
          else return style;
          break;
        case "swim":
          if (actorMovement.swim !== null) value = actorMovement.swim;
          break;
        case "burrow":
          if (actorMovement.burrow !== null) value = actorMovement.burrow;
          else return style;
          break;
        case "climb":
          if (actorMovement.climb !== null) value = actorMovement.climb;
          break;
        case "jump":
          value = 6 + (2 * (foundry.utils.getProperty(this, "token.document.actor.system.attributes.str") ?? 0));
          break;
      }
      const actions = foundry.utils.getProperty(this, "token.document.actor.system.ap.value") ?? 1;
      if (waypoint.measurement.cost <= value) style.color = 0x33BC4E;
      else if (waypoint.measurement.cost <= (value * actions)) style.color = 0xF1D836;
      else style.color = 0xE72124;
    }
  }
}
