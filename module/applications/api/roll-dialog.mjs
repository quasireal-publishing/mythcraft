import MythCraftApplication from "./application.mjs";
import { systemPath } from "../../constants.mjs";

const { FormDataExtended } = foundry.applications.ux;

/**
 * Provides basic framework for roll dialogs.
 * @abstract
 */
export default class RollDialog extends MythCraftApplication {

  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["roll-dialog"],
    window: {
      icon: "fa-solid fa-dice-d20",
    },
    actions: {
      setRollMode: this.#setRollMode,
    },
    context: null,
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static PARTS = {
    footer: {
      template: systemPath("templates/roll/roll-dialog-footer.hbs"),
    },
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  _initializeApplicationOptions(options) {
    options.context ??= {};
    options.context.rollMode = game.settings.get("core", "rollMode");
    options.context.situationalTA ??= 0;
    options.context.situationalTD ??= 0;
    options.context.rollModes ??= { ta: 0, td: 0, bonus: 0 };
    return super._initializeApplicationOptions(options);
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = { ...this.options.context };
    const baseFormula = context.formula ?? "1d20";
    const ta = (context.rollModes?.ta ?? 0) + Number(context.situationalTA ?? 0);
    const td = (context.rollModes?.td ?? 0) + Number(context.situationalTD ?? 0);
    const bonus = context.rollModes?.bonus ?? 0;
    context.displayFormula = mythcraft.rolls.MythCraftRoll.applyRollModes(baseFormula, { ta, td, bonus });
    return context;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options);

    if (partId === "footer") context.rollModes = CONFIG.ChatMessage.modes;

    return context;
  }

  /* -------------------------------------------------- */

  /**
   * Change and store the picked roll mode.
   * @this RollDialog
   * @param {PointerEvent} event    The originating click event.
   * @param {HTMLElement} target    The capturing HTML element which defined a [data-action].
   */
  static #setRollMode(event, target) {
    this.options.context.rollMode = target.dataset.rollMode;
    this.render({ parts: ["footer"] });
  }

  /**
   * Re-render dialog when situational TA/TD or other inputs change so the displayed
   * formula reflects the current state. Subclasses may override but should call super.
   * @inheritdoc
   */
  _onChangeForm(formConfig, event) {
    super._onChangeForm(formConfig, event);
    const formData = foundry.utils.expandObject(new FormDataExtended(this.element).object);
    foundry.utils.mergeObject(this.options.context, formData);
    this.render({ window: { title: this.title } });
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  _processFormData(event, form, formData) {
    formData = super._processFormData(event, form, formData);

    formData.rollMode = this.options.context.rollMode;
    formData.situationalTA = Number(formData.situationalTA ?? 0);
    formData.situationalTD = Number(formData.situationalTD ?? 0);

    return formData;
  }
}
