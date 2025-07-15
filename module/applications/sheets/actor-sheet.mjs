import MCDocumentSheetMixin from "../api/document-sheet-mixin.mjs";
import { systemId, systemPath } from "../../constants.mjs";

/** @import { ApplicationRenderOptions } from "@client/applications/_types.mjs" */

const { ActorSheet } = foundry.applications.sheets;

/**
 * A general implementation of ActorSheetV2 for system usage
 */
export default class SystemActorSheet extends MCDocumentSheetMixin(ActorSheet) {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["actor"],
    actions: {
      viewDoc: this.#viewDoc,
      createDoc: this.#createDoc,
      deleteDoc: this.#deleteDoc,
      toggleEffect: this.#toggleEffect,
      toggleItemEmbed: this.#toggleItemEmbed,
    },
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static TABS = {
    primary: {
      tabs: [
        {
          id: "stats",
        },
        {
          id: "spells",
        },
        {
          id: "equipment",
        },
        {
          id: "talents",
        },
        {
          id: "effects",
        },
        {
          id: "biography",
        },
      ],
      initial: "stats",
      labelPrefix: "MYTHCRAFT.Sheets.Tabs",
    },
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static PARTS = {
    header: {
      template: systemPath("templates/actor/header.hbs"),
    },
    tabs: {
      template: "templates/generic/tab-navigation.hbs",
    },
    stats: {
      template: systemPath("templates/actor/stats.hbs"),
      scrollable: [""],
    },
    spells: {
      template: systemPath("templates/actor/spells.hbs"),
      scrollable: [""],
    },
    equipment: {
      template: systemPath("templates/actor/equipment.hbs"),
      scrollable: [""],
    },
    talents: {
      template: systemPath("templates/actor/talents.hbs"),
      scrollable: [""],
    },
    effects: {
      template: systemPath("templates/actor/effects.hbs"),
      scrollable: [""],
    },
    biography: {
      template: systemPath("templates/actor/biography.hbs"),
      scrollable: [""],
    },
  };

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  /**
   * Information about expanded descriptions used during rendering.
   */
  #expanded = {
    /**
     * A set of item IDs that have expanded descriptions on this sheet
     * @type {Set<string>}
     */
    items: new Set(),
    /**
     * A set of relative effect UUIDs that have expanded descriptions on this sheet
     * @type {Set<string>}
     */
    effects: new Set(),
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  _configureRenderParts(options) {
    const parts = super._configureRenderParts(options);

    if (this.document.limited) {
      this._restrictLimited(parts);
      this.tabGroups.primary = "biography";
    }

    return parts;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  _prepareTabs(group) {
    const tabs = super._prepareTabs(group);

    if (this.document.limited && (group === "primary")) this._restrictLimited(tabs);

    return tabs;
  }

  /* -------------------------------------------------- */

  /**
   * Helper function to mutate the parts or tab object to remove sections that aren't visible to Limited-only users.
   * @param {Record<string, any>} record The parts or tabs object
   */
  _restrictLimited(record) {
    delete record.stats;
    delete record.spells;
    delete record.equipment;
    delete record.talents;
    delete record.effects;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options);

    switch (partId) {
      case "header": break;
      case "tabs": break;
      case "stats":
        await this._prepareStatsTab(context);
        context.tab = context.tabs[partId];
        break;
      case "spells":
        await this._prepareSpellsTab(context);
        context.tab = context.tabs[partId];
        break;
      case "equipment":
        await this._prepareEquipmentTab(context);
        context.tab = context.tabs[partId];
        break;
      case "talents":
        await this._prepareTalentsTab(context);
        context.tab = context.tabs[partId];
        break;
      case "effects":
        await this._prepareEffectsTab(context);
        context.tab = context.tabs[partId];
        break;
      case "biography":
        await this._prepareBiographyTab(context);
        context.tab = context.tabs[partId];
        break;
      default:
        context.tab = context.tabs[partId];
        Hooks.callAll(`${systemId}.prepareActorTab`, partId, context, options);
    }

    return context;
  }

  /* -------------------------------------------------- */

  /**
   * Mutate the context for the stats tab
   * @param {object} context
   * @param {ApplicationRenderOptions} options
   */
  async _prepareStatsTab(context, options) {

    const systemSchema = this.actor.system.schema;
    const systemData = this.actor.system._source;

    const attributeConfig = mythcraft.CONFIG.attributes;
    context.attributeInfo = Object.entries(systemData.attributes).reduce((obj, [key, value]) => {
      const field = systemSchema.getField(["attributes", key]);
      const group = attributeConfig.list[key].group;
      obj[group] ??= { label: attributeConfig.groups[group].label, list: [] };
      obj[group].list.push({ value, field });
      return obj;
    }, {});

    const defenseConfig = mythcraft.CONFIG.defenses;
    context.defenseInfo = Object.entries(systemData.defenses).reduce((obj, [key, value]) => {
      const field = systemSchema.getField(["defenses", key]);
      const group = defenseConfig.list[key].group;
      obj[group] ??= { label: defenseConfig.groups[group].label, list: [] };
      obj[group].list.push({ value, field });
      return obj;
    }, {});

    const damageConfig = mythcraft.CONFIG.damage;

    context.damageOptions = Object.entries(damageConfig.types).reduce((types, [value, { label, category }]) => {
      types.push({
        value,
        label: game.i18n.localize(label),
        group: game.i18n.localize(damageConfig.categories[category].label),
      });
      return types;
    }, []);
  }

  /* -------------------------------------------------- */

  /**
   * Mutate the context for the spells tab
   * @param {object} context
   * @param {ApplicationRenderOptions} options
   */
  async _prepareSpellsTab(context, options) {
    context.spells = [];

    const sortedSpells = this.actor.itemTypes.spell.toSorted((a, b) => a.sort - b.sort);

    for (const item of sortedSpells) {
      const expanded = this.#expanded.items.has(item.id);
      const itemContext = { item, expanded };
      if (expanded) itemContext.embed = await item.system.toEmbed({});

      context.spells.push(itemContext);
    }
  }

  /* -------------------------------------------------- */

  /**
   * Mutate the context for the equipment tab
   * @param {object} context
   * @param {ApplicationRenderOptions} options
   */
  async _prepareEquipmentTab(context, options) {
    context.armor = [];

    const sortedArmor = this.actor.itemTypes.armor.toSorted((a, b) => a.sort - b.sort);

    for (const item of sortedArmor) {
      const expanded = this.#expanded.items.has(item.id);
      const itemContext = { item, expanded };
      if (expanded) itemContext.embed = await item.system.toEmbed({});

      context.armor.push(itemContext);
    }

    context.gear = [];

    const sortedGear = this.actor.itemTypes.gear.toSorted((a, b) => a.sort - b.sort);

    for (const item of sortedGear) {
      const expanded = this.#expanded.items.has(item.id);
      const itemContext = { item, expanded };
      if (expanded) itemContext.embed = await item.system.toEmbed({});

      context.gear.push(itemContext);
    }

    context.weapons = [];

    const sortedWeapons = this.actor.itemTypes.weapon.toSorted((a, b) => a.sort - b.sort);

    for (const item of sortedWeapons) {
      const expanded = this.#expanded.items.has(item.id);
      const itemContext = { item, expanded };
      if (expanded) itemContext.embed = await item.system.toEmbed({});

      context.weapons.push(itemContext);
    }

  }

  /* -------------------------------------------------- */

  /**
   * Mutate the context for the talents tab
   * @param {object} context
   * @param {ApplicationRenderOptions} options
   */
  async _prepareTalentsTab(context, options) {
    context.talents = [];

    const sortedTalents = this.actor.itemTypes.talent.toSorted((a, b) => a.sort - b.sort);

    for (const item of sortedTalents) {
      const expanded = this.#expanded.items.has(item.id);
      const itemContext = { item, expanded };
      if (expanded) itemContext.embed = await item.system.toEmbed({});

      context.talents.push(itemContext);
    }
  }

  /* -------------------------------------------------- */

  /**
   * Mutate the context for the effects tab
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
    for (const e of this.actor.allApplicableEffects()) {
      if (e.disabled) categories.inactive.effects.push(e);
      else if (e.isTemporary) categories.temporary.effects.push(e);
      else categories.passive.effects.push(e);
    }

    // Sort each category
    for (const c of Object.values(categories)) {
      c.effects.sort((a, b) => (a.sort || 0) - (b.sort || 0));
    }
    context.effects = categories;
  }

  /* -------------------------------------------------- */

  /**
   * Mutate the context for the biography tab
   * @param {object} context
   * @param {ApplicationRenderOptions} options
   */
  async _prepareBiographyTab(context, options) {
    // Text Enrichment is a foundry-specific implementation of RegEx that transforms text like [[/r 1d20]] into a clickable link
    // It's needed for the nice "display" version of the prosemirror editors
    const TextEditor = foundry.applications.ux.TextEditor.implementation;

    // One common pitfall with reusing enrichment options is that they are passed by reference to descendent functions
    // This can cause problems with foundry's Embed Depth handling, so always destructure with { ...options } when passing to a new enrichHTML call
    const enrichmentOptions = {
      secrets: this.actor.isOwner,
      rollData: this.actor.getRollData(),
      relativeTo: this.actor,
    };

    context.enrichedBiography = await TextEditor.enrichHTML(this.actor.system.biography.value, { ...enrichmentOptions });

    context.enrichedGMNotes = await TextEditor.enrichHTML(this.actor.system.biography.gm, { ...enrichmentOptions });
  }

  /* -------------------------------------------------- */

  /**
   * Actions performed after any render of the Application.
   * Post-render steps are not awaited by the render process.
   * @param {ApplicationRenderContext} context      Prepared context data
   * @param {RenderOptions} options                 Provided render options
   * @protected
   * @inheritdoc
   */
  async _onRender(context, options) {
    await super._onRender(context, options);
    this.#disableOverrides();
  }
  /* -------------------------------------------- */
  /*  Public API                                  */
  /* -------------------------------------------- */

  /* -------------------------------------------- */
  /*  Action Event Handlers                       */
  /* -------------------------------------------- */

  /**
   * Renders an embedded document's sheet
   *
   * @this SystemActorSheet
   * @param {PointerEvent} event   The originating click event
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
   * @protected
   */
  static async #viewDoc(event, target) {
    const doc = this._getEmbeddedDocument(target);
    doc.sheet.render(true);
  }

