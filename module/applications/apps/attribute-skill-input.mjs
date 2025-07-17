import { systemPath } from "../../constants.mjs";
import DocumentInput from "../api/document-input.mjs";

/**
 * Live-updating form for an attribute and its related skills
 */
export default class AttributeSkillInput extends DocumentInput {

  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["attribute-skill-editor"],
    window: {
      // icon: "fa-solid fa-book",
    },
    attribute: null,
  };

  /** @inheritdoc */
  static PARTS = {
    body: {
      template: systemPath("templates/apps/attribute-skill-input.hbs"),
    },
  };

  /**
   * The attribute being configured for this actor
   */
  get attribute() {
    return this.options.attribute;
  }

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    context.attribute = {
      field: this.document.system.schema.getField(["attributes", this.attribute]),
      value: this.document.system.attributes[this.attribute],
    };

    return context;
  }
}
