import { setOptions } from "../../fields/helpers.mjs";
import BaseAdvancement from "./base-advancement.mjs";

/**
 * @import {DialogV2RenderCallback} from "@client/applications/api/dialog.mjs";
 */

/**
 * An advancement representing skill ranks.
 */
export default class SkillAdvancement extends BaseAdvancement {
  /** @inheritdoc  */
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    schema.points = new fields.NumberField({ min: 0, integer: true });

    schema.primary = new fields.SchemaField({
      skills: new fields.SetField(setOptions()),
      max: new fields.NumberField({ initial: 6, min: 1, integer: true }),
    });

    schema.secondary = new fields.SchemaField({
      skills: new fields.SetField(setOptions()),
      max: new fields.NumberField({ initial: 3, integer: true, min: 0 }),
    });

    return schema;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static get TYPE() {
    return "skill";
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = super.LOCALIZATION_PREFIXES.concat("MYTHCRAFT.Advancement.SKILL");

  /* -------------------------------------------------- */

  /** @inheritdoc */
  get isChoice() {
    return true;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async configureAdvancement(node = null) {

    const path = `flags.mythcraft.advancement.${this.id}.selected`;

    const { createFormGroup, createNumberInput } = foundry.applications.fields;

    const content = document.createElement("div");

    const fields = document.createElement("div");

    fields.className = "scrollable";

    content.append(fields);

    const skills = [...this.primary.skills, ...this.secondary.skills].sort();

    // loop up the primary & secondary together then iterate to add form groups
    for (const skill of skills) {
      const group = createFormGroup({
        classes: ["slim"],
        label: mythcraft.CONFIG.skills.list[skill].label,
        input: createNumberInput({ min: 0, max: this.primary.max, value: 0, name: skill }),
        localize: true,
      });
      fields.append(group);
    }

    /**
     * Handles disabling the submit button.
     * @type {DialogV2RenderCallback}
     */
    function render(event, dialog) {
      console.log(dialog.element);
    }

    const config = await mythcraft.applications.api.MythcraftDialog.input({
      content,
      render,
      window: {
        title: "Skill",
      },
    });

    if (!config) return null;

    return { [path]: null };
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async reconfigure() {
    await super.reconfigure();

    const configuration = await this.configureAdvancement();
    if (configuration) await this.document.update(configuration);
  }
}
