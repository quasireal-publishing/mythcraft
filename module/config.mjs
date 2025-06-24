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

/** @typedef {"str" | "dex" | "end" | "awr" | "int" | "cha" | "luck" | "cor"} Attribute */

/**
 * @typedef Skill
 * @property {string} label         The i18n string for the Tag
 * @property {Attribute} attribute  The attribute tied to the skill
 * @property {string} tag           The skill tag
 * @property {boolean} [tool]       Is the skill tool dependent
 * @property {string} reference     The uuid reference to the journal page for the skill
 */

/**
 * Info about skills in MythCraft
 * @type {Record<string, Skill>}
 */
export const skills = {
  appliedForce: {
    label: "MYTHCRAFT.Skills.appliedForce",
    attribute: "str",
    tag: "",
    reference: "",
  },
  athletics: {
    label: "MYTHCRAFT.Skills.athletics",
    attribute: "str",
    tag: "",
    reference: "",
  },
  menacing: {
    label: "MYTHCRAFT.Skills.menacing",
    attribute: "str",
    tag: "",
    reference: "",
  },
  sprinting: {
    label: "MYTHCRAFT.Skills.sprinting",
    attribute: "str",
    tag: "",
    reference: "",
  },
  balancing: {
    label: "MYTHCRAFT.Skills.balancing",
    attribute: "dex",
    tag: "",
    reference: "",
  },
  contorting: {
    label: "MYTHCRAFT.Skills.contorting",
    attribute: "dex",
    tag: "",
    reference: "",
  },
  dancing: {
    label: "MYTHCRAFT.Skills.dancing",
    attribute: "dex",
    tag: "",
    reference: "",
  },
  sneaking: {
    label: "MYTHCRAFT.Skills.sneaking",
    attribute: "dex",
    tag: "",
    reference: "",
  },
  tumbling: {
    label: "MYTHCRAFT.Skills.tumbling",
    attribute: "dex",
    tag: "",
    reference: "",
  },
  distanceRunning: {
    label: "MYTHCRAFT.Skills.distanceRunning",
    attribute: "end",
    tag: "",
    reference: "",
  },
  forcedMarch: {
    label: "MYTHCRAFT.Skills.forcedMarch",
    attribute: "end",
    tag: "",
    reference: "",
  },
  animalHandling: {
    label: "MYTHCRAFT.Skills.animalHandling",
    attribute: "awr",
    tag: "",
    reference: "",
  },
  eavesdropping: {
    label: "MYTHCRAFT.Skills.eavesdropping",
    attribute: "awr",
    tag: "",
    reference: "",
  },
  foraging: {
    label: "MYTHCRAFT.Skills.foraging",
    attribute: "awr",
    tag: "",
    reference: "",
  },
  intuiting: {
    label: "MYTHCRAFT.Skills.intuiting",
    attribute: "awr",
    tag: "",
    reference: "",
  },
  investigating: {
    label: "MYTHCRAFT.Skills.investigating",
    attribute: "awr",
    tag: "",
    reference: "",
  },
  navigating: {
    label: "MYTHCRAFT.Skills.navigating",
    attribute: "awr",
    tag: "",
    tool: true,
    reference: "",
  },
  perceiving: {
    label: "MYTHCRAFT.Skills.perceiving",
    attribute: "awr",
    tag: "",
    reference: "",
  },
  sheltering: {
    label: "MYTHCRAFT.Skills.sheltering",
    attribute: "awr",
    tag: "",
    reference: "",
  },
  tracking: {
    label: "MYTHCRAFT.Skills.tracking",
    attribute: "awr",
    tag: "",
    reference: "",
  },
  alchemy: {
    label: "MYTHCRAFT.Skills.alchemy",
    attribute: "int",
    tag: "",
    tool: true,
    reference: "",
  },
  appraising: {
    label: "MYTHCRAFT.Skills.appraising",
    attribute: "int",
    tag: "",
    reference: "",
  },
  arcana: {
    label: "MYTHCRAFT.Skills.arcana",
    attribute: "int",
    tag: "",
    reference: "",
  },
  art: {
    label: "MYTHCRAFT.Skills.art",
    attribute: "int",
    tag: "",
    reference: "",
  },
  astrology: {
    label: "MYTHCRAFT.Skills.astrology",
    attribute: "int",
    tag: "",
    reference: "",
  },
  astronomy: {
    label: "MYTHCRAFT.Skills.astronomy",
    attribute: "int",
    tag: "",
    reference: "",
  },
  biology: {
    label: "MYTHCRAFT.Skills.biology",
    attribute: "int",
    tag: "",
    reference: "",
  },
  brewing: {
    label: "MYTHCRAFT.Skills.brewing",
    attribute: "int",
    tag: "",
    tool: true,
    reference: "",
  },
  calligraphy: {
    label: "MYTHCRAFT.Skills.calligraphy",
    attribute: "int",
    tag: "",
    tool: true,
    reference: "",
  },
  carpentry: {
    label: "MYTHCRAFT.Skills.carpentry",
    attribute: "int",
    tag: "",
    tool: true,
    reference: "",
  },
  cartography: {
    label: "MYTHCRAFT.Skills.cartography",
    attribute: "int",
    tag: "",
    tool: true,
    reference: "",
  },
  chemistry: {
    label: "MYTHCRAFT.Skills.chemistry",
    attribute: "int",
    tag: "",
    reference: "",
  },
  cobbling: {
    label: "MYTHCRAFT.Skills.cobbling",
    attribute: "int",
    tag: "",
    tool: true,
    reference: "",
  },
  cooking: {
    label: "MYTHCRAFT.Skills.cooking",
    attribute: "int",
    tag: "",
    tool: true,
    reference: "",
  },
  disguising: {
    label: "MYTHCRAFT.Skills.disguising",
    attribute: "int",
    tag: "",
    tool: true,
    reference: "",
  },
  dungeoneering: {
    label: "MYTHCRAFT.Skills.dungeoneering",
    attribute: "int",
    tag: "",
    reference: "",
  },
  economics: {
    label: "MYTHCRAFT.Skills.economics",
    attribute: "int",
    tag: "",
    reference: "",
  },
  engineering: {
    label: "MYTHCRAFT.Skills.engineering",
    attribute: "int",
    tag: "",
    reference: "",
  },
  evading: {
    label: "MYTHCRAFT.Skills.evading",
    attribute: "int",
    tag: "",
    reference: "",
  },
  forging: {
    label: "MYTHCRAFT.Skills.forging",
    attribute: "int",
    tag: "",
    tool: true,
    reference: "",
  },
  geography: {
    label: "MYTHCRAFT.Skills.geography",
    attribute: "int",
    tag: "",
    reference: "",
  },
  glassblowing: {
    label: "MYTHCRAFT.Skills.glassblowing",
    attribute: "int",
    tag: "",
    tool: true,
    reference: "",
  },
  history: {
    label: "MYTHCRAFT.Skills.history",
    attribute: "int",
    tag: "",
    reference: "",
  },
  jeweling: {
    label: "MYTHCRAFT.Skills.jeweling",
    attribute: "int",
    tag: "",
    tool: true,
    reference: "",
  },
  law: {
    label: "MYTHCRAFT.Skills.law",
    attribute: "int",
    tag: "",
    reference: "",
  },
  leatherworking: {
    label: "MYTHCRAFT.Skills.leatherworking",
    attribute: "int",
    tag: "",
    tool: true,
    reference: "",
  },
  lockpicking: {
    label: "MYTHCRAFT.Skills.lockpicking",
    attribute: "int",
    tag: "",
    tool: true,
    reference: "",
  },
  masonry: {
    label: "MYTHCRAFT.Skills.masonry",
    attribute: "int",
    tag: "",
    tool: true,
    reference: "",
  },
  medicine: {
    label: "MYTHCRAFT.Skills.medicine",
    attribute: "int",
    tag: "",
    tool: true,
    reference: "",
  },
  military: {
    label: "MYTHCRAFT.Skills.military",
    attribute: "int",
    tag: "",
    reference: "",
  },
  nature: {
    label: "MYTHCRAFT.Skills.nature",
    attribute: "int",
    tag: "",
    reference: "",
  },
  painting: {
    label: "MYTHCRAFT.Skills.painting",
    attribute: "int",
    tag: "",
    tool: true,
    reference: "",
  },
  // "politics of [choose region]": {
  //   label: "MYTHCRAFT.Skills",
  //   attribute: "int",
  //   tag: "",
  //   reference: "",
  // },
  pottery: {
    label: "MYTHCRAFT.Skills.pottery",
    attribute: "int",
    tag: "",
    tool: true,
    reference: "",
  },
  // "religion [choose one]": {
  //   label: "MYTHCRAFT.Skills",
  //   attribute: "int",
  //   tag: "",
  //   reference: "",
  // },
  sleightOfHand: {
    label: "MYTHCRAFT.Skills.sleightOfHand",
    attribute: "int",
    tag: "",
    reference: "",
  },
  smithing: {
    label: "MYTHCRAFT.Skills.smithing",
    attribute: "int",
    tag: "",
    tool: true,
    reference: "",
  },
  weaving: {
    label: "MYTHCRAFT.Skills.weaving",
    attribute: "int",
    tag: "",
    tool: true,
    reference: "",
  },
  woodcarving: {
    label: "MYTHCRAFT.Skills.woodcarving",
    attribute: "int",
    tag: "",
    tool: true,
    reference: "",
  },
  vehiclesLand: {
    label: "MYTHCRAFT.Skills.vehiclesLand",
    attribute: "int",
    tag: "",
    reference: "",
  },
  vehiclesWater: {
    label: "MYTHCRAFT.Skills.vehiclesWater",
    attribute: "int",
    tag: "",
    reference: "",
  },
  deceiving: {
    label: "MYTHCRAFT.Skills.deceiving",
    attribute: "cha",
    tag: "",
    reference: "",
  },
  empathy: {
    label: "MYTHCRAFT.Skills.empathy",
    attribute: "cha",
    tag: "",
    reference: "",
  },
  entertaining: {
    label: "MYTHCRAFT.Skills.entertaining",
    attribute: "cha",
    tag: "",
    reference: "",
  },
  gossiping: {
    label: "MYTHCRAFT.Skills.gossiping",
    attribute: "cha",
    tag: "",
    reference: "",
  },
  // "instrument [choose one]": {
  //   label: "MYTHCRAFT.Skills",
  //   attribute: "cha",
  //   tag: "",
  //   tool: true,
  //   reference: "",
  // },
  intimidating: {
    label: "MYTHCRAFT.Skills.intimidating",
    attribute: "cha",
    tag: "",
    reference: "",
  },
  leadership: {
    label: "MYTHCRAFT.Skills.leadership",
    attribute: "cha",
    tag: "",
    reference: "",
  },
  persuading: {
    label: "MYTHCRAFT.Skills.persuading",
    attribute: "cha",
    tag: "",
    reference: "",
  },
  savoirFaire: {
    label: "MYTHCRAFT.Skills.savoirFaire",
    attribute: "cha",
    tag: "",
    reference: "",
  },
  fortuity: {
    label: "MYTHCRAFT.Skills.fortuity",
    attribute: "luck",
    tag: "",
    reference: "",
  },
  scavenging: {
    label: "MYTHCRAFT.Skills.scavenging",
    attribute: "luck",
    tag: "",
    reference: "",
  },
};

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

const rests = {
  breath: {},
  recoup: {},
  rest: {},
};

export const sizes = {};

export const vision = {
  lowlight: {
    label: "",
  },
  darkvision: {
    label: "",
  },
  magicDarkvision: {
    label: "",
  },
  truesight: {
    label: "",
  },
};

export const damageTypes = {};
