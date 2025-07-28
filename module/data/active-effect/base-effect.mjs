import enrichHTML from "../../utils/enrich-html.mjs";

export default class BaseEffectModel extends foundry.abstract.TypeDataModel {
  /** @inheritdoc */
  static defineSchema() {
    return {};
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async toEmbed(config, options = {}) {

    const enriched = await enrichHTML(this.parent.description, { ...options, relativeTo: this.parent });

    const embed = document.createElement("div");
    embed.classList.add("mythcraft", this.parent.type);
    embed.innerHTML = enriched;

    return embed;
  }

}
