import { requiredInteger } from "../fields/helpers.mjs";
import AdvancementModel from "../item/advancement.mjs";
import BaseActorModel from "./base-actor.mjs";
import { systemId } from "../../constants.mjs";
import { calculateHpMax, calculateApMax, calculateInitiative, calculateCriticalRanges } from "../../utils/character-math.mjs";

/**
 * @import {MythCraftActor, MythCraftItem} from "../../documents/_module.mjs";
 * @import AdvancementChain from "../../utils/advancement/chain.mjs";
 */

const fields = foundry.data.fields;

/**
 * The system model for "character" type actors.
 */
export default class CharacterModel extends BaseActorModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = super.LOCALIZATION_PREFIXES.concat("MYTHCRAFT.Actor.character");

  /** @inheritdoc */
  static defineSchema() {
    const schema = super.defineSchema();

    schema.lp = new fields.SchemaField({
      value: new fields.NumberField(requiredInteger({ min: 0, initial: 0 })),
    });
    schema.ap = new fields.SchemaField({
      value: new fields.NumberField(requiredInteger({ min: 0, initial: 3 })),
      special: new fields.NumberField(requiredInteger({ min: 0, initial: 0 })),
      override: new fields.NumberField({ nullable: true, initial: null }),
    });

    schema.powerLevel = new fields.TypedObjectField(new fields.NumberField(requiredInteger({ min: 0, initial: 0 })));

    schema.currency = new fields.SchemaField({
      astra: new fields.NumberField(requiredInteger({ min: 0, initial: 0 })),
      scillings: new fields.NumberField(requiredInteger({ min: 0, initial: 0 })),
      quints: new fields.NumberField(requiredInteger({ min: 0, initial: 0 })),
      denarii: new fields.NumberField(requiredInteger({ min: 0, initial: 0 })),
      notes: new fields.StringField(),
    });

    schema.personality = new fields.SchemaField({
      values: new fields.StringField(),
      drive: new fields.StringField(),
      quirk: new fields.StringField(),
    });

    schema.appearance = new fields.SchemaField({
      height: new fields.StringField(),
      weight: new fields.StringField(),
      age: new fields.StringField(),
      description: new fields.StringField(),
    });

    schema.hpOverride = new fields.NumberField({ nullable: true, initial: null });

    schema.initiative = new fields.SchemaField({
      bonus: new fields.NumberField({ integer: true, initial: 0 }),
      override: new fields.NumberField({ nullable: true, initial: null }),
    });

    schema.critical = new fields.SchemaField({
      hit: new fields.NumberField({ integer: true, initial: 20, min: 1, max: 20 }),
      fail: new fields.NumberField({ integer: true, initial: 1, min: 1, max: 20 }),
    });

    schema.additionalInfo = new fields.TypedObjectField(new fields.SchemaField({
      name: new fields.StringField(),
      category: new fields.StringField(),
      description: new fields.HTMLField(),
    }));

    schema.journal = new fields.TypedObjectField(new fields.SchemaField({
      name: new fields.StringField(),
      date: new fields.StringField(),
      content: new fields.HTMLField(),
    }));

    schema.contacts = new fields.TypedObjectField(new fields.SchemaField({
      name: new fields.StringField(),
      location: new fields.StringField(),
      description: new fields.HTMLField(),
    }));

    schema.resources = new fields.TypedObjectField(new fields.SchemaField({
      name: new fields.StringField(),
      value: new fields.NumberField({ integer: true, initial: 0 }),
      max: new fields.NumberField({ integer: true, initial: 0 }),
    }));

    return schema;
  }

  /* -------------------------------------------------- */

  /**
   * Characters carry the two meta attributes (LUCK + COR) on top of the six
   * shared by all actors. NPCs/siege do not use them.
   * @inheritdoc
   */
  static defineAttributes() {
    const attributes = super.defineAttributes();

    const attributeOptions = () => requiredInteger({ min: -3, max: 12, initial: 0 });

    return Object.assign(attributes, {
      luck: new fields.NumberField(attributeOptions()),
      cor: new fields.NumberField(attributeOptions()),
    });
  }

  /* -------------------------------------------------- */

  /**
   * A human readable list of this character's class levels.
   * @type {string}
   */
  get classes() {
    const labels = Object.entries(this.levels).map(([tag, level]) => {
      const className = game.i18n.localize(
        tag === "adventurer" ?
          "MYTHCRAFT.Actor.character.adventurer" :
          mythcraft.CONFIG.talents.tags[tag].label,
      );

      return `${className} ${level}`;
    }).sort();

    return game.i18n.getListFormatter({ type: "unit" }).format(labels);
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  prepareBaseData() {
    super.prepareBaseData();

    let totalClassLevels = 0;
    this.levels = this.parent.itemTypes.talent.reduce((record, item) => {
      for (const tag of item.system.tags) {
        if (mythcraft.CONFIG.talents.tags[tag]?.isClass) {
          record[tag] ??= 0;
          record[tag] += 1;
          totalClassLevels += 1;
          break;
        }
      }
      return record;
    }, {});

    const adventurerLevels = this.level - totalClassLevels;
    if (adventurerLevels) this.levels.adventurer = adventurerLevels;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();

    // HP auto-calculation
    this.hp.max = calculateHpMax(this.level, this.attributes.end, this.hpOverride);

    // AP per round from Corruption
    this.ap.max = calculateApMax(this.attributes.cor, this.ap.override);

    // Initiative
    const init = calculateInitiative(this.attributes.awr, this.initiative.bonus, this.initiative.override);
    this.initiative.total = init;

    // Critical ranges modified by luck
    const crit = calculateCriticalRanges(this.critical.hit, this.critical.fail, this.attributes.luck);
    this.critical.effectiveHit = crit.effectiveHit;
    this.critical.effectiveFail = crit.effectiveFail;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  modifyRollData(rollData) {
    super.modifyRollData(rollData);
    rollData.LUCK = this.attributes.luck;
    rollData.COR = this.attributes.cor;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _preCreate(data, options, user) {
    const allowed = await super._preCreate(data, options, user);
    if (allowed === false) return false;

    const updates = {
      prototypeToken: {
        actorLink: true,
        disposition: CONST.TOKEN_DISPOSITIONS.FRIENDLY,
        sight: {
          enabled: true,
        },
      },
    };
    this.parent.updateSource(updates);
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _preUpdate(changes, options, user) {
    const allowed = await super._preUpdate(changes, options, user);
    if (allowed === false) return false;

    // Setup advancement trigger
    const newLevel = foundry.utils.getProperty(changes, "system.level");
    if ((newLevel !== undefined) && (newLevel > this.level)) {
      options.mythcraft ??= {};
      // Need to not re-trigger current level
      options.mythcraft.levels = { start: this.level + 1, end: newLevel };
    }
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  _onUpdate(changed, options, userId) {
    super._onUpdate(changed, options, userId);

    if (options.mythcraft?.levels) {
      const { start, end } = options.mythcraft.levels;

      ChatMessage.implementation.create({
        content: game.i18n.format("MYTHCRAFT.Advancement.WARNING.LevelUp", { name: this.parent.name, start, end }),
      });
      for (const item of this.parent.items) {
        if ((item.type !== "profession") && (item.system instanceof AdvancementModel)) {
          item.system.applyAdvancements({ levels: { start, end } });
        }
      }
    }
  }

  /* -------------------------------------------------- */

  /**
   * Perform document operations for advancements.
   * @param {object} config
   * @param {AdvancementChain} config.chain
   * @param {ItemData[]} [config.toCreate={}]
   * @param {ItemData[]} [config.toUpdate={}]
   * @param {ActorData} [config.actorUpdate={}]
   * @param {Map<string>} [config._idMap]
   * @param {object} [options]                                      Operation options.
   * @param {{ start: number, end: number }} [options.levels]       Level information about these advancements.
   * @returns {[MythCraftItem[], MythCraftItem[], MythCraftActor]}
   * @internal          End consumers should use the AdvancementModel#applyAdvancements
   *                    or BaseAdvancement#reconfigure methods
   */
  async _finalizeAdvancements(
    { chain, toCreate = {}, toUpdate = {}, actorUpdate = {}, _idMap = new Map() },
    { levels } = {},
  ) {
    // First gather all new items that are to be created.
    for (const node of chain.activeNodes()) {
      if (node.advancement.type !== "itemGrant") continue;
      const parentItem = node.advancement.document;

      for (const uuid of node.chosenSelection ?? []) {
        const item = node.choices[uuid].item;
        const keepId = !this.parent.items.has(item.id) && !Array.from(_idMap.values()).includes(item.id);
        const itemData = game.items.fromCompendium(item, { keepId, clearFolder: true });
        if (!keepId) itemData._id = foundry.utils.randomID();
        toCreate[item.uuid] = itemData;
        _idMap.set(item.id, itemData._id);
        itemData._parentId = parentItem.id;
        itemData._advId = node.advancement.id;
      }
    }

    // Apply flags to store "parent" item's id and origin advancement.
    for (const uuid in toCreate) {
      const itemData = toCreate[uuid];
      const { _parentId, _advId } = itemData;
      delete itemData._parentId;
      delete itemData._advId;

      // Fall back to the _parentId, in the case of existing items being
      // updated to grant more items (eg a class leveling up).
      const parentId = _idMap.get(_parentId) ?? _parentId;
      foundry.utils.setProperty(itemData, `flags.${systemId}.advancement`, { parentId: parentId, advancementId: _advId });
    }

    // Perform item data modifications or store item updates.
    for (const node of chain.activeNodes()) {
      if (node.advancement.type !== "skill") continue;
      const { document: item, id } = node.advancement;
      const isExisting = item.parent === this.parent;
      let itemData;

      if (isExisting) {
        toUpdate[item.id] ??= { _id: item.id };
        itemData = toUpdate[item.id];
      } else {
        itemData = toCreate[item.uuid];
      }

      foundry.utils.setProperty(itemData, `flags.${systemId}.advancement.${id}.selected`, node.chosenSelection);
    }

    const operationOptions = {};
    if (levels) operationOptions.levels = levels;

    return await Promise.all([
      this.parent.createEmbeddedDocuments("Item", Object.values(toCreate), { keepId: true, mythcraft: operationOptions }),
      this.parent.updateEmbeddedDocuments("Item", Object.values(toUpdate), { mythcraft: operationOptions }),
      this.parent.update(actorUpdate, { mythcraft: operationOptions }),
    ]);
  }
}
