import { systemPath } from "../../constants.mjs";
import enrichHTML from "../../utils/enrich-html.mjs";
import AdvancementModel from "./advancement.mjs";

/**
 * The system model for "talent" items.
 */
export default class TalentModel extends AdvancementModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = super.LOCALIZATION_PREFIXES.concat("MYTHCRAFT.Item.talent");

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static defineSchema() {
    const schema = super.defineSchema();

    const fields = foundry.data.fields;

    schema.prerequisites = new fields.StringField({ required: true });

    schema.incompatibilities = new fields.StringField({ required: true });

    schema.category = new fields.StringField({ required: true });

    return schema;
  }

  /* -------------------------------------------------- */

  /**
   * The localized label for the action.
   * @type {string}
   */
  get actionLabel() {
    return game.i18n.localize(mythcraft.CONFIG.talents.actions[this.category]?.label ?? "");
  }

  /* -------------------------------------------------- */

  /**
   * The full list of tags as a human-readable string.
   * @type {string}
   */
  get tagList() {
    const tags = this.tags.reduce((tagList, tag) => {
      const tagInfo = mythcraft.CONFIG.talents.tags[tag];
      if (tagInfo) tagList.push(game.i18n.localize(tagInfo.label));
      return tagList;
    }, []);

    return game.i18n.getListFormatter({ type: "unit" }).format(tags);
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async toEmbed(config, options = {}) {
    const enriched = await enrichHTML(this.description.value, { ...options, relativeTo: this.parent });

    const embed = document.createElement("div");
    embed.classList.add("mythcraft", this.parent.type);

    const content = await foundry.applications.handlebars.renderTemplate(systemPath("templates/item/embeds/talent.hbs"), {
      config,
      enriched,
      system: this,
      systemFields: this.schema.fields,
    });

    embed.insertAdjacentHTML("afterbegin", content);

    return embed;
  }
}
