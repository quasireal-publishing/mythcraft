import BaseItemModel from "./base-item.mjs";

/**
 * The system model for "profession" items.
 */
export default class ProfessionModel extends BaseItemModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = super.LOCALIZATION_PREFIXES.concat("MYTHCRAFT.Item.profession");

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static defineSchema() {
    const schema = super.defineSchema();

    const fields = foundry.data.fields;

    schema.rank = new fields.NumberField({ integer: true, min: 1, max: 5, initial: 1 });

    return schema;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _preUpdate(changes, options, user) {
    const allowed = await super._preUpdate(changes, options, user);
    if (allowed === false) return false;

    // Setup advancement trigger
    const newRank = foundry.utils.getProperty(changes, "system.rank");
    if (this.actor && (newRank !== undefined) && (newRank > this.rank)) {
      options.mythcraft ??= {};
      options.mythcraft.ranks = { start: this.rank, end: newRank };
    }
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  _onUpdate(changed, options, userId) {
    super._onUpdate(changed, options, userId);

    if (options.mythcraft?.ranks) {
      const { start, end } = options.mythcraft.ranks;

      ChatMessage.implementation.create({
        content: game.i18n.format("MYTHCRAFT.Advancement.WARNING.RankUp", { actorName: this.actor.name, itemName: this.parent.name, start, end }),
      });
      this.applyAdvancements({ levels: { start, end } });
    }
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async applyAdvancements({
    levels = {},
    ...options } = {},
  ) {

    // professions don't scale with overall character level but their rank
    levels.end = this.rank;

    return super.applyAdvancements({ levels, ...options });
  }
}
