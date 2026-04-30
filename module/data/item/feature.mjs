import FormulaField from "../fields/formula-field.mjs";
import { requiredInteger } from "../fields/helpers.mjs";
import AdvancementModel from "./advancement.mjs";

/**
 * The system model for "feature" type items, which are used by ancestries and monsters.
 */
export default class FeatureModel extends AdvancementModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = super.LOCALIZATION_PREFIXES.concat("MYTHCRAFT.Item.feature");

  /** @inheritdoc */
  static defineSchema() {
    const schema = super.defineSchema();

    const fields = foundry.data.fields;

    schema.category = new fields.StringField({ initial: "passive", choices: {
      passive: "MYTHCRAFT.Item.feature.category.passive",
      action: "MYTHCRAFT.Item.feature.category.action",
      reaction: "MYTHCRAFT.Item.feature.category.reaction",
    } });

    schema.prerequisites = new fields.StringField({ required: true });

    schema.hasAttack = new fields.BooleanField({ initial: false });
    schema.attackBonus = new FormulaField({ initial: "0", deterministic: true });
    schema.defenseTarget = new fields.StringField({ initial: "ar" });

    schema.hasSave = new fields.BooleanField({ initial: false });
    schema.saveDC = new FormulaField({ initial: "10", deterministic: true });
    schema.saveAttribute = new fields.StringField({ initial: "end" });

    schema.damage = new fields.ArrayField(
      new fields.SchemaField({
        formula: new FormulaField(),
        type: new fields.StringField({ required: true, initial: "sharp" }),
      }),
    );

    schema.uses = new fields.SchemaField({
      spent: new fields.NumberField({ integer: true }),
      maxFormula: new FormulaField({ deterministic: true }),
      recharge: new fields.StringField({ blank: false }),
    });

    schema.tier = new fields.NumberField(requiredInteger({ min: 1, initial: 1 }));

    return schema;
  }

  /* -------------------------------------------------- */

  /**
   * Evaluated attack bonus value.
   * @type {number|null}
   */
  get evaluatedAttackBonus() {
    if (!this.hasAttack) return null;
    return mythcraft.utils.evaluateFormula(this.attackBonus || "0", this.parent.getRollData());
  }

  /* -------------------------------------------------- */

  /**
   * Evaluated save DC value.
   * @type {number|null}
   */
  get evaluatedSaveDC() {
    if (!this.hasSave) return null;
    return mythcraft.utils.evaluateFormula(this.saveDC || "0", this.parent.getRollData());
  }

  /* -------------------------------------------------- */

  /**
   * Whether this feature has any rollable data.
   * @type {boolean}
   */
  get isRollable() {
    return this.hasAttack || this.hasSave || (this.damage.length > 0);
  }

  /* -------------------------------------------------- */

  /**
   * The localized label for the category.
   * @type {string}
   */
  get categoryLabel() {
    return game.i18n.localize(this.schema.fields.category.choices[this.category]);
  }

  /* -------------------------------------------------- */

  /**
   * Display the tier information for this feature?
   * @type {boolean}
   */
  get showTier() {
    return (this.category === "action") && (this.parent.parent?.type === "npc");
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  prepareDerivedData() {
    this.uses.max = Roll.create(this.uses.maxFormula || "0", this.parent.getRollData()).evaluateSync().total;
    this.uses.value = this.uses.max - this.uses.spent;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _preUpdate(changes, options, user) {
    const allowed = await super._preUpdate(changes, options, user);
    if (allowed === false) return false;

    const hasValue = foundry.utils.hasProperty(changes, "system.uses.value");
    if (hasValue) {
      foundry.utils.setProperty(changes, "system.uses.spent", this.uses.max - changes.system.uses.value);
    }
  }
}
