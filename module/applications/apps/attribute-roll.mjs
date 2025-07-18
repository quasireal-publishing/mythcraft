import { systemPath } from "../../constants.mjs";
import BaseActorModel from "../../data/actor/base-actor.mjs";
import RollDialog from "../api/roll-dialog.mjs";

const { FormDataExtended } = foundry.applications.ux;

export default class AttributeRollDialog extends RollDialog {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    window: {
      title: "",
    },
    context: {
      attribute: null,
      skill: null,
    },
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static PARTS = {
    content: {
      template: systemPath("templates/roll/attribute-roll.hbs"),
    },
    footer: super.PARTS.footer,
  };

  /* -------------------------------------------------- */

  /** @inheritdoc*/
  get title() {
    return game.i18n.format("MYTHCRAFT.Roll.AttributeRoll.Title", {
      attr: BaseActorModel.schema.getField(["attributes", this.options.context.attribute]).label,
    });
  }

  /* -------------------------------------------------- */

  /* -------------------------------------------------- */

  /**
   * Amend the global modifiers and target specific modifiers based on changed values.
   * @inheritdoc
   */
  _onChangeForm(formConfig, event) {
    super._onChangeForm(formConfig, event);
    const formData = foundry.utils.expandObject(new FormDataExtended(this.element).object);

    foundry.utils.mergeObject(this.options.context, formData);

    this.render();
  }
}
