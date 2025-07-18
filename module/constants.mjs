export const systemId = "mythcraft";

/**
 * Translates repository paths to Foundry Data paths.
 * @param {string} path - A path relative to the root of this repository.
 * @returns {string} The path relative to the Foundry data folder.
 */
export const systemPath = (path) => `systems/${systemId}/${path}`;

export const equipmentCategories = {
  weapon: {
    label: "MYTHCRAFT.Item.Equipment.Categories.weapon",
  },
  armor: {
    label: "MYTHCRAFT.Item.Equipment.Categories.armor",
  },
};

export const weaponRanges = {
  melee: {
    label: "",
  },
  ranged: {
    label: "",
  },
  reach: {
    label: "",
  },
  thrown: {
    label: "",
  },
};
