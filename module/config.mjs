/** @import { StatusEffectConfig } from "@client/config.mjs" */

/**
 * Condition definitions provided by the system that are merged in during the `i18nInit` hook.
 * This hook is chosen to allow modules to merge into this structure without having to perform array operations on CONFIG.statusEffects.
 * The key is the `id` of the condition.
 * @type {Record<string, StatusEffectConfig>}
 */
export const conditions = {
  bloodied: {
    name: "MYTHCRAFT.Effect.Conditions.bloodied",
    hud: false,
  },
  broken: {
    name: "MYTHCRAFT.Effect.Conditions.broken",
    related: ["frightened", "shaken"],
  },
  charmed: {
    name: "MYTHCRAFT.Effect.Conditions.charmed",
  },
  chilled: {
    name: "MYTHCRAFT.Effect.Conditions.chilled",
  },
  concealed: {
    name: "MYTHCRAFT.Effect.Conditions.concealed",
  },
  partialCover: {
    name: "MYTHCRAFT.Effect.Conditions.partialCover",
  },
  totalCover: {
    name: "MYTHCRAFT.Effect.Conditions.totalCover",
  },
  dazed: {
    name: "MYTHCRAFT.Effect.Conditions.dazed",
  },
  deafened: {
    name: "MYTHCRAFT.Effect.Conditions.deafened",
  },
  demoralized: {
    name: "MYTHCRAFT.Effect.Conditions.demoralized",
  },
  engaged: {
    name: "MYTHCRAFT.Effect.Conditions.engaged",
  },
  enthralled: {
    name: "MYTHCRAFT.Effect.Conditions.enthralled",
    related: ["charmed"],
  },
  fatigued: {
    name: "MYTHCRAFT.Effect.Conditions.fatigued",
  },
  frightened: {
    name: "MYTHCRAFT.Effect.Conditions.frightened",
  },
  grappled: {
    name: "MYTHCRAFT.Effect.Conditions.grappled",
  },
  grounded: {
    name: "MYTHCRAFT.Effect.Conditions.grounded",
  },
  helpless: {
    name: "MYTHCRAFT.Effect.Conditions.helpless",
  },
  paralyzed: {
    name: "MYTHCRAFT.Effect.Conditions.paralyzed",
    related: ["helpless"],
  },
  petrified: {
    name: "MYTHCRAFT.Effect.Conditions.petrified",
    related: ["paralyzed", "helpless"],
  },
  pinned: {
    name: "MYTHCRAFT.Effect.Conditions.pinned",
    related: ["prone", "grappled"],
  },
  prone: {
    name: "MYTHCRAFT.Effect.Conditions.prone",
  },
  protected: {
    name: "MYTHCRAFT.Effect.Conditions.protected",
  },
  rallied: {
    name: "MYTHCRAFT.Effect.Conditions.rallied",
  },
  restrained: {
    name: "MYTHCRAFT.Effect.Conditions.restrained",
    related: ["grappled"],
  },
  shaken: {
    name: "MYTHCRAFT.Effect.Conditions.shaken",
  },
  sickened: {
    name: "MYTHCRAFT.Effect.Conditions.sickened",
  },
  silenced: {
    name: "MYTHCRAFT.Effect.Conditions.silenced",
  },
  slowed: {
    name: "MYTHCRAFT.Effect.Conditions.slowed",
  },
  staggered: {
    name: "MYTHCRAFT.Effect.Conditions.staggered",
  },
  stunned: {
    name: "MYTHCRAFT.Effect.Conditions.stunned",
  },
  suffocating: {
    name: "MYTHCRAFT.Effect.Conditions.suffocating",
  },
  suppressed: {
    name: "MYTHCRAFT.Effect.Conditions.suppressed",
  },
  completeSurprise: {
    name: "MYTHCRAFT.Effect.Conditions.completeSurprise",
  },
  partialSurprise: {
    name: "MYTHCRAFT.Effect.Conditions.partialSurprise",
  },
  unconscious: {
    name: "MYTHCRAFT.Effect.Conditions.unconscious",
  },
  unseen: {

    name: "MYTHCRAFT.Effect.Conditions.unseen",
  },
};

/**
 * @typedef ItemTag
 * @property {string} label           The i18n string for the Tag
 */

/**
 * A simple example of a configurable list of item properties
 * Modules can adjust this
 * @type {Record<string, ItemTag>}
 */
export const tags = {
  supernatural: {
    label: "MYTHCRAFT.Item.Properties.supernatural",
  },
  metal: {
    label: "MYTHCRAFT.Item.Properties.metal",
  },
  epic: {
    label: "MYTHCRAFT.Item.Properties.epic",
  },
};

/**
 * @typedef Skill
 * @property {string} label       The i18n string for the Tag
 * @property {string} tag         The skill tag
 * @property {string} reference   The uuid reference to the journal page for the skill
 */

export const skills = {};

/**
 * Representation of the AP modification based on a character's coordination
 * @type {Record<string, number>} A record of numerical strings & numbers
 */
export const bonusAP = {
  "-3": -2,
  "-2": -1,
  "-1": -1,
  0: 0,
};

export const sizes = {};

export const vision = {};
