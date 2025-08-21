import MythCraftRoll from "./base-roll.mjs";

/**
 * Damage Rolls add logic for checking immunities, resistances.
 */
export default class DamageRoll extends MythCraftRoll {

  /**
   * Button callback to apply damage to selected actors.
   * @param {PointerEvent} event
   */
  static async applyDamageCallback(event) {
    if (!canvas.tokens.controlled.length) return void ui.notifications.error("MYTHCRAFT.Roll.DamageRoll.Apply.NoToken", { localize: true });

    const li = event.currentTarget.closest("[data-message-id]");
    const message = game.messages.get(li.dataset.messageId);
    /** @type {DamageRoll} */
    const roll = message.rolls[event.currentTarget.dataset.index];

    let amount = roll.total;
    if (event.shiftKey) amount = Math.floor(amount / 2);
    for (const actor of mythcraft.utils.tokensToActors()) {
      if (roll.isHeal) {
        const isTemp = roll.type !== "value";
        if (isTemp && (amount < actor.system.stamina.temporary)) ui.notifications.warn("MYTHCRAFT.ChatMessage.base.Buttons.ApplyHeal.TempCapped", {
          format: { name: actor.name },
        });
        else await actor.modifyTokenAttribute(isTemp ? "hp.shield" : "hp", amount, !isTemp, !isTemp);
      }
      else await actor.system.takeDamage(amount, { type: roll.type, ignoredImmunities: roll.ignoredImmunities });
    }
  }

  /* -------------------------------------------------- */

  /**
   * The damage type.
   * @type {string}
   */
  get type() {
    return this.options.type ?? (this.isHeal ? "value" : "");
  }

  /* -------------------------------------------------- */

  /**
   * The localized label for this damage roll's type.
   * @type {string}
   */
  get typeLabel() {
    if (this.isHeal) return game.i18n.localize(mythcraft.CONFIG.healing.types[this.type]?.label);
    return game.i18n.localize(mythcraft.CONFIG.damage.types[this.type]?.label) ?? "";
  }

  /* -------------------------------------------------- */

  /**
   * Damage immunities to ignore.
   * @type {string[]}
   */
  get ignoredImmunities() {
    return this.options.ignoredImmunities ?? [];
  }

  /* -------------------------------------------------- */

  /**
   * Does this represent healing?
   * @type {boolean}
   */
  get isHeal() {
    return this.options.isHeal || false;
  }

  /* -------------------------------------------------- */

  /**
   * Produces a button with relevant data to applying this damage.
   * @param {number} index The index of this roll in the `rolls` array of the message.
   * @returns {HTMLButtonElement} A button that.
   */
  toRollButton(index) {
    const labelPath = this.isHeal ? "MYTHCRAFT.ChatMessage.base.Buttons.ApplyHeal.Label" : "MYTHCRAFT.ChatMessage.base.Buttons.ApplyDamage.Label";

    const tooltipPath = this.isHeal ? "MYTHCRAFT.ChatMessage.base.Buttons.ApplyHeal.Tooltip" : "MYTHCRAFT.ChatMessage.base.Buttons.ApplyDamage.Tooltip";

    return mythcraft.utils.constructHTMLButton({
      label: game.i18n.format(labelPath, {
        type: this.typeLabel ? " " + this.typeLabel : "",
        amount: this.total,
      }),
      dataset: {
        index,
        tooltip: game.i18n.localize(tooltipPath),
        tooltipDirection: "UP",
      },
      classes: ["apply-damage"],
      icon: this.isHeal ? "fa-solid fa-heart-pulse" : "fa-solid fa-burst",
    });
  }
}
