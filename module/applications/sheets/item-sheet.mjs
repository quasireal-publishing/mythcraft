import MCDocumentSheetMixin from "../api/document-sheet-mixin.mjs";
import { systemId, systemPath } from "../../constants.mjs";
import enrichHTML from "../../utils/enrich-html.mjs";
import { BaseAdvancement } from "../../data/pseudo-documents/advancements/_module.mjs";

/**
 * @import PseudoDocument from "../../data/pseudo-documents/pseudo-document.mjs";
 */

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
      createPseudoDocument: this.#createPseudoDocument,
      deletePseudoDocument: this.#deletePseudoDocument,
      renderPseudoDocumentSheet: this.#renderPseudoDocumentSheet,
      toggleEffect: this.#toggleEffect,
      toggleEffectEmbed: this.#toggleEffectEmbed,
    },
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static TABS = {
    primary: {
      tabs: [
        { id: "description" },
        { id: "details" },
        { id: "advancements" },
        { id: "effects" },
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

  /**
   * Partials to pull in for the Details tab by item type.
   * Modules can add to this property directly to register their partials.
   */
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
    context.advancementIcon = BaseAdvancement.metadata.icon;
    const advs = {};
    /** @type {foundry.utils.Collection<string, BaseAdvancement>} */
    const models = this.document.getEmbeddedPseudoDocumentCollection("Advancement")[
      this.isPlayMode ? "contents" : "sourceContents"
    ];
    for (const model of models) {
      if (!advs[model.requirements.level]) {
        const section = Number.isNumeric(model.requirements.level) ?
          game.i18n.format("MYTHCRAFT.Advancement.HEADERS.level", { level: model.requirements.level }) :
          game.i18n.localize("MYTHCRAFT.Advancement.HEADERS.null");
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
      c.effects.sort((a, b) => (a.effect.sort || 0) - (b.effect.sort || 0));
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

  /** @inheritDoc */
  async _onRender(context, options) {
    await super._onRender(context, options);
    new foundry.applications.ux.DragDrop.implementation({
      dragSelector: ".draggable",
      permissions: {
        dragstart: this._canDragStart.bind(this),
        drop: this._canDragDrop.bind(this),
      },
      callbacks: {
        dragstart: this._onDragStart.bind(this),
        dragover: this._onDragOver.bind(this),
        drop: this._onDrop.bind(this),
      },
    }).bind(this.element);
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
     * Create a pseudo-document.
     * @this {DSDocumentSheet}
     * @param {PointerEvent} event    The initiating click event.
     * @param {HTMLElement} target    The capturing HTML element which defined a [data-action].
     */
  static #createPseudoDocument(event, target) {
    const documentName = target.closest("[data-pseudo-document-name]").dataset.pseudoDocumentName;
    const type = target.closest("[data-pseudo-type]")?.dataset.pseudoType;
    const Cls = this.document.getEmbeddedPseudoDocumentCollection(documentName).documentClass;

    if (!type && (foundry.utils.isSubclass(Cls, mythcraft.data.pseudoDocuments.TypedPseudoDocument))) {
      Cls.createDialog({}, { parent: this.document });
    } else {
      Cls.create({ type }, { parent: this.document });
    }
  }

  /* -------------------------------------------------- */

  /**
     * Delete a pseudo-document.
     * @this {DSDocumentSheet}
     * @param {PointerEvent} event    The initiating click event.
     * @param {HTMLElement} target    The capturing HTML element which defined a [data-action].
     */
  static #deletePseudoDocument(event, target) {
    const doc = this._getPseudoDocument(target);
    doc.delete();
  }

  /* -------------------------------------------------- */

  /**
     * Render the sheet of a pseudo-document.
     * @this {DSDocumentSheet}
     * @param {PointerEvent} event    The initiating click event.
     * @param {HTMLElement} target    The capturing HTML element which defined a [data-action].
     */
  static #renderPseudoDocumentSheet(event, target) {
    const doc = this._getPseudoDocument(target);
    doc.sheet.render({ force: true });
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

  /**
   * Define whether a user is able to begin a dragstart workflow for a given drag selector.
   * @param {string} selector       The candidate HTML selector for dragging.
   * @returns {boolean}             Can the current user drag this selector?
   * @protected
   */
  _canDragStart(selector) {
    return this.isEditable;
  }

  /* -------------------------------------------- */

  /**
   * Define whether a user is able to conclude a drag-and-drop workflow for a given drop selector.
   * @param {string} selector       The candidate HTML selector for the drop target.
   * @returns {boolean}             Can the current user drop on this selector?
   * @protected
   */
  _canDragDrop(selector) {
    return this.isEditable;
  }

  /* -------------------------------------------- */

  /**
   * An event that occurs when a drag workflow begins for a draggable ActiveEffect on the sheet.
   * @param {DragEvent} event       The initiating drag start event.
   * @returns {Promise<void>}
   * @protected
   */
  async _onDragStart(event) {
    const target = event.currentTarget;
    if ("link" in event.target.dataset) return;

    // If a Document reference is being dragged, assume it is either an ActiveEffect
    const item = this.document;
    const { effectId } = target.dataset;
    const document = this.item.effects.get(effectId);

    // Set data transfer
    const dragData = document?.toDragData();
    if (dragData) event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
  }

  /* -------------------------------------------- */

  /**
   * An event that occurs when a drag workflow moves over a drop target.
   * @param {DragEvent} event
   * @protected
   */
  _onDragOver(event) {}

  /* -------------------------------------------- */

  /**
   * An event that occurs when data is dropped into a drop target.
   * @param {DragEvent} event
   * @returns {Promise<void>}
   * @protected
   */
  async _onDrop(event) {
    const data = foundry.applications.ux.TextEditor.implementation.getDragEventData(event);
    const actor = this.actor;
    const allowed = Hooks.call("dropItemSheetData", actor, this, data);
    if (allowed === false) return;

    // Dropped Documents
    const documentClass = foundry.utils.getDocumentClass(data.type);
    if (documentClass) {
      const document = await documentClass.fromDropData(data);
      await this._onDropDocument(event, document);
    }
  }

  /* -------------------------------------------- */

  /**
   * Handle a dropped document on the ActorSheet.
   * @template {Document} TDocument
   * @param {DragEvent} event         The initiating drop event.
   * @param {TDocument} document       The resolved Document class.
   * @returns {Promise<TDocument|null>} A Document of the same type as the dropped one in case of a successful result,
   *                                    or null in case of failure or no action being taken.
   * @protected
   */
  async _onDropDocument(event, document) {
    switch (document.documentName) {
      case "ActiveEffect":
        return (await this._onDropActiveEffect(event, document)) ?? null;
      default:
        return null;
    }
  }

  /* -------------------------------------------- */

  /**
   * Handle a dropped Active Effect on the Item Sheet.
   * The default implementation creates an Active Effect embedded document on the Item.
   * @param {DragEvent} event       The initiating drop event.
   * @param {ActiveEffect} effect   The dropped ActiveEffect document.
   * @returns {Promise<ActiveEffect|null|undefined>} A Promise resolving to a newly created ActiveEffect, if one was
   *                                                 created, or otherwise a nullish value.
   * @protected
   */
  async _onDropActiveEffect(event, effect) {
    const item = this.document;
    if (!item.isOwner) return null;
    if (item === effect.parent) return this._onSortActiveEffect(event, effect);
    const keepId = !item.effects.has(effect.id);
    const result = await ActiveEffect.implementation.create(effect.toObject(), { parent: item, keepId });
    return result ?? null;
  }

  /**
   * Handle a drop event for an existing embedded ActiveEffect to sort that ActiveEffect relative to its siblings.
   * @param {DragEvent} event       The initiating drop event.
   * @param {ActiveEffect} effect   The dropped ActiveEffect document.
   * @returns {Promise<ActiveEffect[]>|void}
   * @protected
   */
  async _onSortActiveEffect(event, effect) {
    const effects = this.item.effects;
    const source = effects.get(effect.id);

    // Confirm the drop target
    const dropTarget = event.target.closest("[data-effect-id]");
    if (!dropTarget) return;
    const target = effects.get(dropTarget.dataset.effectId);
    if (source.id === target.id) return;

    // Identify sibling effects based on adjacent HTML elements
    const siblings = [];
    for (const element of dropTarget.parentElement.children) {
      const siblingId = element.dataset.effectId;
      if (siblingId && (siblingId !== source.id)) siblings.push(effects.get(element.dataset.effectId));
    }

    // Perform the sort
    const sortUpdates = foundry.utils.performIntegerSort(source, { target, siblings });
    const updateData = sortUpdates.map(u => {
      const update = u.update;
      update._id = u.target._id;
      return update;
    });

    // Perform the update
    return this.item.updateEmbeddedDocuments("ActiveEffect", updateData);
  }

  /* -------------------------------------------------- */
  /*   Helper functions                                 */
  /* -------------------------------------------------- */

  /**
     * Helper method to retrieve an embedded pseudo-document.
     * @param {HTMLElement} element   The element with relevant data.
     * @returns {PseudoDocument}
     */
  _getPseudoDocument(element) {
    const documentName = element.closest("[data-pseudo-document-name]").dataset.pseudoDocumentName;
    const id = element.closest("[data-pseudo-id]").dataset.pseudoId;
    return this.document.getEmbeddedDocument(documentName, id);
  }

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
