import MythCraftActorSheet from "./actor-sheet.mjs";
import AdvancementModel from "../../data/item/advancement.mjs";
import { systemPath } from "../../constants.mjs";

/**
 * An actor sheet for character type actors.
 */
export default class CharacterSheet extends MythCraftActorSheet {
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

    const sortedTalents = this.actor.itemTypes.talent.toSorted((a, b) => a.sort - b.sort);

    for (const item of sortedTalents) {
      const expanded = this.expanded.items.has(item.id);
      const itemContext = { item, expanded };
      if (expanded) itemContext.embed = await item.system.toEmbed({});

      context.talents.push(itemContext);
    }

    context.features = [];
    const sortedFeatures = this.actor.itemTypes.feature.toSorted((a, b) => a.sort - b.sort);

    for (const item of sortedFeatures) {
      const expanded = this.expanded.items.has(item.id);
      const itemContext = { item, expanded };
      if (expanded) itemContext.embed = await item.system.toEmbed({});

      context.features.push(itemContext);
    }
  }

  /** @inheritdoc */
  async _prepareBiographyTab(context, options) {
    await super._prepareBiographyTab(context, options);

    context.origins = [...this.#prepareOrigin("lineage"), ...this.#prepareOrigin("background"), ...this.#prepareOrigin("profession")];
  }

  /**
   * Helper function to construct origin context for the biography tab.
   * @param {string} type A valid item subtype.
   * @returns {object[]}
   */
  #prepareOrigin(type) {
    const contexts = [];
    for (const item of this.actor.itemTypes[type]) {
      contexts.push({ item });
    }
    if (!this.actor.itemTypes[type].length) {
      contexts.push({ type, label: game.i18n.localize(CONFIG.Item.typeLabels[type]) });
    }
    return contexts;
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
