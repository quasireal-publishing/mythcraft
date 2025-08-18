import MythCraftActorSheet from "./actor-sheet.mjs";
import { systemPath } from "../../constants.mjs";

/**
 * An actor sheet for character type actors.
 */
export default class CharacterSheet extends MythCraftActorSheet {
  /** @inheritdoc */
  static TABS = {
    primary: {
      tabs: [
        {
          id: "stats",
        },
        {
          id: "spells",
        },
        {
          id: "equipment",
        },
        {
          id: "talents",
        },
        {
          id: "effects",
        },
        {
          id: "biography",
        },
      ],
      initial: "stats",
      labelPrefix: "MYTHCRAFT.SHEET.Tabs",
    },
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static PARTS = {
    header: {
      template: systemPath("templates/actor/header.hbs"),
    },
    tabs: {
      template: "templates/generic/tab-navigation.hbs",
    },
    stats: {
      template: systemPath("templates/actor/stats.hbs"),
      scrollable: [""],
    },
    spells: {
      template: systemPath("templates/actor/spells.hbs"),
      scrollable: [""],
    },
    equipment: {
      template: systemPath("templates/actor/equipment.hbs"),
      scrollable: [""],
    },
    talents: {
      template: systemPath("templates/actor/talents.hbs"),
      scrollable: [""],
    },
    effects: {
      template: systemPath("templates/actor/effects.hbs"),
      scrollable: [""],
    },
    biography: {
      template: systemPath("templates/actor/biography.hbs"),
      scrollable: [""],
    },
  };

}
