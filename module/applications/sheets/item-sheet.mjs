import MCDocumentSheetMixin from "../api/document-sheet-mixin.mjs";
import { systemId, systemPath } from "../../constants.mjs";
import enrichHTML from "../../utils/enrich-html.mjs";

const { ItemSheet } = foundry.applications.sheets;

/**
 * A general implementation of ItemSheetV2 for system usage.
 */
export default class MythCraftItemSheet extends MCDocumentSheetMixin(ItemSheet) {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["item"],
    actions: {
      showImage: this.#showImage,
      viewDoc: this.#viewEffect,
      createDoc: this.#createEffect,
      deleteDoc: this.#deleteEffect,
      toggleEffect: this.#toggleEffect,
      toggleEffectEmbed: this.#toggleEffectEmbed,
    },
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static TABS = {
    primary: {
      tabs: [
        {
          id: "description",
        },
        {
          id: "details",
        },
        {
          id: "advancements",
        },
        {
          id: "effects",
        },
      ],
      initial: "description",
      labelPrefix: "MYTHCRAFT.SHEET.Tabs",
    },
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static PARTS = {
    header: {
      template: systemPath("templates/item/header.hbs"),
    },
    tabs: {
      template: "templates/generic/tab-navigation.hbs",
    },
    description: {
      template: systemPath("templates/item/description.hbs"),
      scrollable: [""],
    },
    details: {
      template: systemPath("templates/item/details.hbs"),
      templates: ["armor", "background", "feature", "gear", "lineage", "profession", "spell", "talent", "weapon"].map(type => systemPath(`templates/item/partials/${type}.hbs`)),
      scrollable: [""],
    },
    advancements: {
      template: systemPath("templates/item/advancements.hbs"),
      scrollable: [""],
    },
    effects: {
      template: systemPath("templates/item/effects.hbs"),
      scrollable: [""],
    },
  };

  /* -------------------------------------------------- */

  static DETAILS_PARTIAL = {
    armor: systemPath("templates/item/partials/armor.hbs"),
    background: systemPath("templates/item/partials/background.hbs"),
    feature: systemPath("templates/item/partials/feature.hbs"),
    gear: systemPath("templates/item/partials/gear.hbs"),
    lineage: systemPath("templates/item/partials/lineage.hbs"),
    profession: systemPath("templates/item/partials/profession.hbs"),
    spell: systemPath("templates/item/partials/spell.hbs"),
    talent: systemPath("templates/item/partials/talent.hbs"),
    weapon: systemPath("templates/item/partials/weapon.hbs"),
  };

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  /**
   * A set of relative effect UUIDs that have expanded descriptions on this sheet.
   */
  #expanded = new Set();

  /* -------------------------------------------------- */

  /** @inheritdoc */
  _configureRenderParts(options) {
    const parts = super._configureRenderParts(options);

    if (!this.document.system.schema.getField("advancements")) delete parts.advancements;

    if (this.document.limited) this._restrictLimited(parts);

    return parts;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  _prepareTabs(group) {
    const tabs = super._prepareTabs(group);

    if (!this.document.system.schema.getField("advancements")) delete group.advancements;

    if (this.document.limited && (group === "primary")) this._restrictLimited(tabs);

    return tabs;
  }

  /* -------------------------------------------------- */

  /**
   * Helper function to mutate the parts or tab object to remove sections that aren't visible to Limited-only users.
   * @param {Record<string, any>} record The parts or tabs object.
   */
  _restrictLimited(record) {
    delete record.details;
    delete record.advancements;
    delete record.effects;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options);

    switch (partId) {
      case "header": break;
      case "tabs": break;
      case "description":
        context.tab = context.tabs[partId];
        await this._prepareDescriptionTab(context, options);
        break;
      case "details":
        context.tab = context.tabs[partId];
        await this._prepareDetailsTab(context, options);
        break;
      case "advancements":
        context.tab = context.tabs[partId];
        await this._prepareAdvancementTab(context, options);
        break;
      case "effects":
        context.tab = context.tabs[partId];
        await this._prepareEffectsTab(context, options);
        break;
      default:
        context.tab = context.tabs[partId];
        Hooks.callAll(`${systemId}.prepareItemTab`, partId, context, options);
    }

    return context;
  }

  /* -------------------------------------------------- */

  /**
   * Mutate the context for the description tab.
   * @param {object} context
   * @param {ApplicationRenderOptions} options
   */
  async _prepareDescriptionTab(context, options) {
    context.enrichedDescription = await enrichHTML(this.item.system.description.value, { relativeTo: this.item });
    context.enrichedGMNotes = await enrichHTML(this.item.system.description.gm, { relativeTo: this.item });
  }

  /* -------------------------------------------------- */

  /**
   * Mutate the context for the details tab.
   * @param {object} context
   * @param {ApplicationRenderOptions} options
   */
  async _prepareDetailsTab(context, options) {
    context.partialPath = this.constructor.DETAILS_PARTIAL[this.item.type];
  }

  /* -------------------------------------------------- */

  /**
   * @typedef AdvancementContext
   * @property {number} level
   * @property {string} section
   * @property {BaseAdvancement} documents
   */

  /**
   * Prepares context info for the Advancements tab.
   * @returns {AdvancementContext[]}
   */
  async _prepareAdvancementTab(context, options) {
    // Advancements
    const advs = {};
    /** @type {foundry.utils.Collection<string, BaseAdvancement>} */
    const models = this.document.getEmbeddedPseudoDocumentCollection("Advancement")[
      this.isPlayMode ? "contents" : "sourceContents"
    ];
    for (const model of models) {
      if (!advs[model.requirements.level]) {
        const section = Number.isNumeric(model.requirements.level) ?
          game.i18n.format("MYTHCRAFT.ADVANCEMENT.HEADERS.level", { level: model.requirements.level }) :
          game.i18n.localize("MYTHCRAFT.ADVANCEMENT.HEADERS.null");
        advs[model.requirements.level] = {
          section,
          level: model.requirements.level,
          documents: [],
        };
      }
      const advancementContext = {
        name: model.name,
        img: model.img,
        id: model.id,
        canReconfigure: model.canReconfigure,
      };
      if (model.description) advancementContext.enrichedDescription = await enrichHTML(model.description, { relativeTo: this.document });
      advs[model.requirements.level].documents.push(advancementContext);
    }

    context.advancements = Object.values(advs).sort((a, b) => a.level - b.level);
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

    // Iterate over active effects, classifying them into categories
    for (const effect of this.item.effects) {
      const expanded = this.#expanded.has(effect.id);
      const context = { effect, expanded };
      if (expanded) context.embed = await effect.toEmbed({ inline: true });
      if (effect.disabled) categories.inactive.effects.push(context);
      else if (effect.isTemporary) categories.temporary.effects.push(context);
      else categories.passive.effects.push(context);
    }

    // Sort each category
    for (const c of Object.values(categories)) {
      c.effects.sort((a, b) => (a.sort || 0) - (b.sort || 0));
    }
    context.effects = categories;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc*/
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
    // name is auto-localized
    return [
      {
        name: "MYTHCRAFT.SHEET.Edit",
        icon: "<i class=\"fa-solid fa-fw fa-edit\"></i>",
        callback: async (target) => {
          const effect = this._getEffect(target);
          await effect.sheet.render({ force: true });
        },
      },
      {
        name: "MYTHCRAFT.SHEET.Share",
        icon: "<i class=\"fa-solid fa-fw fa-share-from-square\"></i>",
        callback: async (target) => {
          const effect = this._getEffect(target);
          await ChatMessage.create({
            content: `<h5>${effect.name}</h5><div>@Embed[${effect.uuid} inline]</div>`,
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            title: effect.name,
            flags: {
              core: { canPopout: true },
            },
          });
        },
      },
      {
        name: "MYTHCRAFT.SHEET.Delete",
        icon: "<i class=\"fa-solid fa-fw fa-trash\"></i>",
        condition: () => this.isEditable,
        callback: async (target) => {
          const effect = this._getEffect(target);
          await effect.deleteDialog();
        },
      },
    ];
  }

  /* -------------------------------------------- */
  /*  Public API                                  */
  /* -------------------------------------------- */

  /* -------------------------------------------- */
  /*  Action Event Handlers                       */
  /* -------------------------------------------- */

  /**
   * Display the item image.
   *
   * @this DrawSteelItemSheet
   * @param {PointerEvent} event   The originating click event.
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action].
   */
  static async #showImage(event, target) {
    const { img, name, uuid } = this.item;
    new foundry.applications.apps.ImagePopout({ src: img, uuid, window: { title: name } }).render({ force: true });
  }

