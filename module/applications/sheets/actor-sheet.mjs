import MCDocumentSheetMixin from "../api/document-sheet-mixin.mjs";
import { systemId, systemPath } from "../../constants.mjs";
import MythCraftItemSheet from "./item-sheet.mjs";
import AttributeSkillInput from "../apps/attribute-skill-input.mjs";
import enrichHTML from "../../utils/enrich-html.mjs";

/** @import { ApplicationRenderOptions } from "@client/applications/_types.mjs" */

const { ActorSheet } = foundry.applications.sheets;

/**
 * A base actor sheet that can be extended for document-specific properties.
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
      addAbsorb: this.#addAbsorb,
      rollMagic: this.#rollMagic,
      removeAbsorb: this.#removeAbsorb,
      viewDoc: this.#viewDoc,
      createDoc: this.#createDoc,
      deleteDoc: this.#deleteDoc,
      toggleEffect: this.#toggleEffect,
      toggleItemEmbed: this.#toggleItemEmbed,
      toggleEffectEmbed: this.#toggleEffectEmbed,
    },
    position: {
      // distance running display
      width: 635,
    },
  };

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

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

  /**
   * Information about expanded descriptions used during rendering.
   */
  get expanded() {
    return this.#expanded;
  }

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
    delete record.effects;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options);

    Hooks.callAll(`${systemId}.prepareActorTab`, partId, context, options);

    switch (partId) {
      case "header":
        await this._prepareHeader(context);
        break;
      case "tabs": break;
      case "stats":
        await this._prepareStatsTab(context, options);
        context.tab = context.tabs[partId];
        break;
      case "spells":
        await this._prepareSpellsTab(context, options);
        context.tab = context.tabs[partId];
        break;
      case "effects":
        await this._prepareEffectsTab(context, options);
        context.tab = context.tabs[partId];
        break;
      case "biography":
        await this._prepareBiographyTab(context, options);
        context.tab = context.tabs[partId];
        break;
      default: context.tab = context.tabs[partId];
    }

    return context;
  }

  /* -------------------------------------------------- */

  /**
   * Mutate the context for the header.
   * @param {object} context
   * @param {ApplicationRenderOptions} options
   */
  async _prepareHeader(context, options) {
    const formatter = game.i18n.getListFormatter({ type: "unit" });

    context.sizeOptions = Object.entries(mythcraft.CONFIG.sizes).map(([value, { label }]) => ({ value, label }));
    context.tagOptions = mythcraft.CONFIG.monster.tagOptions;

    context.tagList = formatter.format(this.actor.system.tags.map(
      t => game.i18n.localize(mythcraft.CONFIG.monster.tags[t]?.label) ?? t,
    ));
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
          const skillData = this.actor.system.skills[id];
          arr.push({
            skillId: id,
            label: game.i18n.format(skillInfo.specialized ?? skillInfo.label, skillData),
            bonus: skillData.bonus,
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
    }).sort((a, b) => (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0));

    const senseDescription = unitFormatter.format(senseList.map(s => game.i18n.format("MYTHCRAFT.Actor.base.SenseListFormat", { type: s.label, number: s.value })));

    context.senseInfo = { options: senseOptions, list: senseList, description: senseDescription };

    const damageConfig = mythcraft.CONFIG.damage;

    const absorbOptions = [];

    context.damageTypes = Object.entries(damageConfig.types).reduce((types, [value, { label, category }]) => {
      const entry = {
        value,
        label: game.i18n.localize(label),
        group: game.i18n.localize(damageConfig.categories[category].label),
      };
      types.push(entry);
      absorbOptions.push({
        ...entry,
        disabled: value in this.actor.system.damage.absorb,
      });
      return types;
    }, []);

    const formatter = game.i18n.getListFormatter({ type: "unit" });

    const keyToLabel = (key) => game.i18n.format(damageConfig.types[key]?.label) || key;

    const damageDescriptions = {
      immune: formatter.format(this.actor.system.damage.immune.map(keyToLabel)),
      affinity: formatter.format(this.actor.system.damage.affinity.map(keyToLabel)),
      reduction: this.actor.system.damage.reduction.bypasses ?
        game.i18n.format("MYTHCRAFT.Actor.base.DamageReductionListFormat", this.actor.system.damage.reduction)
        : this.actor.system.damage.reduction.value,
    };

    context.damageInfo = { absorbOptions: absorbOptions, descriptions: damageDescriptions };
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
      const itemContext = { item, expanded, magicSourceLabel: mythcraft.CONFIG.spells.sources[item.system.magicSource]?.label ?? "" };
      if (expanded) itemContext.embed = await item.system.toEmbed({ actorSheet: true });

      context.spells.push(itemContext);
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
    for (const effect of this.actor.allApplicableEffects()) {
      const expanded = this.#expanded.effects.has(effect.uuid);
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

  /**
   * Mutate the context for the biography tab.
   * @param {object} context
   * @param {ApplicationRenderOptions} options
   */
  async _prepareBiographyTab(context, options) {
    context.enrichedBiography = await enrichHTML(this.actor.system.biography.value, { relativeTo: this.actor });
    context.enrichedGMNotes = await enrichHTML(this.actor.system.biography.gm, { relativeTo: this.actor });
  }

  /* -------------------------------------------------- */

  /** @inheritdoc*/
  async _onFirstRender(context, options) {
    await super._onFirstRender(context, options);

    this._createContextMenu(this._getItemListContextOptions, "[data-document-class][data-item-id] .item-controls .fa-ellipsis-vertical", {
      eventName: "click",
      hookName: "getItemListContextOptions",
      parentClassHooks: false,
      fixed: true,
    });

    this._createContextMenu(this._getItemListContextOptions, ".origins [data-document-class][data-item-id]", {
      hookName: "getItemListContextOptions",
      parentClassHooks: false,
      fixed: true,
    });

    this._createContextMenu(this._getEffectListContextOptions, "[data-document-class][data-effect-id] .effect-controls .fa-ellipsis-vertical", {
      eventName: "click",
      hookName: "getActiveEffectListContextOptions",
      parentClassHooks: false,
      fixed: true,
    });
  }

  /* -------------------------------------------------- */

  /**
   * Get context menu entries for item lists.
   * @returns {ContextMenuEntry[]}
   * @protected
   */
  _getItemListContextOptions() {
    // name is auto-localized
    return [
      // All applicable options
      {
        name: "MYTHCRAFT.SHEET.View",
        icon: "<i class=\"fa-solid fa-fw fa-eye\"></i>",
        condition: () => this.isPlayMode,
        callback: async (target) => {
          const item = this._getEmbeddedDocument(target);
          await item.sheet.render({ force: true, mode: MythCraftItemSheet.MODES.PLAY });
        },
      },
      {
        name: "MYTHCRAFT.SHEET.Edit",
        icon: "<i class=\"fa-solid fa-fw fa-edit\"></i>",
        condition: () => this.isEditMode,
        callback: async (target) => {
          const item = this._getEmbeddedDocument(target);
          await item.sheet.render({ force: true, mode: MythCraftItemSheet.MODES.EDIT });
        },
      },
      {
        name: "MYTHCRAFT.SHEET.Share",
        icon: "<i class=\"fa-solid fa-fw fa-share-from-square\"></i>",
        callback: async (target) => {
          const item = this._getEmbeddedDocument(target);
          await ChatMessage.create({
            content: `<h5>${item.name}</h5><div>@Embed[${item.uuid} inline]</div>`,
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            title: item.name,
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
          const item = this._getEmbeddedDocument(target);
          await item.deleteDialog();
        },
      },
    ];
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
          const effect = this._getEmbeddedDocument(target);
          await effect.sheet.render({ force: true });
        },
      },
      {
        name: "MYTHCRAFT.SHEET.Share",
        icon: "<i class=\"fa-solid fa-fw fa-share-from-square\"></i>",
        callback: async (target) => {
          const effect = this._getEmbeddedDocument(target);
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
          const effect = this._getEmbeddedDocument(target);
          await effect.deleteDialog();
        },
      },
    ];
  }

  /* -------------------------------------------------- */

  /** @inheritdoc*/
  async _onRender(context, options) {
    await super._onRender(context, options);

    for (const input of this.element.querySelectorAll("input.item-input")) {
      input.addEventListener("change", ev => {
        const { itemId } = input.closest("[data-item-id]").dataset;
        const item = this.document.items.get(itemId);
        item.update({ [input.dataset.name]: input.value });
      });
    }
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
   * Add a new damage type modification to the actor's data.
   *
   * @this MythCraftActorSheet
   * @param {PointerEvent} event   The originating click event.
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action].
   */
  static async #addAbsorb(event, target) {
    const type = target.previousElementSibling.value;
    this.document.update({ [`system.damage.absorb.${type}`]: 10 });
  }

  /* -------------------------------------------------- */

  /**
   * Remove a damage type modification from the actor's data.
   *
   * @this MythCraftActorSheet
   * @param {PointerEvent} event   The originating click event.
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action].
   */
  static async #removeAbsorb(event, target) {
    const type = target.dataset.type;
    this.document.update({ [`system.damage.-=${type}`]: null });
  }

  /* -------------------------------------------------- */

  /**
   * Make an attribute roll with the actor's magic attribute.
   *
   * @this MythCraftActorSheet
   * @param {PointerEvent} event   The originating click event.
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action].
   */
  static async #rollMagic(event, target) {
    this.actor.system.rollAttribute(this.actor.system.sp.attribute);
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
    docCls.create(docData, { parent: this.actor, renderSheet: true });
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
   * Toggle the effect embed between visible and hidden. Only visible embeds are generated in the HTML
   * TODO: Refactor re-rendering to instead use CSS transitions.
   * @this MythCraftActorSheet
   * @param {PointerEvent} event   The originating click event.
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action].
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

  /**
   * Backported from v14.
   * @inheritdoc
   */
  async _onDragStart(event) {
    const target = event.currentTarget;
    if ("link" in event.target.dataset) return;

    // If a Document reference is being dragged, assume it is either an Item or ActiveEffect
    const actor = this.document;
    const { effectId, itemId } = target.dataset;
    const item = actor.items.get(itemId);
    const effects = itemId ? item?.effects : actor.effects;
    const document = effectId ? effects?.get(effectId) : item;

    // Set data transfer
    const dragData = document?.toDragData();
    if (dragData) event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
  }

  /** @inheritdoc */
  async _onDropActiveEffect(event, effect) {
    const actor = this.document;
    if (!actor.isOwner) return null;
    if ([effect.parent, effect.parent?.parent].includes(actor)) {
      const result = await this._onSortActiveEffect(event, effect);
      return result?.length ? effect : null;
    }
    else return super._onDropActiveEffect(event, effect);
  }

  /**
   * Handle a drop event for an existing embedded ActiveEffect to sort that ActiveEffect relative to its siblings.
   * @param {DragEvent} event       The initiating drop event.
   * @param {ActiveEffect} effect   The dropped ActiveEffect document.
   * @returns {Promise<ActiveEffect[]>|void}
   * @protected
   */
  async _onSortActiveEffect(event, effect) {
    const dropTarget = event.target.closest("[data-effect-id]");
    if (!dropTarget) return;
    const targetEffect = this._getEmbeddedDocument(dropTarget);
    if (targetEffect === effect) return;

    const siblings = [];
    for (const element of dropTarget.parentElement.children) {
      const { effectId, itemId } = element.dataset;
      if (effectId && (effectId !== effect.id)) siblings.push(this._getEmbeddedDocument(element));
    }

    const sortUpdates = foundry.utils.performIntegerSort(effect, { target: effect, siblings });
    // Could be improved with v14 batch updates
    for (const { target, update } of sortUpdates) {
      await target.update(update);
    }
  }

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
    const docRow = target.closest("[data-document-class]");

    const { effectId, itemId } = docRow.dataset;
    const item = this.actor.items.get(itemId);
    const effects = itemId ? item?.effects : this.actor.effects;
    return effectId ? effects?.get(effectId) : item;
  }
}
