import MythCraftActorSheet from "./actor-sheet.mjs";
import AdvancementModel from "../../data/item/advancement.mjs";
import { systemPath } from "../../constants.mjs";
import enrichHTML from "../../utils/enrich-html.mjs";
import InitiativeRollDialog from "../apps/initiative-roll-dialog.mjs";

/**
 * An actor sheet for character type actors.
 */
export default class CharacterSheet extends MythCraftActorSheet {

  /**
   * A set of journal/contact/additionalInfo entry IDs that are expanded on this sheet.
   * @type {Set<string>}
   */
  #expandedCards = new Set();

  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    actions: {
      toggleFavorite: this.#toggleFavorite,
      toggleJournalCard: this.#toggleJournalCard,
      addAdditionalInfo: this.#addAdditionalInfo,
      removeAdditionalInfo: this.#removeAdditionalInfo,
      addJournalEntry: this.#addJournalEntry,
      removeJournalEntry: this.#removeJournalEntry,
      addContact: this.#addContact,
      removeContact: this.#removeContact,
      addResource: this.#addResource,
      removeResource: this.#removeResource,
      rollInitiative: this.#rollInitiative,
    },
  };

  /**
   * Toggle the favorite flag on an item.
   *
   * @this CharacterSheet
   * @param {PointerEvent} event   The originating click event.
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action].
   */
  static async #toggleFavorite(event, target) {
    const itemId = target.closest("[data-item-id]")?.dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (!item) return;
    const current = item.getFlag("mythcraft", "favorite") ?? false;
    await item.setFlag("mythcraft", "favorite", !current);
  }

  static #toggleJournalCard(event, target) {
    const entryId = target.closest("[data-entry-id]").dataset.entryId;
    if (this.#expandedCards.has(entryId)) this.#expandedCards.delete(entryId);
    else this.#expandedCards.add(entryId);
    this.render({ parts: ["journal"] });
  }

  static async #addAdditionalInfo() {
    const id = foundry.utils.randomID();
    this.#expandedCards.add(id);
    await this.actor.update({ [`system.additionalInfo.${id}`]: { name: "", category: "", description: "" } });
  }

  static async #removeAdditionalInfo(event, target) {
    const entryId = target.dataset.entryId;
    await this.actor.update({ [`system.additionalInfo.-=${entryId}`]: null });
  }

  static async #addJournalEntry() {
    const id = foundry.utils.randomID();
    this.#expandedCards.add(id);
    await this.actor.update({ [`system.journal.${id}`]: { name: "", date: "", content: "" } });
  }

  static async #removeJournalEntry(event, target) {
    const entryId = target.dataset.entryId;
    await this.actor.update({ [`system.journal.-=${entryId}`]: null });
  }

  static async #addContact() {
    const id = foundry.utils.randomID();
    this.#expandedCards.add(id);
    await this.actor.update({ [`system.contacts.${id}`]: { name: "", location: "", description: "" } });
  }

  static async #removeContact(event, target) {
    const entryId = target.dataset.entryId;
    await this.actor.update({ [`system.contacts.-=${entryId}`]: null });
  }

  static async #addResource() {
    const id = foundry.utils.randomID();
    await this.actor.update({ [`system.resources.${id}`]: { name: "", value: 0, max: 0 } });
  }

  static async #removeResource(event, target) {
    const entryId = target.dataset.entryId;
    await this.actor.update({ [`system.resources.-=${entryId}`]: null });
  }

  /**
   * Open the initiative roll dialog from the header button.
   *
   * @this CharacterSheet
   * @param {PointerEvent} event   The originating click event.
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action].
   */
  static async #rollInitiative(event, target) {
    const system = this.actor.system;
    const awr = system.attributes.awr ?? 0;
    const bonus = system.initiative.bonus ?? 0;
    const total = system.initiative.total ?? 0;

    const fd = await InitiativeRollDialog.create({
      context: { awr, bonus, total },
    });
    if (!fd) return;

    const { rollMode } = fd;
    const formula = `1d20 + ${awr} + ${bonus}`;
    const roll = new mythcraft.rolls.InitiativeRoll(formula, this.actor.getRollData());
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      rollMode,
    });
  }

  /** @inheritdoc */
  static TABS = {
    primary: {
      tabs: [
        { id: "stats" },
        { id: "spells" },
        { id: "equipment" },
        { id: "talents" },
        { id: "effects" },
        { id: "biography" },
        { id: "journal" },
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
    journal: {
      template: systemPath("templates/actor/journal.hbs"),
      scrollable: [""],
    },
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  _restrictLimited(record) {
    super._restrictLimited(record);
    delete record.equipment;
    delete record.talents;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options);

    switch (partId) {
      case "equipment":
        await this._prepareEquipmentTab(context, options);
        context.tab = context.tabs[partId];
        break;
      case "talents":
        await this._prepareTalentsTab(context, options);
        context.tab = context.tabs[partId];
        break;
      case "journal":
        context.additionalInfo = await this.#prepareJournalEntries("additionalInfo", "description");
        context.journal = await this.#prepareJournalEntries("journal", "content");
        context.contacts = await this.#prepareJournalEntries("contacts", "description");
        context.resources = this.actor.system.resources ?? {};
        context.tab = context.tabs.journal;
        break;
    }

    return context;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _prepareSpellsTab(context, options) {
    await super._prepareSpellsTab(context, options);

    context.magicLevels = Object.entries(mythcraft.CONFIG.spells.sources).reduce((magic, [key, sourceInfo]) => {
      magic.push({
        name: `system.powerLevel.${key}`,
        value: this.actor.system.powerLevel[key],
        label: sourceInfo.label,
      });
      return magic;
    }, []);
  }

  /* -------------------------------------------------- */

  /**
   * Mutate the context for the equipment tab.
   * @param {object} context
   * @param {ApplicationRenderOptions} options
   */
  async _prepareEquipmentTab(context, options) {
    context.currencies = Object.entries(mythcraft.CONFIG.currencies).map(([key, { label, tooltip }]) => ({
      label, tooltip,
      value: this.actor.system.currency[key],
      name: `system.currency.${key}`,
    }));

    context.armor = [];

    const sortedArmor = this.actor.itemTypes.armor.toSorted((a, b) => a.sort - b.sort);

    for (const item of sortedArmor) {
      const expanded = this.expanded.items.has(item.id);
      const itemContext = { item, expanded };
      if (expanded) itemContext.embed = await item.system.toEmbed({});

      context.armor.push(itemContext);
    }

    context.gear = [];

    const sortedGear = this.actor.itemTypes.gear.toSorted((a, b) => a.sort - b.sort);

    for (const item of sortedGear) {
      const expanded = this.expanded.items.has(item.id);
      const itemContext = { item, expanded };
      if (expanded) itemContext.embed = await item.system.toEmbed({});

      context.gear.push(itemContext);
    }

    context.weapons = [];

    const sortedWeapons = this.actor.itemTypes.weapon.toSorted((a, b) => a.sort - b.sort);

    for (const item of sortedWeapons) {
      const expanded = this.expanded.items.has(item.id);
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

    const sortedTalents = this.actor.itemTypes.talent.toSorted((a, b) => {
      const aFav = a.getFlag("mythcraft", "favorite") ? 0 : 1;
      const bFav = b.getFlag("mythcraft", "favorite") ? 0 : 1;
      if (aFav !== bFav) return aFav - bFav;
      return a.sort - b.sort;
    });

    for (const item of sortedTalents) {
      const expanded = this.expanded.items.has(item.id);
      const itemContext = { item, expanded };
      if (expanded) itemContext.embed = await item.system.toEmbed({});

      context.talents.push(itemContext);
    }

    context.features = [];
    const sortedFeatures = this.actor.itemTypes.feature.toSorted((a, b) => {
      const aFav = a.getFlag("mythcraft", "favorite") ? 0 : 1;
      const bFav = b.getFlag("mythcraft", "favorite") ? 0 : 1;
      if (aFav !== bFav) return aFav - bFav;
      return a.sort - b.sort;
    });

    for (const item of sortedFeatures) {
      const expanded = this.expanded.items.has(item.id);
      const itemContext = { item, expanded };
      if (expanded) itemContext.embed = await item.system.toEmbed({});

      context.features.push(itemContext);
    }
  }

  /**
   * Annotate journal-style entries with expanded state, enriched HTML, and field references.
   * @param {string} fieldName The system field name (e.g. "journal", "contacts", "additionalInfo").
   * @param {string} htmlField The name of the HTML sub-field (e.g. "content", "description").
   * @returns {Promise<object>} Object with `entries` (keyed by ID) and `field` (the HTMLField reference).
   */
  async #prepareJournalEntries(fieldName, htmlField) {
    const entries = this.actor.system[fieldName] ?? {};
    const field = new foundry.data.fields.HTMLField();
    const prepared = {};
    for (const [id, entry] of Object.entries(entries)) {
      prepared[id] = {
        ...entry,
        expanded: this.#expandedCards.has(id),
        enrichedHTML: await enrichHTML(entry[htmlField] ?? "", { relativeTo: this.actor }),
      };
    }
    return { entries: prepared, field };
  }

  /** @inheritdoc */
  async _prepareHeader(context, options) {
    await super._prepareHeader(context, options);

    const originTypes = ["lineage", "background", "profession"];
    context.origins = originTypes.map(type => {
      const item = this.actor.itemTypes[type][0] ?? null;
      return {
        type,
        label: game.i18n.localize(CONFIG.Item.typeLabels[type]),
        item,
        name: item?.name ?? "\u2014",
      };
    });
  }

  /* -------------------------------------------------- */
  /*   Drag and Drop                                    */
  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _onDropItem(event, item) {
    // Sort & Permission check first
    if (!this.isEditable) return null;
    if (this.actor.uuid === item.parent?.uuid) {
      const result = await this._onSortItem(event, item);
      return result?.length ? item : null;
    }

    if (item.system instanceof AdvancementModel) {
      return item.system.applyAdvancements({ actor: this.actor, levels: { end: this.actor.system.level } });
    }

    // Fixed default implementation, see https://github.com/foundryvtt/foundryvtt/issues/13166

    const keepId = !this.actor.items.has(item.id);
    const itemData = game.items.fromCompendium(item, { keepId, clearFolder: true });
    const result = await Item.implementation.create(itemData, { parent: this.actor, keepId });
    return result ?? null;
  }

  /** @inheritdoc */
  async _onDropFolder(event, data) {
    if (!this.actor.isOwner) return null;
    const folder = await Folder.implementation.fromDropData(data);
    if (folder.type !== "Item") return null;
    const droppedItemData = await Promise.all(
      folder.contents.map(async (/** @type {DrawSteelItem} */ item) => {
        if (!(document instanceof Item)) item = await fromUuid(item.uuid);

        if (item.supportsAdvancements && (item.getEmbeddedCollection("Advancement").size > 0)) {
          ui.notifications.error("MYTHCRAFT.SHEET.NoCreateAdvancement", { format: { name: item.name } });
          return null;
        }

        const keepId = !this.actor.items.has(item.id);

        return game.items.fromCompendium(item, { keepId, clearFolder: true });
      }),
    );
    await this.actor.createEmbeddedDocuments("Item", droppedItemData.filter(_ => _), { keepId: true });
    return folder;
  }
}
