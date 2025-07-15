import MCDocumentSheetMixin from "../api/document-sheet-mixin.mjs";
import { systemId, systemPath } from "../../constants.mjs";

const { ItemSheet } = foundry.applications.sheets;

/**
 * A general implementation of ItemSheetV2 for system usage
 */
export default class MythCraftItemSheet extends MCDocumentSheetMixin(ItemSheet) {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["item"],
    actions: {
      viewDoc: this.#viewEffect,
      createDoc: this.#createEffect,
      deleteDoc: this.#deleteEffect,
      toggleEffect: this.#toggleEffect,
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

  /** @inheritdoc */
  _configureRenderParts(options) {
    const parts = super._configureRenderParts(options);

    if (this.document.limited) this._restrictLimited(parts);

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
    delete record.details;
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
   * Mutate the context for the description tab
   * @param {object} context
   * @param {ApplicationRenderOptions} options
   */
  async _prepareDescriptionTab(context, options) {
    const TextEditor = foundry.applications.ux.TextEditor.implementation;

    const enrichmentOptions = {
      secrets: this.item.isOwner,
      rollData: this.item.getRollData(),
      relativeTo: this.item,
    };

    context.enrichedDescription = await TextEditor.enrichHTML(this.item.system.description.value, { ...enrichmentOptions });

    context.enrichedGMNotes = await TextEditor.enrichHTML(this.item.system.description.gm, { ...enrichmentOptions });
  }

  /* -------------------------------------------------- */

  /**
   * Mutate the context for the details tab
   * @param {object} context
   * @param {ApplicationRenderOptions} options
   */
  async _prepareDetailsTab(context, options) {
    context.partialPath = this.constructor.DETAILS_PARTIAL[this.item.type];
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
    for (const e of this.item.effects) {
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

  /* -------------------------------------------- */
  /*  Public API                                  */
  /* -------------------------------------------- */

  /* -------------------------------------------- */
  /*  Action Event Handlers                       */
  /* -------------------------------------------- */

  /**
   * Renders an embedded document's sheet
   *
   * @this MythCraftItemSheet
   * @param {PointerEvent} event   The originating click event
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
   * @protected
   */
  static async #viewEffect(event, target) {
    const effect = this._getEffect(target);
    effect.sheet.render(true);
  }

  /* -------------------------------------------------- */

  /**
   * Handles item deletion
   *
   * @this MythCraftItemSheet
   * @param {PointerEvent} event   The originating click event
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
   * @protected
   */
  static async #deleteEffect(event, target) {
    const effect = this._getEffect(target);
    effect.delete();
  }

  /* -------------------------------------------------- */

  /**
   * Handle creating a new Owned Item or ActiveEffect for the actor using initial data defined in the HTML dataset
   *
   * @this MythCraftItemSheet
   * @param {PointerEvent} event   The originating click event
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
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
   * Determines effect parent to pass to helper
   *
   * @this MythCraftItemSheet
   * @param {PointerEvent} event   The originating click event
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
   * @private
   */
  static async #toggleEffect(event, target) {
    const effect = this._getEffect(target);
    effect.update({ disabled: !effect.disabled });
  }

  /* -------------------------------------------- */
  /*  Drag and Drop                               */
  /* -------------------------------------------- */

  /* -------------------------------------------------- */
  /*   Helper functions                                 */
  /* -------------------------------------------------- */

  /**
   * Fetches the row with the data for the rendered embedded document
   *
   * @param {HTMLElement} target  The element with the action
   * @returns {HTMLLIElement} The document's row
   */
  _getEffect(target) {
    const li = target.closest(".effect");
    return this.item.effects.get(li?.dataset?.effectId);
  }

}
