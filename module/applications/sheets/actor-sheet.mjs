import MCDocumentSheetMixin from "../api/document-sheet-mixin.mjs";
import { systemId, systemPath } from "../../constants.mjs";
import MythCraftItemSheet from "./item-sheet.mjs";
import AttributeSkillInput from "../apps/attribute-skill-input.mjs";

/** @import { ApplicationRenderOptions } from "@client/applications/_types.mjs" */

const { ActorSheet } = foundry.applications.sheets;

/**
 * A general implementation of ActorSheetV2 for system usage.
 */
export default class MythCraftActorSheet extends MCDocumentSheetMixin(ActorSheet) {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["actor"],
    actions: {
      addSense: this.#addSense,
      removeSense: this.#removeSense,
      editAttribute: this.#editAttribute,
      rollAttribute: this.#rollAttribute,
      rollSkill: this.#rollSkill,
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
      labelPrefix: "MYTHCRAFT.SHEET.Tabs",
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
     * A set of item IDs that have expanded descriptions on this sheet.
     * @type {Set<string>}
     */
    items: new Set(),
    /**
     * A set of relative effect UUIDs that have expanded descriptions on this sheet.
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
   * @param {Record<string, any>} record The parts or tabs object.
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
   * Mutate the context for the stats tab.
   * @param {object} context
   * @param {ApplicationRenderOptions} options
   */
  async _prepareStatsTab(context, options) {

    const systemSchema = this.actor.system.schema;
    const systemData = this.isPlayMode ? this.actor.system : this.actor.system._source;
    const unitFormatter = game.i18n.getListFormatter({ type: "unit" });

    const attributeConfig = mythcraft.CONFIG.attributes;
    const defenseConfig = mythcraft.CONFIG.defenses;
    context.attributeInfo = Object.entries(systemData.attributes).reduce((obj, [key, value]) => {
      const field = systemSchema.getField(["attributes", key]);
      const { group, defense, check } = attributeConfig.list[key];
      obj[group] ??= { label: attributeConfig.groups[group].label, list: [] };
      const attrInfo = { value, field, check };
      if (defense) attrInfo.defense = { label: systemSchema.getField(["defenses", defense]).label, value: systemData.defenses[defense] };
      attrInfo.skills = Object.entries(mythcraft.CONFIG.skills.list).reduce((arr, [id, skillInfo]) => {
        if ((id in this.actor.system.skills) && (skillInfo.attribute === key)) {
          const skillBonus = this.actor.system.skills[id].bonus;
          arr.push({
            skillId: id,
            label: skillInfo.label,
            bonus: skillBonus,
          });
        }
        return arr;
      }, []);
      obj[group].list.push(attrInfo);
      return obj;
    }, {});

    const movementInfo = Object.entries(this.actor.system.movement).map(([key, value]) => {
      if (value === null) return null;
      const label = key === "walk" ? "" : systemSchema.getField(["movement", key]).label;
      return game.i18n.format("MYTHCRAFT.Actor.base.MovementListFormat", { type: label, number: value });
    });
    context.movementInfo = unitFormatter.format(movementInfo.filter(_ => _));

    const senseOptions = Object.entries(mythcraft.CONFIG.senses).map(([value, { label }]) => ({ value, label, disabled: value in systemData.senses }));

    const senseList = Object.entries(this.actor.system.senses).map(([key, { value }]) => {
      return {
        key,
        value,
        field: systemSchema.getField("senses.element.value"),
        name: `system.senses.${key}.value`,
        label: game.i18n.localize(mythcraft.CONFIG.senses[key]?.label),
      };
    });

    const senseDescription = unitFormatter.format(senseList.map(s => game.i18n.format("MYTHCRAFT.Actor.base.SenseListFormat", { type: s.label, number: s.value })));

    context.senseInfo = { options: senseOptions, list: senseList, description: senseDescription };

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
   * Mutate the context for the spells tab.
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
   * Mutate the context for the equipment tab.
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
   * Mutate the context for the talents tab.
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
   * Mutate the context for the biography tab.
   * @param {object} context
   * @param {ApplicationRenderOptions} options
   */
  async _prepareBiographyTab(context, options) {
    // Text Enrichment is a foundry-specific implementation of RegEx that transforms text like [[/r 1d20]] into a clickable link
    // It's needed for the nice "display" version of the prosemirror editors
    const TextEditor = foundry.applications.ux.TextEditor.implementation;

    const enrichmentOptions = {
      secrets: this.actor.isOwner,
      rollData: this.actor.getRollData(),
      relativeTo: this.actor,
    };

    context.enrichedBiography = await TextEditor.enrichHTML(this.actor.system.biography.value, enrichmentOptions);

    context.enrichedGMNotes = await TextEditor.enrichHTML(this.actor.system.biography.gm, enrichmentOptions);
  }

  /* -------------------------------------------------- */

  /**
   * Actions performed after a first render of the Application.
   * @param {ApplicationRenderContext} context      Prepared context data.
   * @param {RenderOptions} options                 Provided render options.
   * @protected
   */
  async _onFirstRender(context, options) {
    await super._onFirstRender(context, options);

    this._createContextMenu(this._getItemButtonContextOptions, "[data-document-class][data-item-id], [data-document-class][data-effect-id]", {
      hookName: "getItemButtonContextOptions",
      parentClassHooks: false,
      fixed: true,
    });
  }

  /* -------------------------------------------------- */

  /**
   * Get context menu entries for item buttons.
   * @returns {ContextMenuEntry[]}
   * @protected
   */
  _getItemButtonContextOptions() {
    // name is auto-localized
    return [
      // All applicable options
      {
        name: "MYTHCRAFT.SHEET.View",
        icon: "<i class=\"fa-solid fa-fw fa-eye\"></i>",
        condition: () => this.isPlayMode,
        callback: async (target) => {
          const item = this._getEmbeddedDocument(target);
          if (!item) return console.error("Could not find item");
          await item.sheet.render({ force: true, mode: MythCraftItemSheet.MODES.PLAY });
        },
      },
      {
        name: "MYTHCRAFT.SHEET.Edit",
        icon: "<i class=\"fa-solid fa-fw fa-edit\"></i>",
        condition: () => this.isEditMode,
        callback: async (target) => {
          const item = this._getEmbeddedDocument(target);
          if (!item) return console.error("Could not find item");
          await item.sheet.render({ force: true, mode: MythCraftItemSheet.MODES.EDIT });
        },
      },
      {
        name: "MYTHCRAFT.SHEET.Share",
        icon: "<i class=\"fa-solid fa-fw fa-share-from-square\"></i>",
        callback: async (target) => {
          const item = this._getEmbeddedDocument(target);
          if (!item) return console.error("Could not find item");
          await ChatMessage.create({
            content: `@Embed[${item.uuid} caption=false]`,
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          });
        },
      },
      {
        name: "MYTHCRAFT.SHEET.Delete",
        icon: "<i class=\"fa-solid fa-fw fa-trash\"></i>",
        condition: () => this.actor.isOwner,
        callback: async (target) => {
          const item = this._getEmbeddedDocument(target);
          if (!item) return console.error("Could not find item");
          await item.deleteDialog();
        },
      },
    ];
  }

  /* -------------------------------------------------- */

  /**
   * Actions performed after any render of the Application.
   * Post-render steps are not awaited by the render process.
   * @param {ApplicationRenderContext} context      Prepared context data.
   * @param {RenderOptions} options                 Provided render options.
   * @protected
   * @inheritdoc
   */
  async _onRender(context, options) {
    await super._onRender(context, options);
  }
  /* -------------------------------------------- */
  /*  Public API                                  */
  /* -------------------------------------------- */

  /* -------------------------------------------- */
  /*  Action Event Handlers                       */
  /* -------------------------------------------- */

  /**
   * Add a new sense to the actor's data.
   *
   * @this MythCraftActorSheet
   * @param {PointerEvent} event   The originating click event.
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action].
   */
  static async #addSense(event, target) {
    const sense = target.previousElementSibling.value;
    this.document.update({ [`system.senses.${sense}.value`]: 10 });
  }

  /* -------------------------------------------------- */

  /**
   * Remove a sense from the actor's data.
   *
   * @this MythCraftActorSheet
   * @param {PointerEvent} event   The originating click event.
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action].
   */
  static async #removeSense(event, target) {
    const sense = target.dataset.sense;
    this.document.update({ [`system.senses.-=${sense}`]: null });
  }

