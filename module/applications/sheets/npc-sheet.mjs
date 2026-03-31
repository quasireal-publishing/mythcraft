import MythCraftActorSheet from "./actor-sheet.mjs";
import { systemPath } from "../../constants.mjs";
import enrichHTML from "../../utils/enrich-html.mjs";

/**
 * An actor sheet for npc type actors.
 */
export default class NPCSheet extends MythCraftActorSheet {

  /** @inheritdoc */
  static TABS = {
    primary: {
      tabs: [
        { id: "stats" },
        { id: "features" },
        { id: "spells" },
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
    features: {
      template: systemPath("templates/actor/features.hbs"),
      scrollable: [""],
    },
    spells: {
      template: systemPath("templates/actor/spells.hbs"),
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
    delete record.features;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options);

    switch (partId) {
      case "features":
        await this._prepareFeaturesTab(context, options);
        context.tab = context.tabs[partId];
        break;
    }

    return context;
  }

  /* -------------------------------------------------- */

  /**
   * Mutate the context for the features tab.
   * @param {object} context
   * @param {ApplicationRenderOptions} options
   */
  async _prepareFeaturesTab(context, options) {

    context.enrichedActions = await enrichHTML(this.actor.system.actions);

    const sortedFeatures = this.actor.itemTypes.feature.toSorted((a, b) => a.sort - b.sort);

    // Build item context for each feature.
    const buildContext = async (item) => {
      const expanded = this.expanded.items.has(item.id);
      const itemContext = { item, expanded };
      if (expanded) itemContext.embed = await item.system.toEmbed({});
      return itemContext;
    };

    // Passives — flat list
    const passives = sortedFeatures.filter(f => f.system.category === "passive");
    context.passives = await Promise.all(passives.map(buildContext));

    // Actions — grouped by tier
    const actions = sortedFeatures.filter(f => f.system.category === "action");
    const tieredActions = {};
    for (const action of actions) {
      const tier = action.system.tier ?? 1;
      tieredActions[tier] ??= [];
      tieredActions[tier].push(await buildContext(action));
    }
    context.tieredActions = Object.keys(tieredActions)
      .sort((a, b) => Number(a) - Number(b))
      .reduce((obj, key) => { obj[key] = tieredActions[key]; return obj; }, {});

    // Reactions — flat list
    const reactions = sortedFeatures.filter(f => f.system.category === "reaction");
    context.reactions = await Promise.all(reactions.map(buildContext));
  }
}
