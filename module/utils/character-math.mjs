/**
 * Determine hit die size from Endurance attribute.
 * @param {number} end - Endurance value (-3 to 12).
 * @returns {number} Hit die size (4, 6, 8, 10, or 12).
 */
export function getHitDie(end) {
  if (end <= 2) return 4;
  if (end <= 5) return 6;
  if (end <= 8) return 8;
  if (end <= 11) return 10;
  return 12;
}

/**
 * Calculate maximum HP.
 * @param {number} level - Character level.
 * @param {number} end - Endurance attribute value.
 * @param {number|null} override - Manual override (null = use formula).
 * @returns {number}
 */
export function calculateHpMax(level, end, override = null) {
  if (override !== null) return override;
  return 10 + (level * getHitDie(end)) + level;
}

/**
 * Calculate max action points per round.
 * @param {number} cor - Coordination attribute value.
 * @param {number|null} override - Manual override (null = use formula).
 * @returns {number}
 */
export function calculateApMax(cor, override = null) {
  if (override !== null) return override;
  if (cor <= -3) return 1;
  if (cor <= -1) return 2;
  return 3 + Math.floor(cor / 2);
}

/**
 * Calculate initiative total.
 * @param {number} awr - Awareness attribute value.
 * @param {number} bonus - Initiative bonus.
 * @param {number|null} override - Manual override (null = use formula).
 * @returns {number}
 */
export function calculateInitiative(awr, bonus, override = null) {
  if (override !== null) return override;
  return awr + bonus;
}

/**
 * Calculate effective critical ranges.
 * @param {number} hit - Base critical hit threshold.
 * @param {number} fail - Base critical fail threshold.
 * @param {number} luck - Luck attribute value.
 * @returns {{effectiveHit: number, effectiveFail: number}}
 */
export function calculateCriticalRanges(hit, fail, luck) {
  return {
    effectiveHit: hit - Math.max(0, luck),
    effectiveFail: fail,
  };
}
