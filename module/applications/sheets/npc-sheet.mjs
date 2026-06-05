import MythCraftActorSheet from "./actor-sheet.mjs";
import { systemPath } from "../../constants.mjs";
import enrichHTML from "../../utils/enrich-html.mjs";
import rollFeature from "./_roll-feature.mjs";

export default class NPCSheet extends MythCraftActorSheet {

  /**
   * The d20 value at/under which a feature attack is a critical fail.
   * NPC = 1; the siege sheet overrides to 2.
   * @type {number}
   */
  get featureCritFail() {
    return 1;
  }

  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    actions: {
      rollFeature: NPCSheet.#rollFeature,
      toggleSection: NPCSheet.#toggleSection,
    },
  };

  /** @inheritdoc */
  static TABS = {
    primary: {
      tabs: [
        { id: "statblock" },
        { id: "effects" },
        { id: "biography" },
      ],
      initial: "statblock",
      labelPrefix: "MYTHCRAFT.SHEET.Tabs",
    },
  };

  /* -------------------------------------------------- */

  /**
   * Section ids currently collapsed in the consolidated stat-block view.
   * Seeded with the reference-only sections (combat-critical sections start open).
   * @type {Set<string>}
   */
  #collapsedSections = new Set(["skills", "exploration", "damageMods", "features", "spells"]);

  /**
   * Per-section collapsed booleans for the stat-block templates (`@root.collapsed.<id>`).
   * @returns {Record<string, boolean>}
   */
  get collapsedContext() {
    const ids = ["core", "attributes", "skills", "exploration", "damageMods", "features", "actions", "reactions", "spells"];
    return ids.reduce((obj, id) => { obj[id] = this.#collapsedSections.has(id); return obj; }, {});
  }

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
      templates: [
        systemPath("templates/actor/partials/collapsible-section.hbs"),
      ],
      scrollable: [""],
    },
    features: {
      template: systemPath("templates/actor/features.hbs"),
      templates: [
        systemPath("templates/actor/partials/collapsible-section.hbs"),
        systemPath("templates/actor/partials/attack-card-list.hbs"),
        systemPath("templates/actor/partials/attack-card.hbs"),
      ],
      scrollable: [""],
    },
    spells: {
      template: systemPath("templates/actor/spells.hbs"),
      templates: [
        systemPath("templates/actor/partials/collapsible-section.hbs"),
        systemPath("templates/actor/partials/spells-body.hbs"),
      ],
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
    // The consolidated stat block (stats + features + spells) is hidden from
    // limited viewers; only biography remains. Remove the shared tab and the
    // three parts that render into it.
    delete record.statblock;
    delete record.stats;
    delete record.features;
    delete record.spells;
    delete record.effects;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options);

    // The stats, features, and spells parts all render into the single
    // "statblock" tab as stacked collapsible sections.
    switch (partId) {
      case "stats":
        context.tab = context.tabs.statblock;
        context.collapsed = this.collapsedContext;
        break;
      case "features":
        await this._prepareFeaturesTab(context, options);
        context.tab = context.tabs.statblock;
        context.collapsed = this.collapsedContext;
        break;
      case "spells":
        await this._prepareSpellsTab(context, options);
        context.tab = context.tabs.statblock;
        context.collapsed = this.collapsedContext;
        context.statblockTab = true;
        break;
    }

    return context;
  }

  /* -------------------------------------------------- */

  /**
   * Toggle a collapsible stat-block section open/closed. The collapse state is
   * sheet-scoped so it survives Foundry's re-render-on-change (e.g. HP edits).
   *
   * @this NPCSheet
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #toggleSection(event, target) {
    const id = target.closest("[data-section]")?.dataset.section;
    if (!id) return;
    if (this.#collapsedSections.has(id)) this.#collapsedSections.delete(id);
    else this.#collapsedSections.add(id);
    const part = target.closest("[data-application-part]").dataset.applicationPart;
    this.render({ parts: [part] });
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
      if (defense) attrInfo.defense = { label: systemSchema.getField(["defenses", defense]).label, value: this.actor.system.defenses[defense] };
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

    // Flat skill list for the dedicated Skills section. `override` reads from
    // _source so the input value reflects the stored override (null → empty),
    // independent of the derived `bonus`; `calculated` drives the placeholder.
    context.skillList = Object.entries(this.actor.system.skills).map(([id, data]) => ({
      id,
      label: game.i18n.format(
        mythcraft.CONFIG.skills.list[id]?.specialized ?? mythcraft.CONFIG.skills.list[id]?.label ?? id,
        data,
      ),
      bonus: data.bonus,
      calculated: data.calculated,
      override: this.actor.system._source.skills[id]?.override ?? null,
    })).sort((a, b) => a.label.localeCompare(b.label));

    // Suggestion lists for <tag-input> elements in npc-stats.hbs.
    context.traitOptions = mythcraft.CONFIG.monster.traitOptions;
    context.damageTypeOptions = mythcraft.CONFIG.damage.options;

    this._prepareConditionsContext(context);
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
      const itemContext = {
        item,
        expanded,
        atkDisplay: item.system.hasAttack ? item.system.evaluatedAttackBonus : null,
        hasAtk: !!item.system.hasAttack,
        dcDisplay: item.system.hasSave ? item.system.evaluatedSaveDC : null,
        hasDc: !!item.system.hasSave,
        damageFirst: item.system.damage[0]?.formula ?? null,
        isRollable: item.system.isRollable,
      };
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
   * Roll or post a feature card to chat.
   * @this NPCSheet
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #rollFeature(event, target) {
    const itemId = target.closest("[data-item-id]")?.dataset.itemId;
    const item = this.actor.items.get(itemId);
    await rollFeature(this.actor, item, this.featureCritFail);
  }
}
