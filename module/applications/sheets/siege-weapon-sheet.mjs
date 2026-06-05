import MCDocumentSheetMixin from "../api/document-sheet-mixin.mjs";
import { systemPath } from "../../constants.mjs";
import enrichHTML from "../../utils/enrich-html.mjs";
import MythCraftItemSheet from "./item-sheet.mjs";
import rollFeature from "./_roll-feature.mjs";

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
      rollFeature: this.#rollFeature,
      rollDamage: this.#rollDamage,
      toggleItemEmbed: this.#toggleItemEmbed,
      viewDoc: this.#viewDoc,
      deleteDoc: this.#deleteDoc,
    },
    position: {
      width: 520,
    },
  };

  /* -------------------------------------------------- */

  /**
   * The d20 value at/under which a siege feature attack is a critical fail.
   * Siege attacks crit-fail on 1–2 (vs. 1 for NPC/PC).
   * @type {number}
   */
  get featureCritFail() {
    return 2;
  }

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
      templates: [
        systemPath("templates/actor/siege-weapon-actions.hbs"),
        systemPath("templates/actor/partials/attack-card-list.hbs"),
        systemPath("templates/actor/partials/attack-card.hbs"),
      ],
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
    /** @type {Set<string>} */
    items: new Set(),
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

    // Flat (non-tiered) Actions list backed by embedded `feature` items.
    const sortedActions = this.actor.itemTypes.feature.toSorted((a, b) => a.sort - b.sort);
    context.actions = await Promise.all(sortedActions.map(async (item) => {
      const expanded = this.#expanded.items.has(item.id);
      const ctx = {
        item,
        expanded,
        atkDisplay: item.system.hasAttack ? item.system.evaluatedAttackBonus : null,
        hasAtk: !!item.system.hasAttack,
        dcDisplay: item.system.hasSave ? item.system.evaluatedSaveDC : null,
        hasDc: !!item.system.hasSave,
        damageFirst: item.system.damage[0]?.formula ?? null,
        isRollable: item.system.isRollable,
      };
      if (expanded) ctx.embed = await item.system.toEmbed({});
      return ctx;
    }));
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

    this._createContextMenu(this._getItemListContextOptions, "[data-document-class][data-item-id] .item-controls .fa-ellipsis-vertical", {
      eventName: "click",
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
   * Get context menu entries for the Actions (feature item) list.
   * @returns {ContextMenuEntry[]}
   * @protected
   */
  _getItemListContextOptions() {
    return [
      {
        label: "MYTHCRAFT.SHEET.View",
        icon: "<i class=\"fa-solid fa-fw fa-eye\"></i>",
        visible: () => this.isPlayMode,
        onClick: async (_event, target) => {
          const item = this._getEmbeddedDocument(target);
          await item.sheet.render({ force: true, mode: MythCraftItemSheet.MODES.PLAY });
        },
      },
      {
        label: "MYTHCRAFT.SHEET.Edit",
        icon: "<i class=\"fa-solid fa-fw fa-edit\"></i>",
        visible: () => this.isEditMode,
        onClick: async (_event, target) => {
          const item = this._getEmbeddedDocument(target);
          await item.sheet.render({ force: true, mode: MythCraftItemSheet.MODES.EDIT });
        },
      },
      {
        label: "MYTHCRAFT.SHEET.Delete",
        icon: "<i class=\"fa-solid fa-fw fa-trash\"></i>",
        visible: () => this.isEditable,
        onClick: async (_event, target) => {
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
    return [
      {
        label: "MYTHCRAFT.SHEET.Edit",
        icon: "<i class=\"fa-solid fa-fw fa-edit\"></i>",
        onClick: async (_event, target) => {
          const effect = this._getEmbeddedDocument(target);
          await effect.sheet.render({ force: true });
        },
      },
      {
        label: "MYTHCRAFT.SHEET.Delete",
        icon: "<i class=\"fa-solid fa-fw fa-trash\"></i>",
        visible: () => this.isEditable,
        onClick: async (_event, target) => {
          const effect = this._getEmbeddedDocument(target);
          await effect.deleteDialog();
        },
      },
    ];
  }

  /* -------------------------------------------------- */

  /**
   * Fetches the embedded document (Item or ActiveEffect) for the containing HTML element.
   * @param {HTMLElement} target
   * @returns {Item|ActiveEffect}
   */
  _getEmbeddedDocument(target) {
    const docRow = target.closest("[data-document-class]");
    const { effectId, itemId } = docRow.dataset;
    const item = this.actor.items.get(itemId);
    const effects = itemId ? item?.effects : this.actor.effects;
    return effectId ? effects?.get(effectId) : item;
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

  /* -------------------------------------------------- */

  /**
   * Roll or post a siege feature/action card to chat (crit-fail on 1–2).
   *
   * @this SiegeWeaponSheet
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #rollFeature(event, target) {
    const item = this.actor.items.get(target.closest("[data-item-id]")?.dataset.itemId);
    await rollFeature(this.actor, item, this.featureCritFail);
  }

  /* -------------------------------------------------- */

  /**
   * Roll a feature item's damage array to chat.
   *
   * @this SiegeWeaponSheet
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #rollDamage(event, target) {
    event.stopPropagation();
    const item = this.actor.items.get(target.closest("[data-item-id]")?.dataset.itemId);
    if (!item) return;
    const damages = (item.system.damage ?? []).filter(d => d.formula);
    if (!damages.length) return;

    const rollData = this.actor.getRollData();
    const rolls = await Promise.all(damages.map(async d => {
      const r = new mythcraft.rolls.DamageRoll(d.formula, rollData, { type: d.type });
      await r.evaluate();
      return r;
    }));

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      rolls,
      flavor: `${item.name} — ${game.i18n.localize("MYTHCRAFT.Roll.Damage")}`,
      sound: CONFIG.sounds.dice,
    });
  }

  /* -------------------------------------------------- */

  /**
   * Toggle an action item's inline embed.
   *
   * @this SiegeWeaponSheet
   * @param {PointerEvent} event
   * @param {HTMLElement} target
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
   * Render an embedded document's sheet.
   *
   * @this SiegeWeaponSheet
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #viewDoc(event, target) {
    this._getEmbeddedDocument(target)?.sheet.render({ force: true });
  }

  /* -------------------------------------------------- */

  /**
   * Delete an embedded document.
   *
   * @this SiegeWeaponSheet
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #deleteDoc(event, target) {
    this._getEmbeddedDocument(target)?.delete();
  }
}
