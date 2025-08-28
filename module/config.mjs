import { pseudoDocuments } from "./data/_module.mjs";

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
 * @typedef Attribute
 * @property {string} group       What group is this attribute in?
 * @property {boolean} check      Does this attribute make checks?
 * @property {string} [defense]   A defense associated with this attribute.
 */

/**
 * Additional, non-label info about attributes in MythCraft.
 * @type {Record<string, Attribute>}
 */
const attributeList = {
  str: {
    group: "physical",
    check: true,
  },
  dex: {
    group: "physical",
    check: true,
    defense: "ref",
  },
  end: {
    group: "physical",
    check: true,
    defense: "fort",
  },
  awr: {
    group: "mental",
    check: true,
    defense: "ant",
  },
  int: {
    group: "mental",
    check: true,
    defense: "log",
  },
  cha: {
    group: "mental",
    check: true,
    defense: "will",
  },
  luck: {
    group: "meta",
    check: true,
  },
  cor: {
    group: "meta",
    check: false,
  },
};

/**
 * Information about attribute groups.
 * @type {Record<string, { label: string }>}
 */
const attributeGroups = {
  physical: {
    label: "MYTHCRAFT.Actor.base.attributeGroups.physical",
  },
  mental: {
    label: "MYTHCRAFT.Actor.base.attributeGroups.mental",
  },
  meta: {
    label: "MYTHCRAFT.Actor.base.attributeGroups.meta",
  },
};

/**
 * Info about Attributes in MythCraft.
 */
export const attributes = {
  list: attributeList,
  groups: attributeGroups,
};

/**
 * @typedef Defense
 * @property {string} group
 */

/**
 * Additional, non-label info about attributes in MythCraft.
 * @type {Record<string, Defense>}
 */
const defenseList = {
  ar: {
    group: "defense",
  },
  ref: {
    group: "physical",
  },
  fort: {
    group: "physical",
  },
  ant: {
    group: "mental",
  },
  log: {
    group: "mental",
  },
  will: {
    group: "mental",
  },
};

/**
 * Information about defense groups.
 * @type {Record<string, { label: string}>}
 */
const defenseGroups = {
  defense: {
    label: "MYTHCRAFT.Actor.base.defenseGroups.defense",
  },
  physical: {
    label: "MYTHCRAFT.Actor.base.defenseGroups.physical",
  },
  mental: {
    label: "MYTHCRAFT.Actor.base.defenseGroups.mental",
  },
};

/**
 * Info about Defenses in MythCraft.
 */
export const defenses = {
  list: defenseList,
  groups: defenseGroups,
};

/**
 * @typedef ItemTag
 * @property {string} label         The i18n string for the Tag.
 * @property {string} reference     The uuid reference to the journal page for the tag.
 */

/**
 * A list of item tags in MythCraft.
 * @type {Record<string, ItemTag>}
 */
export const tags = {
  repeatable: {
    label: "MYTHCRAFT.Tags.repeatable",
  },
  entry: {
    label: "MYTHCRAFT.Tags.entry",
  },
  capstone: {
    label: "MYTHCRAFT.Tags.capstone",
  },
};

/**
 * @typedef OccupationTag
 * @property {string} label The i18n string for the occupation tag.
 */

/**
 * An object of occupation tags.
 * @type {Record<string, OccupationTag>}
 */
const occupationTags = {
  academic: {
    label: "MYTHCRAFT.Tags.Occupation.academic",
  },
  aristocratic: {
    label: "MYTHCRAFT.Tags.Occupation.aristocratic",
  },
  mercantile: {
    label: "MYTHCRAFT.Tags.Occupation.mercantile",
  },
  religious: {
    label: "MYTHCRAFT.Tags.Occupation.religious",
  },
  militant: {
    label: "MYTHCRAFT.Tags.Occupation.militant",
  },
  underworld: {
    label: "MYTHCRAFT.Tags.Occupation.underworld",
  },
  wanderer: {
    label: "MYTHCRAFT.Tags.Occupation.wanderer",
  },
};

export const occupation = {
  tags: occupationTags,
};

/** @typedef {"str" | "dex" | "end" | "awr" | "int" | "cha" | "luck" | "cor"} AttributeKey */

