import MythCraftActorSheet from "./actor-sheet.mjs";
import { systemPath } from "../../constants.mjs";
import FeatureModel from "../../data/item/feature.mjs";

/**
 * An actor sheet for npc type actors.
 */
export default class NPCSheet extends MythCraftActorSheet {

  /** @inheritdoc */
  static TABS = {
    primary: {
      tabs: [
        {
          id: "stats",
        },
        {
          id: "features",
        },
        {
          id: "spells",
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

    context.features = Object.entries(FeatureModel.schema.getField("category").choices).reduce((record, [key, label]) => {
      record[key] = { label, list: [] };
      return record;
    }, {});

    const sortedFeatures = this.actor.itemTypes.feature.toSorted((a, b) => a.sort - b.sort);

    for (const item of sortedFeatures) {
      const expanded = this.expanded.items.has(item.id);
      const itemContext = { item, expanded };
      if (expanded) itemContext.embed = await item.system.toEmbed({});

      context.features[item.system.category].list.push(itemContext);
    }
  }
}
