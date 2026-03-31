import { systemPath } from "../../constants.mjs";
import RollDialog from "../api/roll-dialog.mjs";

const { FormDataExtended } = foundry.applications.ux;

export default class AttackRollDialog extends RollDialog {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    window: {
      title: "",
    },
    context: {
      attribute: null,
      critHit: 20,
      critFail: 1,
      formula: "1d20 + @situationalBonus",
    },
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static PARTS = {
    content: {
      template: systemPath("templates/roll/attack-roll.hbs"),
    },
    footer: super.PARTS.footer,
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  get title() {
    return game.i18n.format("MYTHCRAFT.Roll.Attack", {
      attr: this.attributeLabel,
    });
  }

  /* -------------------------------------------------- */

  /**
   * Localized attribute string.
   */
  get attributeLabel() {
    return game.i18n.localize(`MYTHCRAFT.Actor.base.FIELDS.attributes.${this.options.context.attribute}.label`);
  }

  /* -------------------------------------------------- */

  /**
   * Amend the context based on changed form values.
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
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    context.attributeLabel = this.attributeLabel;

    return context;
  }
}
