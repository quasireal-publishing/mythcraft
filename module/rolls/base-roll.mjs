/**
 * Base roll class.
 */
export default class MythCraftRoll extends foundry.dice.Roll {
  /**
   * Set to true on subclasses that roll d20s and should have TA/TD and roll bonuses applied.
   * DamageRoll and other non-d20 rolls leave this false.
   * @type {boolean}
   */
  static APPLY_ROLL_MODES = false;

  /**
   * Transform a d20 formula by applying TA/TD/bonus modifiers from rollModes.
   * Used by both the constructor and the roll dialog preview display.
   * @param {string} formula     The base formula containing one or more d20 terms.
   * @param {object} [rollModes] {ta, td, bonus} numeric modifiers.
   * @returns {string}           The transformed formula.
   */
  static applyRollModes(formula, rollModes = {}) {
    const ta = rollModes.ta ?? 0;
    const td = rollModes.td ?? 0;
    const bonus = rollModes.bonus ?? 0;
    const net = ta - td;

    if (net !== 0) {
      const count = 1 + Math.abs(net);
      const keep = net > 0 ? "kh" : "kl";
      // Match the entire dice term (optional count + d20) so "1d20" → "2d20kh1".
      // Word boundaries prevent partial matches inside terms like "d200".
      formula = formula.replace(/\b\d*d20\b/g, `${count}d20${keep}1`);
    }

    if (bonus > 0) formula += ` + ${bonus}`;
    else if (bonus < 0) formula += ` - ${Math.abs(bonus)}`;

    return formula;
  }

  constructor(formula, data = {}, options = {}) {
    if (new.target.APPLY_ROLL_MODES) {
      formula = MythCraftRoll.applyRollModes(formula, data.rollModes);
    }
    super(formula, data, options);
  }
}
