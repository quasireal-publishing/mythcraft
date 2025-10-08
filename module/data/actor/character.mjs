import { requiredInteger } from "../fields/helpers.mjs";
import AdvancementModel from "../item/advancement.mjs";
import BaseActorModel from "./base-actor.mjs";
import { systemId } from "../../constants.mjs";

/**
 * @import {MythCraftActor, MythCraftItem} from "../../documents/_module.mjs";
 * @import AdvancementChain from "../../utils/advancement-chain.mjs";
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
    });

    return schema;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static defineAttributes() {
    const attributes = super.defineAttributes();

    const attributeOptions = () => requiredInteger({ min: -3, max: 12, initial: 0 });

    return Object.assign(attributes, {
      luck: new fields.NumberField(attributeOptions()),
      cor: new fields.NumberField(attributeOptions()),
    });
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
      options.mythcraft.levels = { start: this.level, end: newLevel };
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
   * @param {AdvancementChain[]} config.chains
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
    { chains, toCreate = {}, toUpdate = {}, actorUpdate = {}, _idMap = new Map() },
    { levels } = {},
  ) {
    // First gather all new items that are to be created.
    for (const chain of chains) for (const node of chain.active()) {
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
    for (const chain of chains) for (const node of chain.active()) {
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
