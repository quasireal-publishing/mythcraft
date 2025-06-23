/** @import { StatusEffectConfig } from "@client/config.mjs" */

/**
 * Condition definitions provided by the system that are merged in during the `i18nInit` hook.
 * This hook is chosen to allow modules to merge into this structure without having to perform array operations on CONFIG.statusEffects.
 * The key is the `id` of the condition.
 * @type {Record<string, StatusEffectConfig>}
 */
export const conditions = {
  bleeding: {
    name: "MYTHCRAFT.Effect.Conditions.bleeding",
    img: "icons/svg/aura.svg",
  },
  bloodied: {
    name: "MYTHCRAFT.Effect.Conditions.bloodied",
    img: "icons/svg/aura.svg",
    hud: false,
  },
  burning: {
    name: "MYTHCRAFT.Effect.Conditions.burning",
    img: "icons/svg/aura.svg",
  },
  broken: {
    name: "MYTHCRAFT.Effect.Conditions.broken",
    img: "icons/svg/aura.svg",
    related: ["frightened", "shaken"],
  },
  charmed: {
    name: "MYTHCRAFT.Effect.Conditions.charmed",
    img: "icons/svg/aura.svg",
  },
  chilled: {
    name: "MYTHCRAFT.Effect.Conditions.chilled",
    img: "icons/svg/aura.svg",
  },
  concealed: {
    name: "MYTHCRAFT.Effect.Conditions.concealed",
    img: "icons/svg/aura.svg",
  },
  partialCover: {
    name: "MYTHCRAFT.Effect.Conditions.partialCover",
    img: "icons/svg/aura.svg",
  },
  totalCover: {
    name: "MYTHCRAFT.Effect.Conditions.totalCover",
    img: "icons/svg/aura.svg",
  },
  dazed: {
    name: "MYTHCRAFT.Effect.Conditions.dazed",
    img: "icons/svg/aura.svg",
  },
  deafened: {
    name: "MYTHCRAFT.Effect.Conditions.deafened",
    img: "icons/svg/aura.svg",
  },
  demoralized: {
    name: "MYTHCRAFT.Effect.Conditions.demoralized",
    img: "icons/svg/aura.svg",
  },
  engaged: {
    name: "MYTHCRAFT.Effect.Conditions.engaged",
    img: "icons/svg/aura.svg",
  },
  enthralled: {
    name: "MYTHCRAFT.Effect.Conditions.enthralled",
    img: "icons/svg/aura.svg",
    related: ["charmed"],
  },
  fatigued: {
    name: "MYTHCRAFT.Effect.Conditions.fatigued",
    img: "icons/svg/aura.svg",
  },
  frightened: {
    name: "MYTHCRAFT.Effect.Conditions.frightened",
    img: "icons/svg/aura.svg",
  },
  grappled: {
    name: "MYTHCRAFT.Effect.Conditions.grappled",
    img: "icons/svg/aura.svg",
  },
  grounded: {
    name: "MYTHCRAFT.Effect.Conditions.grounded",
    img: "icons/svg/aura.svg",
  },
  helpless: {
    name: "MYTHCRAFT.Effect.Conditions.helpless",
    img: "icons/svg/aura.svg",
  },
  paralyzed: {
    name: "MYTHCRAFT.Effect.Conditions.paralyzed",
    img: "icons/svg/aura.svg",
    related: ["helpless"],
  },
  petrified: {
    name: "MYTHCRAFT.Effect.Conditions.petrified",
    img: "icons/svg/aura.svg",
    related: ["paralyzed", "helpless"],
  },
  pinned: {
    name: "MYTHCRAFT.Effect.Conditions.pinned",
    img: "icons/svg/aura.svg",
    related: ["prone", "grappled"],
  },
  prone: {
    name: "MYTHCRAFT.Effect.Conditions.prone",
    img: "icons/svg/aura.svg",
  },
  protected: {
    name: "MYTHCRAFT.Effect.Conditions.protected",
    img: "icons/svg/aura.svg",
  },
  rallied: {
    name: "MYTHCRAFT.Effect.Conditions.rallied",
    img: "icons/svg/aura.svg",
  },
  restrained: {
    name: "MYTHCRAFT.Effect.Conditions.restrained",
    img: "icons/svg/aura.svg",
    related: ["grappled"],
  },
  shaken: {
    name: "MYTHCRAFT.Effect.Conditions.shaken",
    img: "icons/svg/aura.svg",
  },
  sickened: {
    name: "MYTHCRAFT.Effect.Conditions.sickened",
    img: "icons/svg/aura.svg",
  },
  silenced: {
    name: "MYTHCRAFT.Effect.Conditions.silenced",
    img: "icons/svg/aura.svg",
  },
  slowed: {
    name: "MYTHCRAFT.Effect.Conditions.slowed",
    img: "icons/svg/aura.svg",
  },
  staggered: {
    name: "MYTHCRAFT.Effect.Conditions.staggered",
    img: "icons/svg/aura.svg",
  },
  stunned: {
    name: "MYTHCRAFT.Effect.Conditions.stunned",
    img: "icons/svg/aura.svg",
  },
  suffocating: {
    name: "MYTHCRAFT.Effect.Conditions.suffocating",
    img: "icons/svg/aura.svg",
  },
  suppressed: {
    name: "MYTHCRAFT.Effect.Conditions.suppressed",
    img: "icons/svg/aura.svg",
  },
  completeSurprise: {
    name: "MYTHCRAFT.Effect.Conditions.completeSurprise",
    img: "icons/svg/aura.svg",
  },
  partialSurprise: {
    name: "MYTHCRAFT.Effect.Conditions.partialSurprise",
    img: "icons/svg/aura.svg",
  },
  unconscious: {
    name: "MYTHCRAFT.Effect.Conditions.unconscious",
    img: "icons/svg/aura.svg",
  },
  unseen: {
    name: "MYTHCRAFT.Effect.Conditions.unseen",
    img: "icons/svg/aura.svg",
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

export const damageTypes = {};
