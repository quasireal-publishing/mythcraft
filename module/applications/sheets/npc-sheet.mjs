import MythCraftActorSheet from "./actor-sheet.mjs";
import { systemPath } from "../../constants.mjs";
import enrichHTML from "../../utils/enrich-html.mjs";

export default class NPCSheet extends MythCraftActorSheet {

  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    actions: {
      toggleCondition: NPCSheet.#toggleCondition,
    },
  };

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

  /** @inheritdoc */
  static PARTS = {
    header: {
      template: systemPath("templates/actor/header.hbs"),
    },
    tabs: {
      template: "templates/generic/tab-navigation.hbs",
    },
    stats: {
      template: systemPath("templates/actor/npc-stats.hbs"),
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
      case "stats":
        context.tab = context.tabs[partId];
        break;
    }

    return context;
  }

  /* -------------------------------------------------- */

  /**
   * NPC stats tab uses StringField overrides for movement/senses/damage.reduction,
   * so the base implementation's structured-field iteration would crash. Build
   * only what npc-stats.hbs uses (attributeInfo + tag-input option lists).
   * @inheritdoc
   */
  async _prepareStatsTab(context, options) {
    const systemSchema = this.actor.system.schema;
    const systemData = this.isPlayMode ? this.actor.system : this.actor.system._source;

    const attributeConfig = mythcraft.CONFIG.attributes;
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

    // Suggestion lists for <tag-input> elements in npc-stats.hbs.
    context.traitOptions = mythcraft.CONFIG.monster.traitOptions;
    context.damageTypeOptions = mythcraft.CONFIG.damage.options;
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

    const buildContext = async (item) => {
      const expanded = this.expanded.items.has(item.id);
      const itemContext = { item, expanded };
      if (expanded) itemContext.embed = await item.system.toEmbed({});
      return itemContext;
    };

    const passives = sortedFeatures.filter(f => f.system.category === "passive");
    context.passives = await Promise.all(passives.map(buildContext));

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

    const reactions = sortedFeatures.filter(f => f.system.category === "reaction");
    context.reactions = await Promise.all(reactions.map(buildContext));
  }

  /* -------------------------------------------------- */

  /**
   * Toggle a Foundry status condition on this NPC.
   * Wired to `data-action="toggleCondition"` with `data-condition="{key}"`.
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #toggleCondition(event, target) {
    const conditionId = target.dataset.condition;
    if (!conditionId) return;
    await this.actor.toggleStatusEffect(conditionId);
  }
}
