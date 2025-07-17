import { systemPath } from "../../constants.mjs";
import DocumentInput from "../api/document-input.mjs";

/**
 * Simple live-updating input for {@linkcode mythcraft.data.models.SourceModel | `SourceModel`}
 */
export default class DocumentSourceInput extends DocumentInput {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["document-source"],
    window: {
      title: "MYTHCRAFT.Source.UpdateTitle",
      icon: "fa-solid fa-book",
    },
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static PARTS = {
    body: {
      template: systemPath("templates/apps/document-source-input.hbs"),
    },
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    context.sourceValues = this.document.system.source._source;

    context.sourceFields = this.document.system.source.schema.fields;

    return context;
  }
}
