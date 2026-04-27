import { systemPath } from "../../constants.mjs";
import RollDialog from "../api/roll-dialog.mjs";

export default class InitiativeRollDialog extends RollDialog {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    window: {
      title: "",
    },
    context: {
      awr: 0,
      bonus: 0,
      total: 0,
    },
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static PARTS = {
    content: {
      template: systemPath("templates/roll/initiative-roll.hbs"),
    },
    footer: super.PARTS.footer,
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  get title() {
    return game.i18n.localize("MYTHCRAFT.Roll.Initiative");
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    return context;
  }
}
