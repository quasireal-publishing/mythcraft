import constructHTMLButton from "../../utils/construct-html-button.mjs";
import { systemId } from "../../constants.mjs";
import DocumentSourceInput from "../apps/document-source-input.mjs";

/** @import { Constructor } from "@common/_types.mjs" */

const { HandlebarsApplicationMixin } = foundry.applications.api;

/**
 * Augments a Document Sheet with MythCraft specific behavior.
 * @template {Constructor<foundry.applications.api.DocumentSheet>} BaseDocumentSheet
 * @param {BaseDocumentSheet} base
 */
export default base => {
  // eslint-disable-next-line @jsdoc/require-jsdoc
  return class MCDocumentSheet extends HandlebarsApplicationMixin(base) {
    /** @inheritdoc */
    static DEFAULT_OPTIONS = {
      classes: [systemId],
      form: {
        submitOnChange: true,
        closeOnSubmit: false,
      },
      window: {
        resizable: true,
      },
      actions: {
        toggleMode: this.#toggleMode,
        updateSource: this.#updateSource,
      },
    };

    /* -------------------------------------------------- */

    /**
     * Available sheet modes.
     */
    static MODES = Object.freeze({
      PLAY: "play",
      EDIT: "edit",
    });

    /* -------------------------------------------------- */

    /**
     * The mode the sheet is currently in.
     * @type {typeof MCDocumentSheet.MODES[keyof typeof MCDocumentSheet.MODES]}
     * @protected
     */
    _mode = MCDocumentSheet.MODES.PLAY;

    /* -------------------------------------------------- */

    /**
     * Is this sheet in Play Mode?
     * @returns {boolean}
     */
    get isPlayMode() {
      return this._mode === MCDocumentSheet.MODES.PLAY;
    }

    /* -------------------------------------------------- */

    /**
     * Is this sheet in Edit Mode?
     * @returns {boolean}
     */
    get isEditMode() {
      return this._mode === MCDocumentSheet.MODES.EDIT;
    }

    /* -------------------------------------------------- */

    /** @inheritdoc */
    _initializeApplicationOptions(options) {
      const initialized = super._initializeApplicationOptions(options);
      initialized.classes.push(initialized.document.type);
      return initialized;
    }

    /* -------------------------------------------------- */

    /** @inheritdoc */
    _configureRenderOptions(options) {
      super._configureRenderOptions(options);
      if (options.mode && this.isEditable) this._mode = options.mode;
      // New sheets should always start in edit mode
      else if (options.renderContext === `create${this.document.documentName}`) this._mode = MCDocumentSheet.MODES.EDIT;
    }

    /* -------------------------------------------------- */

    /** @inheritdoc */
    async _renderFrame(options) {
      const frame = await super._renderFrame(options);
      const buttons = [constructHTMLButton({ label: "", classes: ["header-control", "icon", "fa-solid", "fa-user-lock"], dataset: { action: "toggleMode", tooltip: "MYTHCRAFT.SHEET.ToggleMode" } })];

      if (this.document.system.source) {
        buttons.push(constructHTMLButton({ label: "", classes: ["header-control", "icon", "fa-solid", "fa-book"], dataset: { action: "updateSource", tooltip: "MYTHCRAFT.SHEET.UpdateSource" } }));
      }
      this.window.controls.after(...buttons);

      return frame;
    }

    /* -------------------------------------------------- */

    /** @inheritdoc */
    async _prepareContext(options) {
      const context = await super._prepareContext(options);
      Object.assign(context, {
        isPlay: this.isPlayMode,
        owner: this.document.isOwner,
        limited: this.document.limited,
        gm: game.user.isGM,
        document: this.document,
        system: this.document.system,
        systemSource: this.document.system._source,
        systemFields: this.document.system.schema.fields,
        flags: this.document.flags,
        config: mythcraft.CONFIG,
      });
      return context;
    }

    /* -------------------------------------------------- */

    /**
   * Toggle Edit vs. Play mode.
   *
   * @this MCDocumentSheet
   * @param {PointerEvent} event   The originating click event.
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action].
   */
    static async #toggleMode(event, target) {
      if (!this.isEditable) {
        console.error("You can't switch to Edit mode if the sheet is uneditable");
        return;
      }
      this._mode = this.isPlayMode ? MCDocumentSheet.MODES.EDIT : MCDocumentSheet.MODES.PLAY;
      this.render();
    }

    /* -------------------------------------------------- */

    /**
     * Open the update source dialog.
     *
     * @this MCDocumentSheet
     * @param {PointerEvent} event   The originating click event.
     * @param {HTMLElement} target   The capturing HTML element which defined a [data-action].
     */
    static async #updateSource(event, target) {
      new DocumentSourceInput({ document: this.document }).render({ force: true });
    }
  };
};