  /* -------------------------------------------------- */

  /**
   * Renders an embedded document's sheet.
   *
   * @this MythCraftItemSheet
   * @param {PointerEvent} event   The originating click event.
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action].
   * @protected
   */
  static async #viewEffect(event, target) {
    const effect = this._getEffect(target);
    effect.sheet.render(true);
  }

  /* -------------------------------------------------- */

  /**
   * Handles item deletion.
   *
   * @this MythCraftItemSheet
   * @param {PointerEvent} event   The originating click event.
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action].
   * @protected
   */
  static async #deleteEffect(event, target) {
    const effect = this._getEffect(target);
    effect.delete();
  }

  /* -------------------------------------------------- */

  /**
   * Handle creating a new Owned Item or ActiveEffect for the actor using initial data defined in the HTML dataset.
   *
   * @this MythCraftItemSheet
   * @param {PointerEvent} event   The originating click event.
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action].
   * @private
   */
  static async #createEffect(event, target) {
    const aeCls = getDocumentClass("ActiveEffect");
    const effectData = {
      name: aeCls.defaultName({
        type: target.dataset.type,
        parent: this.item,
      }),
    };
    for (const [dataKey, value] of Object.entries(target.dataset)) {
      if (["action", "documentClass"].includes(dataKey)) continue;
      foundry.utils.setProperty(effectData, dataKey, value);
    }

    aeCls.create(effectData, { parent: this.item });
  }

  /* -------------------------------------------------- */

  /**
   * Determines effect parent to pass to helper.
   *
   * @this MythCraftItemSheet
   * @param {PointerEvent} event   The originating click event.
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action].
   * @private
   */
  static async #toggleEffect(event, target) {
    const effect = this._getEffect(target);
    effect.update({ disabled: !effect.disabled });
  }

  /* -------------------------------------------------- */

  /**
   * Toggle the effect embed between visible and hidden. Only visible embeds are generated in the HTML
   * TODO: Refactor re-rendering to instead use CSS transitions.
   * @this MythCraftActorSheet
   * @param {PointerEvent} event   The originating click event.
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action].
   */
  static async #toggleEffectEmbed(event, target) {
    const { effectId } = target.closest(".effect").dataset;

    if (this.#expanded.has(effectId)) this.#expanded.delete(effectId);
    else this.#expanded.add(effectId);

    const part = target.closest("[data-application-part]").dataset.applicationPart;
    this.render({ parts: [part] });
  }

  /* -------------------------------------------- */
  /*  Drag and Drop                               */
  /* -------------------------------------------- */

  /* -------------------------------------------------- */
  /*   Helper functions                                 */
  /* -------------------------------------------------- */

  /**
   * Fetches the row with the data for the rendered embedded document.
   *
   * @param {HTMLElement} target  The element with the action.
   * @returns {HTMLLIElement} The document's row.
   */
  _getEffect(target) {
    const li = target.closest(".effect");
    return this.item.effects.get(li?.dataset?.effectId);
  }

}
