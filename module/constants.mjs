export const systemId = "mythcraft";

/**
 * Translates repository paths to Foundry Data paths.
 * @param {string} path - A path relative to the root of this repository.
 * @returns {string} The path relative to the Foundry data folder.
 */
export const systemPath = (path) => `systems/${systemId}/${path}`;

export const weaponRanges = {
  melee: {
    label: "MYTHCRAFT.Item.weapon.Ranges.melee",
  },
  ranged: {
    label: "MYTHCRAFT.Item.weapon.Ranges.ranged",
  },
  reach: {
    label: "MYTHCRAFT.Item.weapon.Ranges.reach",
  },
  thrown: {
    label: "MYTHCRAFT.Item.weapon.Ranges.thrown",
  },
};
