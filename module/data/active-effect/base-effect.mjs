import enrichHTML from "../../utils/enrich-html.mjs";

/**
 * The system data model for ActiveEffect documents.
 *
 * Extends {@link foundry.data.ActiveEffectTypeDataModel} (v14+) which supplies
 * the required `changes` ArrayField schema. Foundry's `verifyActiveEffectModels`
 * startup check expects this field to be present; without it the check patches
 * the schema via `extendFields()`, which corrupts the internal schema proxy and
 * crashes the ActiveEffectConfig editor.
 */
export default class BaseEffectModel extends foundry.data.ActiveEffectTypeDataModel {

  /** @inheritdoc */
  async toEmbed(config, options = {}) {
    const enriched = await enrichHTML(this.parent.description, { ...options, relativeTo: this.parent });

    const embed = document.createElement("div");
    embed.classList.add("mythcraft", this.parent.type);
    embed.innerHTML = enriched;

    return embed;
  }

}
