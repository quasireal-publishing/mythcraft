/** @import { StatusEffectConfig } from "@client/config.mjs" */

/**
 * Condition definitions provided by the system that are merged in during the `i18nInit` hook.
 * This hook is chosen to allow modules to merge into this structure without having to perform array operations on CONFIG.statusEffects.
 * The key is the `id` of the condition.
 * @type {Record<string, StatusEffectConfig>}
 */
export const conditions = {};

/**
 * @typedef ItemProperty
 * @property {string} label           The i18n string for the
 * @property {Set<string>} itemTypes  Item types that can have this property
 */

/**
 * A simple example of a configurable list of item properties
 * Modules can adjust this
 * @type {Record<string, ItemProperty>}
 */
export const tags = {
  supernatural: {
    label: "MYTHCRAFT.Item.Properties.supernatural",
    itemTypes: new Set(["equipment", "feature"]),
  },
  metal: {
    label: "MYTHCRAFT.Item.Properties.metal",
    itemTypes: new Set(["equipment"]),
  },
  epic: {
    label: "MYTHCRAFT.Item.Properties.epic",
    itemTypes: new Set(["feature"]),
  },
};
