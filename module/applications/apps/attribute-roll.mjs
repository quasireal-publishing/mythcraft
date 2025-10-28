import { systemPath } from "../../constants.mjs";
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
      formula: "1d20 + @situationalBonus",
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
    if (this.options.context.skill) return game.i18n.format("MYTHCRAFT.Roll.AttributeRoll.Title.Skill", {
      attr: this.attributeLabel,
      skill: this.skillLabel,

    });
    else return game.i18n.format("MYTHCRAFT.Roll.AttributeRoll.Title.Attribute", {
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
   * Localized skill, falls back to the empty string.
   */
  get skillLabel() {
    return game.i18n.localize(mythcraft.CONFIG.skills.list[this.options.context.skill]?.label) ?? "";
  }

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

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    const skillInfo = mythcraft.CONFIG.skills.list[this.options.context.skill];

    if (skillInfo?.specialized) {
      context.specialization = {
        options: [{ label: "x1", value: 1 }, { label: "x1/2", value: 0.5 }, { label: "x0", value: 0 }],
        value: this.options.context.specialization,
      };
    }

    return context;
  }
}
