import { systemId } from "../../../constants.mjs";
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

  /**
   * Necessary for advancement chain.
   * @type {number}
   */
  get chooseN() {
    return this.points;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();

    const actor = this.document.parent;
    if (!actor) return;

    const selections = this.document.getFlag(systemId, `advancement.${this.id}.selected`);

    if (typeof selections !== "object") return void console.error("Incorrect selected structure in", this.uuid, selections);

    for (const [skill, points] of Object.entries(selections)) {
      if (!points) continue;
      const skillInfo = actor.system.skills[skill];

      if (skillInfo?.advancement) skillInfo.advancement += points;
      else if (skillInfo) skillInfo.advancement = points;
      else foundry.utils.setProperty(actor.system.skills, `${skill}.advancement`, points);
    }
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async configureAdvancement(node = null) {

    const path = `flags.mythcraft.advancement.${this.id}.selected`;

    const { createFormGroup, createNumberInput } = foundry.applications.fields;

    const content = document.createElement("div");

    const hint = document.createElement("p");

    hint.className = "hint";

    hint.innerText = game.i18n.format("MYTHCRAFT.Advancement.ConfigureAdvancement.SkillHint", { points: this.points });

    content.append(hint);

    const skills = [...this.primary.skills, ...this.secondary.skills].sort();

    /** Helper Function to repeatedly create form-group divs. */
    function createGroup() {
      const group = document.createElement("div");
      group.className = "form-group";
      return group;
    }

    const currentValues = (node ? node.selected : foundry.utils.getProperty(this.document, path)) ?? {};

    let group = createGroup();

    // loop up the primary & secondary together then iterate to add form groups
    for (const skill of skills) {
      const input = createFormGroup({
        classes: ["inline", "slim"],
        label: mythcraft.CONFIG.skills.list[skill].label,
        input: createNumberInput({
          min: 0,
          max: this.primary.skills.has(skill) ? this.primary.max : this.secondary.max,
          value: currentValues[skill] ?? 0,
          name: skill,
        }),
        localize: true,
      });
      group.append(input);
      if (group.children.length === 2) {
        content.append(group);
        group = createGroup();
      }

    }

    /**
     * Handles disabling the submit button.
     * @type {DialogV2RenderCallback}
     */
    function render(event, dialog) {
      const submitButton = dialog.element.querySelector("button[type=\"submit\"");

      /** Helper function. */
      const checkDisabled = () => {
        const fd = new foundry.applications.ux.FormDataExtended(submitButton.form).object;
        const spend = Object.values(fd).reduce((acc, b) => acc + b, 0);
        submitButton.disabled = spend !== this.points;
      };

      dialog.element.addEventListener("change", () => {
        const fd = new foundry.applications.ux.FormDataExtended(submitButton.form).object;
        const spend = Object.values(fd).reduce((acc, b) => acc + b, 0);
        submitButton.disabled = spend !== this.points;
      });

      checkDisabled();
    }

    const config = await mythcraft.applications.api.MythcraftDialog.input({
      content,
      render: render.bind(this),
      window: {
        title: "Skill",
      },
    });

    if (!config) return null;

    const chosen = Object.entries(config).reduce((acc, [key, value]) => {
      if (value) acc[key] = value;
      return acc;
    }, {});

    if (node) node.selected = { ...chosen };

    return { [path]: chosen };
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async reconfigure() {
    await super.reconfigure();

    const configuration = await this.configureAdvancement();
    if (configuration) await this.document.update(configuration);
  }
}
