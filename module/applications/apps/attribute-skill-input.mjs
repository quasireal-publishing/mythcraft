import { systemPath } from "../../constants.mjs";
import DocumentInput from "../api/document-input.mjs";

/**
 * Live-updating form for an attribute and its related skills
 */
export default class AttributeSkillInput extends DocumentInput {

  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    attribute: null,
    classes: ["attribute-skill-editor"],
    window: {
      // icon: "fa-solid fa-book",
    },
    actions: {
      addSkill: this.#addSkill,
      removeSkill: this.#removeSkill,
    },
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static PARTS = {
    body: {
      template: systemPath("templates/apps/attribute-skill-input.hbs"),
    },
  };

  /* -------------------------------------------------- */

  get title() {
    return game.i18n.format("MYTHCRAFT.Actor.base.AttributeSkillInput.Title", {
      attr: this.document.system.schema.getField(["attributes", this.attribute])?.hint,
      name: this.document.name,
    });
  }

  /* -------------------------------------------------- */

  /**
   * The attribute being configured for this actor
   * @type {string}
   */
  get attribute() {
    return this.options.attribute;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    context.attribute = {
      field: this.document.system.schema.getField(["attributes", this.attribute]),
      value: this.document.system.attributes[this.attribute],
    };

    context.attrSkills = Object.entries(mythcraft.CONFIG.skills.list).reduce((arr, [id, skillInfo]) => {
      if ((skillInfo.attribute === this.attribute)) {
        arr.push({
          label: skillInfo.label,
          value: id,
          disabled: id in this.document.system.skills,
          skillPoints: this.document.system.skills[id]?.value,
          fieldPath: `system.skills.${id}.value`,
        });
      }
      return arr;
    }, []);

    return context;
  }

  /* -------------------------------------------------- */

  /**
   * Add a skill entry for this actor
   *
   * @this AttributeSkillInput
   * @param {PointerEvent} event   The originating click event
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
   */
  static async #addSkill(event, target) {
    const skill = target.previousElementSibling.value;
    this.document.update({ [`system.skills.${skill}.value`]: 0 });
  }

  /* -------------------------------------------------- */

  /**
   * Remove a skill entry for this actor
   *
   * @this AttributeSkillInput
   * @param {PointerEvent} event   The originating click event
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
   */
  static async #removeSkill(event, target) {
    const skill = target.dataset.skill;
    this.document.update({ [`system.skills.-=${skill}`]: null });
  }

}
