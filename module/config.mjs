import { pseudoDocuments } from "./data/_module.mjs";

/**
 * @import { StatusEffectConfig } from "@client/config.mjs";
 * @import { FormSelectOption } from "@client/applications/forms/fields.mjs";
 */

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
  /** @type {FormSelectOption[]} */
  get options() {
    return Object.entries(attributeList).map(
      ([value, { group }]) => ({ value, label: `MYTHCRAFT.Actor.base.FIELDS.attributes.${value}.label`, group: game.i18n.localize(attributeGroups[group]?.label) }),
    );
  },
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
 * @property {string} [specialized]     If present, the skill allows specialization and the string is the i18n format string.
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
    tag: "athleticism",
    reference: "",
  },
  athletics: {
    label: "MYTHCRAFT.Skills.athletics",
    attribute: "str",
    tag: "athleticism",
    reference: "",
  },
  menacing: {
    label: "MYTHCRAFT.Skills.menacing",
    attribute: "str",
    tag: "stamina",
    reference: "",
  },
  sprinting: {
    label: "MYTHCRAFT.Skills.sprinting",
    attribute: "str",
    tag: "athleticism",
    reference: "",
  },
  balancing: {
    label: "MYTHCRAFT.Skills.balancing",
    attribute: "dex",
    tag: "acrobatics",
    reference: "",
  },
  contorting: {
    label: "MYTHCRAFT.Skills.contorting",
    attribute: "dex",
    tag: "acrobatics",
    reference: "",
  },
  dancing: {
    label: "MYTHCRAFT.Skills.dancing",
    attribute: "dex",
    tag: "acrobatics",
    reference: "",
  },
  sneaking: {
    label: "MYTHCRAFT.Skills.sneaking",
    attribute: "dex",
    tag: "survival",
    reference: "",
  },
  tumbling: {
    label: "MYTHCRAFT.Skills.tumbling",
    attribute: "dex",
    tag: "acrobatics",
    reference: "",
  },
  distanceRunning: {
    label: "MYTHCRAFT.Skills.distanceRunning",
    attribute: "end",
    tag: "stamina",
    reference: "",
  },
  forcedMarch: {
    label: "MYTHCRAFT.Skills.forcedMarch",
    attribute: "end",
    tag: "stamina",
    reference: "",
  },
  animalHandling: {
    label: "MYTHCRAFT.Skills.animalHandling",
    attribute: "awr",
    tag: "survival",
    reference: "",
  },
  eavesdropping: {
    label: "MYTHCRAFT.Skills.eavesdropping",
    attribute: "awr",
    tag: "observation",
    reference: "",
  },
  foraging: {
    label: "MYTHCRAFT.Skills.foraging",
    attribute: "awr",
    tag: "survival",
    reference: "",
  },
  intuiting: {
    label: "MYTHCRAFT.Skills.intuiting",
    attribute: "awr",
    tag: "observation",
    reference: "",
  },
  investigating: {
    label: "MYTHCRAFT.Skills.investigating",
    attribute: "awr",
    tag: "observation",
    reference: "",
  },
  navigating: {
    label: "MYTHCRAFT.Skills.navigating",
    attribute: "awr",
    tag: "survival",
    tool: true,
    reference: "",
  },
  perceiving: {
    label: "MYTHCRAFT.Skills.perceiving",
    attribute: "awr",
    tag: "observation",
    reference: "",
  },
  sheltering: {
    label: "MYTHCRAFT.Skills.sheltering",
    attribute: "awr",
    tag: "survival",
    reference: "",
  },
  tracking: {
    label: "MYTHCRAFT.Skills.tracking",
    attribute: "awr",
    tag: "survival",
    reference: "",
  },
  alchemy: {
    label: "MYTHCRAFT.Skills.alchemy",
    attribute: "int",
    tag: "crafting",
    tool: true,
    reference: "",
  },
  appraising: {
    label: "MYTHCRAFT.Skills.appraising",
    attribute: "int",
    tag: "observation",
    reference: "",
  },
  arcana: {
    label: "MYTHCRAFT.Skills.arcana",
    attribute: "int",
    tag: "knowledge",
    reference: "",
  },
  art: {
    label: "MYTHCRAFT.Skills.art",
    attribute: "int",
    tag: "knowledge",
    reference: "",
  },
  astrology: {
    label: "MYTHCRAFT.Skills.astrology",
    attribute: "int",
    tag: "knowledge",
    reference: "",
  },
  astronomy: {
    label: "MYTHCRAFT.Skills.astronomy",
    attribute: "int",
    tag: "knowledge",
    reference: "",
  },
  biology: {
    label: "MYTHCRAFT.Skills.biology",
    attribute: "int",
    tag: "knowledge",
    reference: "",
  },
  brewing: {
    label: "MYTHCRAFT.Skills.brewing",
    attribute: "int",
    tag: "crafting",
    tool: true,
    reference: "",
  },
  calligraphy: {
    label: "MYTHCRAFT.Skills.calligraphy",
    attribute: "int",
    tag: "crafting",
    tool: true,
    reference: "",
  },
  carpentry: {
    label: "MYTHCRAFT.Skills.carpentry",
    attribute: "int",
    tag: "crafting",
    tool: true,
    reference: "",
  },
  cartography: {
    label: "MYTHCRAFT.Skills.cartography",
    attribute: "int",
    tag: "crafting",
    tool: true,
    reference: "",
  },
  chemistry: {
    label: "MYTHCRAFT.Skills.chemistry",
    attribute: "int",
    tag: "knowledge",
    reference: "",
  },
  cobbling: {
    label: "MYTHCRAFT.Skills.cobbling",
    attribute: "int",
    tag: "crafting",
    tool: true,
    reference: "",
  },
  cooking: {
    label: "MYTHCRAFT.Skills.cooking",
    attribute: "int",
    tag: "crafting",
    tool: true,
    reference: "",
  },
  disguising: {
    label: "MYTHCRAFT.Skills.disguising",
    attribute: "int",
    tag: "subterfuge",
    tool: true,
    reference: "",
  },
  dungeoneering: {
    label: "MYTHCRAFT.Skills.dungeoneering",
    attribute: "int",
    tag: "survival",
    reference: "",
  },
  economics: {
    label: "MYTHCRAFT.Skills.economics",
    attribute: "int",
    tag: "knowledge",
    reference: "",
  },
  engineering: {
    label: "MYTHCRAFT.Skills.engineering",
    attribute: "int",
    tag: "knowledge",
    reference: "",
  },
  evading: {
    label: "MYTHCRAFT.Skills.evading",
    attribute: "int",
    tag: "subterfuge",
    reference: "",
  },
  forging: {
    label: "MYTHCRAFT.Skills.forging",
    attribute: "int",
    tag: "subterfuge",
    tool: true,
    reference: "",
  },
  geography: {
    label: "MYTHCRAFT.Skills.geography",
    attribute: "int",
    tag: "knowledge",
    reference: "",
  },
  glassblowing: {
    label: "MYTHCRAFT.Skills.glassblowing",
    attribute: "int",
    tag: "crafting",
    tool: true,
    reference: "",
  },
  history: {
    label: "MYTHCRAFT.Skills.history",
    attribute: "int",
    tag: "knowledge",
    reference: "",
  },
  jeweling: {
    label: "MYTHCRAFT.Skills.jeweling",
    attribute: "int",
    tag: "crafting",
    tool: true,
    reference: "",
  },
  law: {
    label: "MYTHCRAFT.Skills.law",
    attribute: "int",
    tag: "knowledge",
    reference: "",
  },
  leatherworking: {
    label: "MYTHCRAFT.Skills.leatherworking",
    attribute: "int",
    tag: "crafting",
    tool: true,
    reference: "",
  },
  lockpicking: {
    label: "MYTHCRAFT.Skills.lockpicking",
    attribute: "int",
    tag: "subterfuge",
    tool: true,
    reference: "",
  },
  masonry: {
    label: "MYTHCRAFT.Skills.masonry",
    attribute: "int",
    tag: "crafting",
    tool: true,
    reference: "",
  },
  medicine: {
    label: "MYTHCRAFT.Skills.medicine",
    attribute: "int",
    tag: "knowledge",
    tool: true,
    reference: "",
  },
  military: {
    label: "MYTHCRAFT.Skills.military",
    attribute: "int",
    tag: "knowledge",
    reference: "",
  },
  nature: {
    label: "MYTHCRAFT.Skills.nature",
    attribute: "int",
    tag: "survival",
    reference: "",
  },
  painting: {
    label: "MYTHCRAFT.Skills.painting",
    attribute: "int",
    tag: "crafting",
    tool: true,
    reference: "",
  },
  politics: {
    label: "MYTHCRAFT.Skills.politics",
    attribute: "int",
    tag: "knowledge",
    specialized: "MYTHCRAFT.Skills.politicsSpecialization",
    reference: "",
  },
  pottery: {
    label: "MYTHCRAFT.Skills.pottery",
    attribute: "int",
    tag: "crafting",
    tool: true,
    reference: "",
  },
  religion: {
    label: "MYTHCRAFT.Skills.religion",
    attribute: "int",
    tag: "knowledge",
    specialized: "MYTHCRAFT.Skills.religionSpecialization",
    reference: "",
  },
  sleightOfHand: {
    label: "MYTHCRAFT.Skills.sleightOfHand",
    attribute: "int",
    tag: "subterfuge",
    reference: "",
  },
  smithing: {
    label: "MYTHCRAFT.Skills.smithing",
    attribute: "int",
    tag: "crafting",
    tool: true,
    reference: "",
  },
  weaving: {
    label: "MYTHCRAFT.Skills.weaving",
    attribute: "int",
    tag: "crafting",
    tool: true,
    reference: "",
  },
  woodcarving: {
    label: "MYTHCRAFT.Skills.woodcarving",
    attribute: "int",
    tag: "crafting",
    tool: true,
    reference: "",
  },
  vehiclesLand: {
    label: "MYTHCRAFT.Skills.vehiclesLand",
    attribute: "int",
    tag: "knowledge",
    reference: "",
  },
  vehiclesWater: {
    label: "MYTHCRAFT.Skills.vehiclesWater",
    attribute: "int",
    tag: "knowledge",
    reference: "",
  },
  deceiving: {
    label: "MYTHCRAFT.Skills.deceiving",
    attribute: "cha",
    tag: "influence",
    reference: "",
  },
  empathy: {
    label: "MYTHCRAFT.Skills.empathy",
    attribute: "cha",
    tag: "influence",
    reference: "",
  },
  entertaining: {
    label: "MYTHCRAFT.Skills.entertaining",
    attribute: "cha",
    tag: "performance",
    reference: "",
  },
  gossiping: {
    label: "MYTHCRAFT.Skills.gossiping",
    attribute: "cha",
    tag: "influence",
    reference: "",
  },
  instrument: {
    label: "MYTHCRAFT.Skills.instrument",
    attribute: "cha",
    tag: "performance",
    tool: true,
    specialized: "MYTHCRAFT.Skills.instrumentSpecialization",
    reference: "",
  },
  intimidating: {
    label: "MYTHCRAFT.Skills.intimidating",
    attribute: "cha",
    tag: "influence",
    reference: "",
  },
  leadership: {
    label: "MYTHCRAFT.Skills.leadership",
    attribute: "cha",
    tag: "influence",
    reference: "",
  },
  persuading: {
    label: "MYTHCRAFT.Skills.persuading",
    attribute: "cha",
    tag: "influence",
    reference: "",
  },
  savoirFaire: {
    label: "MYTHCRAFT.Skills.savoirFaire",
    attribute: "cha",
    tag: "performance",
    reference: "",
  },
  fortuity: {
    label: "MYTHCRAFT.Skills.fortuity",
    attribute: "luck",
    tag: "luck",
    reference: "",
  },
  scavenging: {
    label: "MYTHCRAFT.Skills.scavenging",
    attribute: "luck",
    tag: "luck",
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
  performance: {
    label: "MYTHCRAFT.Skills.Tags.performance",
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
  /** @type {FormSelectOption[]} */
  get options() {
    return Object.entries(skillList).map(([value, { label, tag }]) => ({
      label,
      value,
      group: game.i18n.localize(skillTags[tag]?.label),
    }));
  },
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
  /** @type {FormSelectOption[]} */
  get options() {
    return Object.entries(damageTypes).map(
      ([value, { label, category }]) => ({ value, label, group: game.i18n.localize(damageCategories[category]?.label) }),
    );
  },
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
  /** @type {FormSelectOption} */
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

/**
 * @typedef SpellSource
 * @property {string} label
 */

/**
 * @type {Record<string, SpellSource>}
 */
const spellSources = {
  arcane: {
    label: "MYTHCRAFT.Item.spell.source.arcane",
  },
  divine: {
    label: "MYTHCRAFT.Item.spell.source.divine",
  },
  occult: {
    label: "MYTHCRAFT.Item.spell.source.occult",
  },
  primal: {
    label: "MYTHCRAFT.Item.spell.source.primal",
  },
  psionic: {
    label: "MYTHCRAFT.Item.spell.source.psionic",
  },
};

/**
 * @typedef SpellTag
 * @property {string} label         An i18n label for the tag.
 * @property {string} group         An i18n label for the group this tag is in.
 * @property {string} [display]     An i18n label that takes the source {type} as a format string.
 * @property {Set<string>} [sources]  Sources the tag is valid for. If the property is missing, it is valid for all sources.
 */

/**
 * @type {Record<string, SpellTag>}
 */
const spellTags = {
  cantrip: {
    label: "MYTHCRAFT.Item.spell.tags.cantrip",
    sources: new Set(["arcane"]),
  },
  prayer: {
    label: "MYTHCRAFT.Item.spell.tags.prayer",
    sources: new Set(["divine"]),
  },
  chant: {
    label: "MYTHCRAFT.Item.spell.tags.chant",
    sources: new Set(["occult", "primal"]),
    display: "MYTHCRAFT.Item.spell.tags.chantLong",
  },
  invocation: {
    label: "MYTHCRAFT.Item.spell.tags.invocation",
    sources: new Set(["psionic"]),
  },
  ritual: {
    label: "MYTHCRAFT.Item.spell.tags.ritual",
    display: "MYTHCRAFT.Item.spell.tags.ritualLong",
    sources: new Set(["arcane", "divine"]),
  },
  metamagic: {
    label: "MYTHCRAFT.Item.spell.tags.metamagic",
    sources: new Set(["arcane"]),
  },
  fundamental: {
    label: "MYTHCRAFT.Item.spell.tags.fundamental",
    sources: new Set(["arcane"]),
  },
  sacrament: {
    label: "MYTHCRAFT.Item.spell.tags.sacrament",
    sources: new Set(["divine"]),
  },
  curse: {
    label: "MYTHCRAFT.Item.spell.tags.curse",
    sources: new Set(["occult"]),
  },
  charm: {
    label: "MYTHCRAFT.Item.spell.tags.charm",
    sources: new Set(["occult"]),
  },
  incantation: {
    label: "MYTHCRAFT.Item.spell.tags.incantation",
    sources: new Set(["occult"]),
  },
  ritualize: {
    label: "MYTHCRAFT.Item.spell.tags.ritualize",
    sources: new Set(["occult"]),
  },
  darkPower: {
    label: "MYTHCRAFT.Item.spell.tags.darkPower",
    sources: new Set(["occult"]),
  },
  emotion: {
    label: "MYTHCRAFT.Item.spell.tags.emotion",
    sources: new Set(["primal"]),
  },
  nature: {
    label: "MYTHCRAFT.Item.spell.tags.nature",
    sources: new Set(["primal"]),
  },
  weather: {
    label: "MYTHCRAFT.Item.spell.tags.weather",
    sources: new Set(["primal"]),
  },
  extrinsic: {
    label: "MYTHCRAFT.Item.spell.tags.extrinsic",
    sources: new Set(["primal"]),
  },
  intrinsic: {
    label: "MYTHCRAFT.Item.spell.tags.intrinsic",
    sources: new Set(["primal"]),
  },
  concentration: {
    label: "MYTHCRAFT.Item.spell.tags.concentration",
    sources: new Set(["psionic"]),
  },
  manifestation: {
    label: "MYTHCRAFT.Item.spell.tags.manifestation",
    sources: new Set(["psionic"]),
  },
  meditation: {
    label: "MYTHCRAFT.Item.spell.tags.meditation",
    sources: new Set(["psionic"]),
  },
  alchemy: {
    label: "MYTHCRAFT.Item.spell.tags.alchemy",
    group: "MYTHCRAFT.Item.spell.tags.function",
  },
  altering: {
    label: "MYTHCRAFT.Item.spell.tags.altering",
    group: "MYTHCRAFT.Item.spell.tags.function",
  },
  divining: {
    label: "MYTHCRAFT.Item.spell.tags.divining",
    group: "MYTHCRAFT.Item.spell.tags.function",
  },
  enchanting: {
    label: "MYTHCRAFT.Item.spell.tags.enchanting",
    group: "MYTHCRAFT.Item.spell.tags.function",
  },
  evoking: {
    label: "MYTHCRAFT.Item.spell.tags.evoking",
    group: "MYTHCRAFT.Item.spell.tags.function",
  },
  illusory: {
    label: "MYTHCRAFT.Item.spell.tags.illusory",
    group: "MYTHCRAFT.Item.spell.tags.function",
  },
  necromancy: {
    label: "MYTHCRAFT.Item.spell.tags.necromancy",
    group: "MYTHCRAFT.Item.spell.tags.function",
  },
  summoning: {
    label: "MYTHCRAFT.Item.spell.tags.summoning",
    group: "MYTHCRAFT.Item.spell.tags.function",
  },
  warding: {
    label: "MYTHCRAFT.Item.spell.tags.warding",
    group: "MYTHCRAFT.Item.spell.tags.function",
  },
  clairsentience: {
    label: "MYTHCRAFT.Item.spell.tags.clairsentience",
    group: "MYTHCRAFT.Item.spell.tags.aptitude",
    sources: new Set(["psionic"]),
  },
  psychokinetics: {
    label: "MYTHCRAFT.Item.spell.tags.psychokinetics",
    group: "MYTHCRAFT.Item.spell.tags.aptitude",
    sources: new Set(["psionic"]),
  },
  metacreativity: {
    label: "MYTHCRAFT.Item.spell.tags.metacreativity",
    group: "MYTHCRAFT.Item.spell.tags.aptitude",
    sources: new Set(["psionic"]),
  },
  telepathy: {
    label: "MYTHCRAFT.Item.spell.tags.telepathy",
    group: "MYTHCRAFT.Item.spell.tags.aptitude",
    sources: new Set(["psionic"]),
  },
  psychometabolics: {
    label: "MYTHCRAFT.Item.spell.tags.psychometabolics",
    group: "MYTHCRAFT.Item.spell.tags.aptitude",
    sources: new Set(["psionic"]),
  },
  psychovillany: {
    label: "MYTHCRAFT.Item.spell.tags.psychovillany",
    group: "MYTHCRAFT.Item.spell.tags.aptitude",
    sources: new Set(["psionic"]),
  },
};

export const spells = {
  components: spellComponents,
  requirements: spellRequirements,
  sources: spellSources,
  tags: spellTags,
};

/**
 * @typedef TalentTag
 * @property {string} label         The i18n string for the Tag.
 * @property {string} group         The i18n string for the tag group.
 * @property {boolean} [isClass]    Is this a class talent?
 */

/** @type {Record<string, TalentTag>} */
const talentTags = {
  repeatable: {
    label: "MYTHCRAFT.Tags.repeatable",
  },
  capstone: {
    label: "MYTHCRAFT.Item.talent.tags.capstone",
  },
  entry: {
    label: "MYTHCRAFT.Item.talent.tags.entry",
  },
  berzerker: {
    label: "MYTHCRAFT.Item.talent.tags.berzerker",
    group: "MYTHCRAFT.Item.talent.tags.berzerker",
    isClass: true,
  },
  exile: {
    label: "MYTHCRAFT.Item.talent.tags.exile",
    group: "MYTHCRAFT.Item.talent.tags.berzerker",
  },
  fearless: {
    label: "MYTHCRAFT.Item.talent.tags.fearless",
    group: "MYTHCRAFT.Item.talent.tags.berzerker",
  },
  juggernaut: {
    label: "MYTHCRAFT.Item.talent.tags.juggernaut",
    group: "MYTHCRAFT.Item.talent.tags.berzerker",
  },
  rage: {
    label: "MYTHCRAFT.Item.talent.tags.rage",
    group: "MYTHCRAFT.Item.talent.tags.berzerker",
  },
  cleric: {
    label: "MYTHCRAFT.Item.talent.tags.cleric",
    group: "MYTHCRAFT.Item.talent.tags.cleric",
    isClass: true,
  },
  exorcist: {
    label: "MYTHCRAFT.Item.talent.tags.exorcist",
    group: "MYTHCRAFT.Item.talent.tags.cleric",
  },
  piety: {
    label: "MYTHCRAFT.Item.talent.tags.piety",
    group: "MYTHCRAFT.Item.talent.tags.cleric",
  },
  theologian: {
    label: "MYTHCRAFT.Item.talent.tags.theologian",
    group: "MYTHCRAFT.Item.talent.tags.cleric",
  },
  divineIconCleric: {
    label: "MYTHCRAFT.Item.talent.tags.divineIcons",
    group: "MYTHCRAFT.Item.talent.tags.cleric",
  },
  mage: {
    label: "MYTHCRAFT.Item.talent.tags.mage",
    group: "MYTHCRAFT.Item.talent.tags.mage",
    isClass: true,
  },
  arcaneWeaving: {
    label: "MYTHCRAFT.Item.talent.tags.arcaneWeaving",
    group: "MYTHCRAFT.Item.talent.tags.mage",
  },
  archmage: {
    label: "MYTHCRAFT.Item.talent.tags.archmage",
    group: "MYTHCRAFT.Item.talent.tags.mage",
  },
  sorcery: {
    label: "MYTHCRAFT.Item.talent.tags.sorcery",
    group: "MYTHCRAFT.Item.talent.tags.mage",
  },
  tomeWizard: {
    label: "MYTHCRAFT.Item.talent.tags.tomeWizard",
    group: "MYTHCRAFT.Item.talent.tags.mage",
  },
  oracle: {
    label: "MYTHCRAFT.Item.talent.tags.oracle",
    group: "MYTHCRAFT.Item.talent.tags.oracle",
    isClass: true,
  },
  druid: {
    label: "MYTHCRAFT.Item.talent.tags.druid",
    group: "MYTHCRAFT.Item.talent.tags.oracle",
  },
  elementalist: {
    label: "MYTHCRAFT.Item.talent.tags.elementalist",
    group: "MYTHCRAFT.Item.talent.tags.oracle",
  },
  fate: {
    label: "MYTHCRAFT.Item.talent.tags.fate",
    group: "MYTHCRAFT.Item.talent.tags.oracle",
  },
  guide: {
    label: "MYTHCRAFT.Item.talent.tags.guide",
    group: "MYTHCRAFT.Item.talent.tags.oracle",
  },
  pugilist: {
    label: "MYTHCRAFT.Item.talent.tags.pugilist",
    group: "MYTHCRAFT.Item.talent.tags.pugilist",
    isClass: true,
  },
  constitute: {
    label: "MYTHCRAFT.Item.talent.tags.constitute",
    group: "MYTHCRAFT.Item.talent.tags.pugilist",
  },
  martialArts: {
    label: "MYTHCRAFT.Item.talent.tags.martialArts",
    group: "MYTHCRAFT.Item.talent.tags.pugilist",
  },
  pummeling: {
    label: "MYTHCRAFT.Item.talent.tags.pummeling",
    group: "MYTHCRAFT.Item.talent.tags.pugilist",
  },
  wrestling: {
    label: "MYTHCRAFT.Item.talent.tags.wrestling",
    group: "MYTHCRAFT.Item.talent.tags.pugilist",
  },
  ranger: {
    label: "MYTHCRAFT.Item.talent.tags.ranger",
    group: "MYTHCRAFT.Item.talent.tags.ranger",
    isClass: true,
  },
  bravery: {
    label: "MYTHCRAFT.Item.talent.tags.bravery",
    group: "MYTHCRAFT.Item.talent.tags.ranger",
  },
  hunter: {
    label: "MYTHCRAFT.Item.talent.tags.hunter",
    group: "MYTHCRAFT.Item.talent.tags.ranger",
  },
  instinct: {
    label: "MYTHCRAFT.Item.talent.tags.instinct",
    group: "MYTHCRAFT.Item.talent.tags.ranger",
  },
  survivor: {
    label: "MYTHCRAFT.Item.talent.tags.survivor",
    group: "MYTHCRAFT.Item.talent.tags.ranger",
  },
  wildernessWarden: {
    label: "MYTHCRAFT.Item.talent.tags.wildernessWarden",
    group: "MYTHCRAFT.Item.talent.tags.ranger",
  },
  rogue: {
    label: "MYTHCRAFT.Item.talent.tags.rogue",
    group: "MYTHCRAFT.Item.talent.tags.rogue",
    isClass: true,
  },
  con: {
    label: "MYTHCRAFT.Item.talent.tags.con",
    group: "MYTHCRAFT.Item.talent.tags.rogue",
  },
  guildAffiliate: {
    label: "MYTHCRAFT.Item.talent.tags.guildAffiliate",
    group: "MYTHCRAFT.Item.talent.tags.rogue",
  },
  psyblade: {
    label: "MYTHCRAFT.Item.talent.tags.psyblade",
    group: "MYTHCRAFT.Item.talent.tags.rogue",
  },
  subtlety: {
    label: "MYTHCRAFT.Item.talent.tags.subtlety",
    group: "MYTHCRAFT.Item.talent.tags.rogue",
  },
  stealthArcher: {
    label: "MYTHCRAFT.Item.talent.tags.stealthArcher",
    group: "MYTHCRAFT.Item.talent.tags.rogue",
  },
  tinkerer: {
    label: "MYTHCRAFT.Item.talent.tags.tinkerer",
    group: "MYTHCRAFT.Item.talent.tags.tinkerer",
    isClass: true,
  },
  alchemist: {
    label: "MYTHCRAFT.Item.talent.tags.alchemist",
    group: "MYTHCRAFT.Item.talent.tags.tinkerer",
  },
  augmentor: {
    label: "MYTHCRAFT.Item.talent.tags.augmentor",
    group: "MYTHCRAFT.Item.talent.tags.tinkerer",
  },
  inventor: {
    label: "MYTHCRAFT.Item.talent.tags.inventor",
    group: "MYTHCRAFT.Item.talent.tags.tinkerer",
  },
  magitechnician: {
    label: "MYTHCRAFT.Item.talent.tags.magitechnician",
    group: "MYTHCRAFT.Item.talent.tags.tinkerer",
  },
  troubadour: {
    label: "MYTHCRAFT.Item.talent.tags.troubadour",
    group: "MYTHCRAFT.Item.talent.tags.troubadour",
    isClass: true,
  },
  encore: {
    label: "MYTHCRAFT.Item.talent.tags.encore",
    group: "MYTHCRAFT.Item.talent.tags.troubadour",
  },
  jester: {
    label: "MYTHCRAFT.Item.talent.tags.jester",
    group: "MYTHCRAFT.Item.talent.tags.troubadour",
  },
  legendKeeper: {
    label: "MYTHCRAFT.Item.talent.tags.legendKeeper",
    group: "MYTHCRAFT.Item.talent.tags.troubadour",
  },
  lorist: {
    label: "MYTHCRAFT.Item.talent.tags.lorist",
    group: "MYTHCRAFT.Item.talent.tags.troubadour",
  },
  lyricist: {
    label: "MYTHCRAFT.Item.talent.tags.lyricist",
    group: "MYTHCRAFT.Item.talent.tags.troubadour",
  },
  vessel: {
    label: "MYTHCRAFT.Item.talent.tags.vessel",
    group: "MYTHCRAFT.Item.talent.tags.vessel",
    isClass: true,
  },
  antiessence: {
    label: "MYTHCRAFT.Item.talent.tags.antiessence",
    group: "MYTHCRAFT.Item.talent.tags.vessel",
  },
  planarThievery: {
    label: "MYTHCRAFT.Item.talent.tags.planarThievery",
    group: "MYTHCRAFT.Item.talent.tags.vessel",
  },
  soulGraft: {
    label: "MYTHCRAFT.Item.talent.tags.soulGraft",
    group: "MYTHCRAFT.Item.talent.tags.vessel",
  },
  divineIconVessel: {
    label: "MYTHCRAFT.Item.talent.tags.divineIcons",
    group: "MYTHCRAFT.Item.talent.tags.vessel",
  },
  warrior: {
    label: "MYTHCRAFT.Item.talent.tags.warrior",
    group: "MYTHCRAFT.Item.talent.tags.warrior",
    isClass: true,
  },
  archeryWarrior: {
    label: "MYTHCRAFT.Item.talent.tags.archeryWarrior",
    group: "MYTHCRAFT.Item.talent.tags.warrior",
  },
  commander: {
    label: "MYTHCRAFT.Item.talent.tags.commander",
    group: "MYTHCRAFT.Item.talent.tags.warrior",
  },
  protection: {
    label: "MYTHCRAFT.Item.talent.tags.protection",
    group: "MYTHCRAFT.Item.talent.tags.warrior",
  },
  soldier: {
    label: "MYTHCRAFT.Item.talent.tags.soldier",
    group: "MYTHCRAFT.Item.talent.tags.warrior",
  },
  witch: {
    label: "MYTHCRAFT.Item.talent.tags.witch",
    group: "MYTHCRAFT.Item.talent.tags.witch",
    isClass: true,
  },
  darkHex: {
    label: "MYTHCRAFT.Item.talent.tags.darkHex",
    group: "MYTHCRAFT.Item.talent.tags.witch",
  },
  fae: {
    label: "MYTHCRAFT.Item.talent.tags.fae",
    group: "MYTHCRAFT.Item.talent.tags.witch",
  },
  familiar: {
    label: "MYTHCRAFT.Item.talent.tags.familiar",
    group: "MYTHCRAFT.Item.talent.tags.witch",
  },
  paganAttunement: {
    label: "MYTHCRAFT.Item.talent.tags.paganAttunement",
    group: "MYTHCRAFT.Item.talent.tags.witch",
  },
  witchBrew: {
    label: "MYTHCRAFT.Item.talent.tags.witchBrew",
    group: "MYTHCRAFT.Item.talent.tags.witch",
  },
  zealot: {
    label: "MYTHCRAFT.Item.talent.tags.zealot",
    group: "MYTHCRAFT.Item.talent.tags.zealot",
    isClass: true,
  },
  aura: {
    label: "MYTHCRAFT.Item.talent.tags.aura",
    group: "MYTHCRAFT.Item.talent.tags.zealot",
  },
  auraEnhancements: {
    label: "MYTHCRAFT.Item.talent.tags.auraEnhancements",
    group: "MYTHCRAFT.Item.talent.tags.zealot",
  },
  cavalier: {
    label: "MYTHCRAFT.Item.talent.tags.cavalier",
    group: "MYTHCRAFT.Item.talent.tags.zealot",
  },
  consecratedBlade: {
    label: "MYTHCRAFT.Item.talent.tags.consecratedBlade",
    group: "MYTHCRAFT.Item.talent.tags.zealot",
  },
  crusader: {
    label: "MYTHCRAFT.Item.talent.tags.crusader",
    group: "MYTHCRAFT.Item.talent.tags.zealot",
  },
  holyCause: {
    label: "MYTHCRAFT.Item.talent.tags.holyCause",
    group: "MYTHCRAFT.Item.talent.tags.zealot",
  },
  reputation: {
    label: "MYTHCRAFT.Item.talent.tags.reputation",
    group: "MYTHCRAFT.Item.talent.tags.zealot",
  },
  combat: {
    label: "MYTHCRAFT.Item.talent.tags.combat",
    group: "MYTHCRAFT.Item.talent.tags.combat",
  },
  archery: {
    label: "MYTHCRAFT.Item.talent.tags.archery",
    group: "MYTHCRAFT.Item.talent.tags.combat",
  },
  crit: {
    label: "MYTHCRAFT.Item.talent.tags.crit",
    group: "MYTHCRAFT.Item.talent.tags.combat",
  },
  twoWeaponFighting: {
    label: "MYTHCRAFT.Item.talent.tags.twoWeaponFighting",
    group: "MYTHCRAFT.Item.talent.tags.combat",
  },
  oneHandedFighting: {
    label: "MYTHCRAFT.Item.talent.tags.oneHandedFighting",
    group: "MYTHCRAFT.Item.talent.tags.combat",
  },
  twoHandedFighting: {
    label: "MYTHCRAFT.Item.talent.tags.twoHandedFighting",
    group: "MYTHCRAFT.Item.talent.tags.combat",
  },
  weapon: {
    label: "MYTHCRAFT.Item.talent.tags.weapon",
    group: "MYTHCRAFT.Item.talent.tags.combat",
  },
  command: {
    label: "MYTHCRAFT.Item.talent.tags.command",
    group: "MYTHCRAFT.Item.talent.tags.command",
  },
  social: {
    label: "MYTHCRAFT.Item.talent.tags.social",
    group: "MYTHCRAFT.Item.talent.tags.command",
  },
  defense: {
    label: "MYTHCRAFT.Item.talent.tags.defense",
    group: "MYTHCRAFT.Item.talent.tags.defense",
  },
  armor: {
    label: "MYTHCRAFT.Item.talent.tags.armor",
    group: "MYTHCRAFT.Item.talent.tags.defense",
  },
  defensiveManeuver: {
    label: "MYTHCRAFT.Item.talent.tags.defensiveManeuver",
    group: "MYTHCRAFT.Item.talent.tags.defense",
  },
  shield: {
    label: "MYTHCRAFT.Item.talent.tags.shield",
    group: "MYTHCRAFT.Item.talent.tags.defense",
  },
  misc: {
    label: "MYTHCRAFT.Item.talent.tags.misc",
    group: "MYTHCRAFT.Item.talent.tags.misc",
  },
  primalAspect: {
    label: "MYTHCRAFT.Item.talent.tags.primalAspect",
    group: "MYTHCRAFT.Item.talent.tags.misc",
  },
  skill: {
    label: "MYTHCRAFT.Item.talent.tags.skill",
  },
};

/**
 * @typedef TalentAction
 * @property {string} label   The i18n string for the category.
 */

/** @type {Record<string, TalentAction>} */
const talentActions = {
  action: {
    label: "MYTHCRAFT.Item.talent.actions.action",
  },
  reaction: {
    label: "MYTHCRAFT.Item.talent.actions.reaction",
  },
};

export const talents = {
  tags: talentTags,
  /** @type {FormSelectOption[]} */
  get tagOptions() {
    return Object.entries(talentTags).map(([value, { label, group }]) => ({ value, label, group: game.i18n.localize(group) }));
  },
  actions: talentActions,
  /** @type {FormSelectOption[]} */
  get actionOptions() {
    return Object.entries(talentActions).map(([value, { label }]) => ({ value, label }));
  },
};

/**
 * @typedef WeaponTag
 * @property {string} label
 * @property {string} reference
 */

/** @type {Record<string, WeaponTag>} */
const weaponTags = {
  ammunition: {
    label: "MYTHCRAFT.Item.weapon.Tags.ammunition",
    reference: "",
  },
  concealed: {
    label: "MYTHCRAFT.Item.weapon.Tags.concealed",
    reference: "",
  },
  handHalf: {
    label: "MYTHCRAFT.Item.weapon.Tags.handHalf",
    reference: "",
  },
  light: {
    label: "MYTHCRAFT.Item.weapon.Tags.light",
    reference: "",
  },
  natural: {
    label: "MYTHCRAFT.Item.weapon.Tags.natural",
    reference: "",
  },
  oneHanded: {
    label: "MYTHCRAFT.Item.weapon.Tags.oneHanded",
    reference: "",
  },
  special: {
    label: "MYTHCRAFT.Item.weapon.Tags.special",
    reference: "",
  },
  twoHanded: {
    label: "MYTHCRAFT.Item.weapon.Tags.twoHanded",
    reference: "",
  },
  unwieldy: {
    label: "MYTHCRAFT.Item.weapon.Tags.unwieldy",
    reference: "",
  },
};

export const weapon = {
  tags: weaponTags,
  /** @type {FormSelectOption[]} */
  get tagOptions() {
    return Object.entries(weaponTags).map(([value, { label }]) => ({ value, label }));
  },
};

export const currencies = {
  sc: {
    label: "MYTHCRAFT.Currency.sc.label",
    tooltip: "MYTHCRAFT.Currency.sc.tooltip",
  },
  dc: {
    label: "MYTHCRAFT.Currency.dc.label",
    tooltip: "MYTHCRAFT.Currency.dc.tooltip",
  },
  a: {
    label: "MYTHCRAFT.Currency.a.label",
    tooltip: "MYTHCRAFT.Currency.a.tooltip",
  },
  q: {
    label: "MYTHCRAFT.Currency.q.label",
    tooltip: "MYTHCRAFT.Currency.q.tooltip",
  },
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
    itemTypes: new Set(["background", "lineage", "feature", "profession", "talent" ]),
    documentClass: pseudoDocuments.advancements.ItemGrantAdvancement,
  },
  skill: {
    label: "TYPES.Advancement.skill",
    defaultImage: "icons/svg/hanging-sign.svg",
    itemTypes: new Set(["background", "feature", "profession", "talent"]),
    documentClass: pseudoDocuments.advancements.SkillAdvancement,
  },
};