/**
 * @typedef Skill
 * @property {string} label             The i18n string for the skill.
 * @property {AttributeKey} attribute   The attribute tied to the skill.
 * @property {string} tag               The skill tag.
 * @property {boolean} [tool]           Is the skill tool dependent.
 * @property {string} reference         The uuid reference to the journal page for the skill.
 */

/**
 * An object of skills.
 * @type {Record<string, Skill>}
 */
const skillList = {
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
 * @typedef SkillTag
 * @property {string} label   The i18n string for the skill tag.
 */

/**
 * An object of skill tags.
 * @type {Record<string, SkillTag>}
 */
const skillTags = {
  acrobatics: {
    label: "MYTHCRAFT.Skills.Tags.acrobatics",
  },
  athleticism: {
    label: "MYTHCRAFT.Skills.Tags.athleticism",
  },
  crafting: {
    label: "MYTHCRAFT.Skills.Tags.crafting",
  },
  influence: {
    label: "MYTHCRAFT.Skills.Tags.influence",
  },
  knowledge: {
    label: "MYTHCRAFT.Skills.Tags.knowledge",
  },
  luck: {
    label: "MYTHCRAFT.Skills.Tags.luck",
  },
  observation: {
    label: "MYTHCRAFT.Skills.Tags.observation",
  },
  stamina: {
    label: "MYTHCRAFT.Skills.Tags.stamina",
  },
  subterfuge: {
    label: "MYTHCRAFT.Skills.Tags.subterfuge",
  },
  survival: {
    label: "MYTHCRAFT.Skills.Tags.survival",
  },
};

/**
 * Info about skills in MythCraft.
 */
export const skills = {
  list: skillList,
  tags: skillTags,
};

/**
 * Representation of the AP modification based on a character's coordination.
 * @type {Record<string, number>} A record of numerical strings & numbers
 */
export const bonusAP = {
  "-3": -2,
  "-2": -1,
  "-1": -1,
  0: 0,
};

/**
 * @typedef Rest
 * @property {string} label   The i18n string for the rest.
 * @property {number} time    Time in seconds for the rest.
 */

export const rests = {
  breath: {
    label: "MYTHCRAFT.Rests.breath",
    time: 5 * 60, // five minutes
  },
  recoup: {
    label: "MYTHCRAFT.Rests.recoup",
    time: 60 * 60, // one hour
  },
  rest: {
    label: "MYTHCRAFT.Rests.rest",
    time: 8 * 60 * 60, // 8 hours
  },
};

/**
 * @typedef MythCraftSize
 * @property {string} label     Name for the size.
 * @property {number} strMod    Attribute check adjustment.
 * @property {number} dexMod    Attribute check adjustment.
 * @property {number} width     Width in spaces (short distance for Long).
 * @property {number} length    Length in spaces (long distance for Long).
 */

/**
 * Info about Sizes in MythCraft.
 * @type {Record<string, MythCraftSize>}
 */
export const sizes = {
  fine: {
    label: "MYTHCRAFT.Sizes.fine",
    strMod: -16,
    dexMod: 16,
    width: 1,
    length: 1,
  },
  diminutive: {
    label: "MYTHCRAFT.Sizes.diminutive",
    strMod: -8,
    dexMod: 8,
    width: 1,
    length: 1,
  },
  tiny: {
    label: "MYTHCRAFT.Sizes.tiny",
    strMod: -4,
    dexMod: 4,
    width: 1,
    length: 1,
  },
  small: {
    label: "MYTHCRAFT.Sizes.small",
    strMod: 0,
    dexMod: 0,
    width: 1,
    length: 1,
  },
  medium: {
    label: "MYTHCRAFT.Sizes.medium",
    strMod: 0,
    dexMod: 0,
    width: 1,
    length: 1,
  },
  large: {
    label: "MYTHCRAFT.Sizes.large",
    strMod: 0,
    dexMod: 0,
    width: 2,
    length: 2,
  },
  largeLong: {
    label: "MYTHCRAFT.Sizes.largeLong",
    strMod: 0,
    dexMod: 0,
    width: 1,
    length: 2,
  },
  largeTall: {
    label: "MYTHCRAFT.Sizes.largeTall",
    strMod: 0,
    dexMod: 0,
    width: 1,
    length: 1,
  },
  huge: {
    label: "MYTHCRAFT.Sizes.huge",
    strMod: 2,
    dexMod: -2,
    width: 3,
    length: 3,
  },
  hugeLong: {
    label: "MYTHCRAFT.Sizes.hugeLong",
    strMod: 2,
    dexMod: -2,
    width: 1,
    length: 3,
  },
  hugeTall: {
    label: "MYTHCRAFT.Sizes.hugeTall",
    strMod: 2,
    dexMod: -2,
    width: 2,
    length: 2,
  },
  gargantuan: {
    label: "MYTHCRAFT.Sizes.gargantuan",
    strMod: 4,
    dexMod: -4,
    width: 4,
    length: 4,
  },
  gargantuanLong: {
    label: "MYTHCRAFT.Sizes.gargantuanLong",
    strMod: 4,
    dexMod: -4,
    width: 2,
    length: 4,
  },
  gargantuanTall: {
    label: "MYTHCRAFT.Sizes.gargantuanTall",
    strMod: 4,
    dexMod: -4,
    width: 3,
    length: 3,
  },
  colossal: {
    label: "MYTHCRAFT.Sizes.colossal",
    strMod: 8,
    dexMod: -8,
    width: 6,
    length: 6,
  },
  colossalLong: {
    label: "MYTHCRAFT.Sizes.colossalLong",
    strMod: 8,
    dexMod: -8,
    width: 2,
    length: 6,
  },
  colossalTall: {
    label: "MYTHCRAFT.Sizes.colossalTall",
    strMod: 8,
    dexMod: -8,
    width: 4,
    length: 4,
  },
  titan: {
    label: "MYTHCRAFT.Sizes.titan",
    strMod: 16,
    dexMod: -16,
    width: 8,
    length: 8,
  },
};

/**
 * @typedef MythCraftSense
 * @property {string} label   The i18n string for the sense.
 */

/**
 * Info about senses in MythCraft.
 * @type {Record<string, MythCraftSense>}
 */
export const senses = {
  blindsight: {
    label: "MYTHCRAFT.Senses.blindsight",
  },
  lowlight: {
    label: "MYTHCRAFT.Senses.lowlight",
  },
  darkvision: {
    label: "MYTHCRAFT.Senses.darkvision",
  },
  magicDarkvision: {
    label: "MYTHCRAFT.Senses.magicDarkvision",
  },
  tremorsense: {
    label: "MYTHCRAFT.Senses.tremorsense",
  },
  truesight: {
    label: "MYTHCRAFT.Senses.truesight",
  },
};

/**
 * @typedef DamageType
 * @property {string} label               The i18n string for the damage type.
 * @property {string} category            The category of damage.
 * @property {foundry.utils.Color} color  A Color instance.
 */

/**
 * An object of damage types in MythCraft.
 * @type {Record<string, DamageType>}
 */
const damageTypes = {
  blunt: {
    label: "MYTHCRAFT.DamageTypes.blunt",
    category: "physical",
  },
  sharp: {
    label: "MYTHCRAFT.DamageTypes.sharp",
    category: "physical",
  },
  cold: {
    label: "MYTHCRAFT.DamageTypes.cold",
    category: "elemental",
    color: foundry.utils.Color.fromString("#14ffd0"),
  },
  corrosive: {
    label: "MYTHCRAFT.DamageTypes.corrosive",
    category: "elemental",
    color: foundry.utils.Color.fromString("#14ff14"),
  },
  fire: {
    label: "MYTHCRAFT.DamageTypes.fire",
    category: "elemental",
    color: foundry.utils.Color.fromString("#ff870f"),
  },
  lightning: {
    label: "MYTHCRAFT.DamageTypes.lightning",
    category: "elemental",
    color: foundry.utils.Color.fromString("#ffff00"),
  },
  toxic: {
    label: "MYTHCRAFT.DamageTypes.toxic",
    category: "elemental",
    color: foundry.utils.Color.fromString("#008500"),
  },
  necrotic: {
    label: "MYTHCRAFT.DamageTypes.necrotic",
    category: "energy",
    color: foundry.utils.Color.fromString("#7b00a8"),
  },
  psychic: {
    label: "MYTHCRAFT.DamageTypes.psychic",
    category: "energy",
    color: foundry.utils.Color.fromString("#d40cc3"),
  },
  radiant: {
    label: "MYTHCRAFT.DamageTypes.radiant",
    category: "energy",
    color: foundry.utils.Color.fromString("#ffed61"),
  },
  sonic: {
    label: "MYTHCRAFT.DamageTypes.sonic",
    category: "energy",
    color: foundry.utils.Color.fromString("#999999"),
  },
};

/**
 * @typedef DamageCategory
 * @property {string} label The i18n string for the damage category.
 */

/**
 * An object of damage type categories in MythCraft.
 * @type {Record<string, DamageCategory>}
 */
const damageCategories = {
  physical: {
    label: "MYTHCRAFT.DamageTypes.physical",
  },
  elemental: {
    label: "MYTHCRAFT.DamageTypes.elemental",
  },
  energy: {
    label: "MYTHCRAFT.DamageTypes.energy",
  },
};

/**
 * Info about damage types in MythCraft.
 */
export const damage = {
  types: damageTypes,
  categories: damageCategories,
};

const healTypes = {
  value: {
    label: "MYTHCRAFT.HealTypes.value",
  },
  shield: {
    label: "MYTHCRAFT.HealTypes.shield",
  },
};

export const healing = {
  types: healTypes,
};

/**
 * @typedef MonsterTag
 * @property {string} label               The i18n string for the monster tag.
 * @property {string} group               The tag grouping.
 */

/**
 * @type {Record<string, MonsterTag>}
 */
const monsterTags = {
  beast: {
    label: "MYTHCRAFT.Actor.npc.MonsterTags.beast",
    group: "mundane",
  },
  humanoid: {
    label: "MYTHCRAFT.Actor.npc.MonsterTags.humanoid",
    group: "mundane",
  },
  monstrosity: {
    label: "MYTHCRAFT.Actor.npc.MonsterTags.monstrosity",
    group: "mundane",
  },
  plant: {
    label: "MYTHCRAFT.Actor.npc.MonsterTags.plant",
    group: "mundane",
  },
  avadri: {
    label: "MYTHCRAFT.Actor.npc.MonsterTags.avadri",
    group: "planar",
  },
  celestial: {
    label: "MYTHCRAFT.Actor.npc.MonsterTags.celestial",
    group: "planar",
  },
  eldritch: {
    label: "MYTHCRAFT.Actor.npc.MonsterTags.eldritch",
    group: "planar",
  },
  elemental: {
    label: "MYTHCRAFT.Actor.npc.MonsterTags.elemental",
    group: "planar",
  },
  fae: {
    label: "MYTHCRAFT.Actor.npc.MonsterTags.fae",
    group: "planar",
  },
  fiend: {
    label: "MYTHCRAFT.Actor.npc.MonsterTags.fiend",
    group: "planar",
  },
  arcane: {
    label: "MYTHCRAFT.Actor.npc.MonsterTags.arcane",
    group: "magic",
  },
  divine: {
    label: "MYTHCRAFT.Actor.npc.MonsterTags.divine",
    group: "magic",
  },
  occult: {
    label: "MYTHCRAFT.Actor.npc.MonsterTags.occult",
    group: "magic",
  },
  primal: {
    label: "MYTHCRAFT.Actor.npc.MonsterTags.primal",
    group: "magic",
  },
  psionic: {
    label: "MYTHCRAFT.Actor.npc.MonsterTags.psionic",
    group: "magic",
  },
  abominable: {
    label: "MYTHCRAFT.Actor.npc.MonsterTags.abominable",
    group: "modifying",
  },
  constructed: {
    label: "MYTHCRAFT.Actor.npc.MonsterTags.constructed",
    group: "modifying",
  },
  giant: {
    label: "MYTHCRAFT.Actor.npc.MonsterTags.giant",
    group: "modifying",
  },
  shapechanger: {
    label: "MYTHCRAFT.Actor.npc.MonsterTags.shapechanger",
    group: "modifying",
  },
  swarm: {
    label: "MYTHCRAFT.Actor.npc.MonsterTags.swarm",
    group: "modifying",
  },
  undead: {
    label: "MYTHCRAFT.Actor.npc.MonsterTags.undead",
    group: "modifying",
  },
};

/**
 * @typedef MonsterGrouping
 * @property {string} label               The i18n string for the monster grouping.
 */

/**
 * @type {Record<string, MonsterGrouping}
 */
const monsterGroupings = {
  mundane: {
    label: "MYTHCRAFT.Actor.npc.MonsterGroupings.mundane",
  },
  planar: {
    label: "MYTHCRAFT.Actor.npc.MonsterGroupings.planar",
  },
  magic: {
    label: "MYTHCRAFT.Actor.npc.MonsterGroupings.magic",
  },
  modifying: {
    label: "MYTHCRAFT.Actor.npc.MonsterGroupings.modifying",
  },
};

/**
 * @typedef MonsterTrait
 * @property {string} label         The i18n string for the trait.
 * @property {boolean} [variable]   Does this take a numerical value.
 * @property {string} reference     The uuid for the trait.
 */

/**
 *
 * @type {Record<string, MonsterTrait>}
 */
const monsterTraits = {
  ethereal: {
    label: "MYTHCRAFT.MonsterTraits.ethereal",
    reference: "",
  },
  immovable: {
    label: "MYTHCRAFT.MonsterTraits.immovable",
    reference: "",
  },
  immutable: {
    label: "MYTHCRAFT.MonsterTraits.immutable",
    reference: "",
  },
  invisible: {
    label: "MYTHCRAFT.MonsterTraits.invisible",
    reference: "",
  },
  ironWill: {
    label: "MYTHCRAFT.MonsterTraits.ironWill",
    reference: "",
  },
  mythic: {
    label: "MYTHCRAFT.MonsterTraits.mythic",
    reference: "",
  },
  regen: {
    label: "MYTHCRAFT.MonsterTraits.regen",
    variable: true,
    reference: "",
  },
  steelMind: {
    label: "MYTHCRAFT.MonsterTraits.steelMind",
    reference: "",
  },
  unerringMind: {
    label: "MYTHCRAFT.MonsterTraits.unerringMind",
    reference: "",
  },
  vigilant: {
    label: "MYTHCRAFT.MonsterTraits.vigilant",
    reference: "",
  },
};

export const monster = {
  tags: monsterTags,
  tagGroups: monsterGroupings,
  traits: monsterTraits,
  get tagOptions() {
    return Object.entries(monsterTags).map(([value, { label, group }]) => ({
      value, label, group: monsterGroupings[group].label,
    }));
  },
};

/**
 * @typedef SpellComponent
 * @property {string} label
 */

/**
 * @type {Record<string, SpellComponent>}
 */
const spellComponents = {
  gesture: {
    label: "MYTHCRAFT.Item.spell.components.gesture",
  },
  verbal: {
    label: "MYTHCRAFT.Item.spell.components.verbal",
  },
  visual: {
    label: "MYTHCRAFT.Item.spell.components.visual",
  },
};

/**
 * @typedef SpellRequirement
 * @property {string} label
 */

/**
 * @type {Record<string, SpellRequirement>}
 */
const spellRequirements = {
  loe: {
    label: "MYTHCRAFT.Item.spell.requirements.loe",
  },
  los: {
    label: "MYTHCRAFT.Item.spell.requirements.los",
  },
};

export const spells = {
  components: spellComponents,
  requirements: spellRequirements,
};

/**
 * @typedef AdvancementType
 * @property {string} label                                                 Human-readable label.
 * @property {string} defaultImage                                          Default image used by documents of this type.
 * @property {Set<string>} itemTypes                                        Item types that can hold this advancement type.
 * @property {pseudoDocuments.advancements.BaseAdvancement} documentClass   The pseudo-document class.
 */

/** @type {Record<string, AdvancementType>} */
export const Advancement = {
  itemGrant: {
    label: "TYPES.Advancement.itemGrant",
    defaultImage: "icons/svg/item-bag.svg",
    itemTypes: new Set(["feature"]),
    documentClass: pseudoDocuments.advancements.ItemGrantAdvancement,
  },
};
