import MCDocumentSheetMixin from "../api/document-sheet-mixin.mjs";
import { systemPath } from "../../constants.mjs";
import enrichHTML from "../../utils/enrich-html.mjs";

const { ActorSheet } = foundry.applications.sheets;

/**
 * An actor sheet for siege weapon type actors.
 */
export default class SiegeWeaponSheet extends MCDocumentSheetMixin(ActorSheet) {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["actor", "siege-weapon"],
    actions: {
      toggleEffect: this.#toggleEffect,
      toggleEffectEmbed: this.#toggleEffectEmbed,
      createDoc: this.#createDoc,
    },
    position: {
      width: 520,
    },
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static TABS = {
    primary: {
      tabs: [
        { id: "stats" },
        { id: "effects" },
      ],
      initial: "stats",
      labelPrefix: "MYTHCRAFT.SHEET.Tabs",
    },
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static PARTS = {
    header: {
      template: systemPath("templates/actor/siege-weapon-header.hbs"),
    },
    tabs: {
      template: "templates/generic/tab-navigation.hbs",
    },
    stats: {
      template: systemPath("templates/actor/siege-weapon.hbs"),
      scrollable: [""],
    },
    effects: {
      template: systemPath("templates/actor/effects.hbs"),
      scrollable: [""],
    },
  };

  /* -------------------------------------------------- */

  #expanded = {
    /** @type {Set<string>} */
    effects: new Set(),
  };

  /**
   * Information about expanded descriptions used during rendering.
   */
  get expanded() {
    return this.#expanded;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options);

    switch (partId) {
      case "header":
        break;
      case "tabs":
        break;
      case "stats":
        await this._prepareStatsTab(context, options);
        context.tab = context.tabs[partId];
        break;
      case "effects":
        await this._prepareEffectsTab(context, options);
        context.tab = context.tabs[partId];
        break;
      default:
        context.tab = context.tabs[partId];
    }

    return context;
  }

  /* -------------------------------------------------- */

  /**
   * Mutate the context for the stats tab.
   * @param {object} context
   * @param {ApplicationRenderOptions} options
   */
  async _prepareStatsTab(context, options) {
    context.enrichedDescription = await enrichHTML(this.actor.system.description.value, { relativeTo: this.actor });
    context.enrichedGMNotes = await enrichHTML(this.actor.system.description.gm, { relativeTo: this.actor });
  }

  /* -------------------------------------------------- */

  /**
   * Mutate the context for the effects tab.
   * @param {object} context
   * @param {ApplicationRenderOptions} options
   */
  async _prepareEffectsTab(context, options) {
    const categories = {
      temporary: {
        type: "temporary",
        label: game.i18n.localize("MYTHCRAFT.Effect.Temporary"),
        effects: [],
      },
      passive: {
        type: "passive",
        label: game.i18n.localize("MYTHCRAFT.Effect.Passive"),
        effects: [],
      },
      inactive: {
        type: "inactive",
        label: game.i18n.localize("MYTHCRAFT.Effect.Inactive"),
        effects: [],
      },
    };

    for (const effect of this.actor.allApplicableEffects()) {
      const expanded = this.#expanded.effects.has(effect.uuid);
      const ctx = { effect, expanded };
      if (expanded) ctx.embed = await effect.toEmbed({ inline: true });
      if (effect.disabled) categories.inactive.effects.push(ctx);
      else if (effect.isTemporary) categories.temporary.effects.push(ctx);
      else categories.passive.effects.push(ctx);
    }

    for (const c of Object.values(categories)) {
      c.effects.sort((a, b) => (a.effect.sort || 0) - (b.effect.sort || 0));
    }
    context.effects = categories;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _onFirstRender(context, options) {
    await super._onFirstRender(context, options);

    this._createContextMenu(this._getEffectListContextOptions, "[data-document-class][data-effect-id] .effect-controls .fa-ellipsis-vertical", {
      eventName: "click",
      hookName: "getActiveEffectListContextOptions",
      parentClassHooks: false,
      fixed: true,
    });
  }

  /* -------------------------------------------------- */

  /**
   * Get context menu entries for effect lists.
   * @returns {ContextMenuEntry[]}
   * @protected
   */
  _getEffectListContextOptions() {
    return [
      {
        name: "MYTHCRAFT.SHEET.Edit",
        icon: '<i class="fa-solid fa-fw fa-edit"></i>',
        callback: async (target) => {
          const effect = this._getEmbeddedDocument(target);
          await effect.sheet.render({ force: true });
        },
      },
      {
        name: "MYTHCRAFT.SHEET.Delete",
        icon: '<i class="fa-solid fa-fw fa-trash"></i>',
        condition: () => this.isEditable,
        callback: async (target) => {
          const effect = this._getEmbeddedDocument(target);
          await effect.deleteDialog();
        },
      },
    ];
  }

  /* -------------------------------------------------- */

  /**
   * Fetches the embedded document representing the containing HTML element.
   * @param {HTMLElement} target
   * @returns {ActiveEffect}
   */
  _getEmbeddedDocument(target) {
    const docRow = target.closest("[data-document-class]");
    const { effectId } = docRow.dataset;
    return this.actor.effects.get(effectId);
  }

  /* -------------------------------------------- */
  /*   Action Event Handlers                       */
  /* -------------------------------------------- */

  /**
   * Toggle an active effect on/off.
   *
   * @this SiegeWeaponSheet
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #toggleEffect(event, target) {
    const effect = this._getEmbeddedDocument(target);
    effect.update({ disabled: !effect.disabled });
  }

  /* -------------------------------------------------- */

  /**
   * Toggle the effect embed between visible and hidden.
   *
   * @this SiegeWeaponSheet
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #toggleEffectEmbed(event, target) {
    const effect = this._getEmbeddedDocument(target);

    if (this.#expanded.effects.has(effect.uuid)) this.#expanded.effects.delete(effect.uuid);
    else this.#expanded.effects.add(effect.uuid);

    const part = target.closest("[data-application-part]").dataset.applicationPart;
    this.render({ parts: [part] });
  }

  /* -------------------------------------------------- */

  /**
   * Handle creating a new embedded document.
   *
   * @this SiegeWeaponSheet
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #createDoc(event, target) {
    const docCls = getDocumentClass(target.dataset.documentClass);
    const docData = {
      name: docCls.defaultName({
        type: target.dataset.type,
        parent: this.actor,
      }),
    };
    for (const [dataKey, value] of Object.entries(target.dataset)) {
      if (["action", "documentClass"].includes(dataKey)) continue;
      foundry.utils.setProperty(docData, dataKey, value);
    }
    docCls.create(docData, { parent: this.actor, renderSheet: true });
  }
}
