import MythCraftActorSheet from "./actor-sheet.mjs";
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

  /**
   * Mutate the context for the equipment tab.
   * @param {object} context
   * @param {ApplicationRenderOptions} options
   */
  async _prepareEquipmentTab(context, options) {
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
    const sortedFeatures = this.actor.itemTypes.talent.toSorted((a, b) => a.sort - b.sort);

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
}