  /* -------------------------------------------------- */

  /**
   * Handles item deletion
   *
   * @this SystemActorSheet
   * @param {PointerEvent} event   The originating click event
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
   * @protected
   */
  static async #deleteDoc(event, target) {
    const doc = this._getEmbeddedDocument(target);
    doc.delete();
  }

  /* -------------------------------------------------- */

  /**
   * Handle creating a new Owned Item or ActiveEffect for the actor using initial data defined in the HTML dataset
   *
   * @this SystemActorSheet
   * @param {PointerEvent} event   The originating click event
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
   * @private
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
    docCls.create(docData, { parent: this.actor });
  }

  /* -------------------------------------------------- */

  /**
   * Toggle the item embed between visible and hidden. Only visible embeds are generated in the HTML
   * TODO: Refactor re-rendering to instead use CSS transitions
   * @this SystemActorSheet
   * @param {PointerEvent} event   The originating click event
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
   * @protected
   */
  static async #toggleItemEmbed(event, target) {
    const { itemId } = target.closest(".item").dataset;

    if (this.#expanded.items.has(itemId)) this.#expanded.items.delete(itemId);
    else this.#expanded.items.add(itemId);

    const part = target.closest("[data-application-part]").dataset.applicationPart;
    this.render({ parts: [part] });
  }

  /* -------------------------------------------------- */

  /**
   * Determines effect parent to pass to helper
   *
   * @this SystemActorSheet
   * @param {PointerEvent} event   The originating click event
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
   * @private
   */
  static async #toggleEffect(event, target) {
    const effect = this._getEmbeddedDocument(target);
    effect.update({ disabled: !effect.disabled });
  }

  /* -------------------------------------------- */
  /*  Drag and Drop                               */
  /* -------------------------------------------- */

  /* -------------------------------------------------- */
  /*   Helper functions                                 */
  /* -------------------------------------------------- */

  /**
   * Fetches the embedded document representing the containing HTML element
   *
   * @param {HTMLElement} target      The element subject to search
   * @returns {Item|ActiveEffect}     The embedded Item or ActiveEffect
   */
  _getEmbeddedDocument(target) {
    const docRow = target.closest("li[data-document-class]");
    if (docRow.dataset.documentClass === "Item") {
      return this.actor.items.get(docRow.dataset.itemId);
    } else if (docRow.dataset.documentClass === "ActiveEffect") {
      const parent = docRow.dataset.parentId === this.actor.id ?
        this.actor :
        this.actor.items.get(docRow?.dataset.parentId);
      return parent.effects.get(docRow.dataset.effectId);
    } else {
      console.warn("Could not find document class");
    }
  }

  /* -------------------------------------------------- */

  /**
   * Disables inputs subject to active effects
   */
  #disableOverrides() {
    const flatOverrides = foundry.utils.flattenObject(this.actor.overrides);
    for (const override of Object.keys(flatOverrides)) {
      const input = this.element.querySelector(`[name="${override}"]`);
      if (input) input.disabled = true;
    }
  }
}