  /* -------------------------------------------------- */

  /**
   * Edit an attribute and its associated skills.
   *
   * @this MythCraftActorSheet
   * @param {PointerEvent} event   The originating click event.
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action].
   */
  static async #editAttribute(event, target) {
    const attribute = target.closest("[data-attribute]").dataset.attribute;
    const input = new AttributeSkillInput({ document: this.document, attribute });
    await input.render({ force: true });
  }

  /* -------------------------------------------------- */

  /**
   * Make an attribute roll.
   *
   * @this MythCraftActorSheet
   * @param {PointerEvent} event   The originating click event.
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action].
   */
  static async #rollAttribute(event, target) {
    const attribute = target.closest("[data-attribute]").dataset.attribute;
    this.actor.system.rollAttribute(attribute);
  }

  /* -------------------------------------------------- */

  /**
   * Make a skill roll.
   *
   * @this MythCraftActorSheet
   * @param {PointerEvent} event   The originating click event.
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action].
   */
  static async #rollSkill(event, target) {
    const skill = target.dataset.skill;
    this.actor.system.rollSkill(skill);
  }

  /* -------------------------------------------------- */

  /**
   * Renders an embedded document's sheet.
   *
   * @this MythCraftActorSheet
   * @param {PointerEvent} event   The originating click event.
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action].
   */
  static async #viewDoc(event, target) {
    const doc = this._getEmbeddedDocument(target);
    doc.sheet.render(true);
  }

  /* -------------------------------------------------- */

  /**
   * Handles item deletion.
   *
   * @this MythCraftActorSheet
   * @param {PointerEvent} event   The originating click event.
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action].
   */
  static async #deleteDoc(event, target) {
    const doc = this._getEmbeddedDocument(target);
    doc.delete();
  }

  /* -------------------------------------------------- */

  /**
   * Handle creating a new Owned Item or ActiveEffect for the actor using initial data defined in the HTML dataset.
   *
   * @this MythCraftActorSheet
   * @param {PointerEvent} event   The originating click event.
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action].
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
   * TODO: Refactor re-rendering to instead use CSS transitions.
   * @this MythCraftActorSheet
   * @param {PointerEvent} event   The originating click event.
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action].
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
   * Determines effect parent to pass to helper.
   *
   * @this MythCraftActorSheet
   * @param {PointerEvent} event   The originating click event.
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action].
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
   * Fetches the embedded document representing the containing HTML element.
   *
   * @param {HTMLElement} target      The element subject to search.
   * @returns {Item|ActiveEffect}     The embedded Item or ActiveEffect.
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
}
