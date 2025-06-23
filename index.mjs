import { applications, data, documents, rolls, utils, SystemCONFIG, SystemCONST } from "./module/_module.mjs";

globalThis.mythcraft = { CONFIG: SystemCONFIG, CONST: SystemCONST, applications, data, documents, rolls, utils };

Hooks.once("init", () => {

  // Register all Document classes
  CONFIG.Actor.documentClass = documents.SystemActor;
  CONFIG.Item.documentClass = documents.SystemItem;

  // Register system data models
  Object.assign(CONFIG.Actor.dataModels, data.Actor.config);
  Object.assign(CONFIG.Item.dataModels, data.Item.config);

  // Register system sheets
  const DocumentSheetConfig = foundry.applications.apps.DocumentSheetConfig;

  DocumentSheetConfig.registerSheet(foundry.documents.Actor, SystemCONST.systemId, applications.sheets.SystemActorSheet, {
    makeDefault: true,
  });
  DocumentSheetConfig.registerSheet(foundry.documents.Item, SystemCONST.systemId, applications.sheets.SystemItemSheet, {
    makeDefault: true,
  });

  // Register system rolls
  CONFIG.Dice.rolls = [rolls.SystemRoll];

  // Register system settings
  utils.SystemSettingsHandler.registerSettings();
});

Hooks.once("i18nInit", () => {
  /**
   * An array of status IDs provided by core foundry to remove.
   * @type {string[]}
   */
  const toRemove = [];
  CONFIG.statusEffects = CONFIG.statusEffects.filter(effect => !toRemove.includes(effect.id));
  // Status Effect Transfer
  for (const [id, value] of Object.entries(SystemCONFIG.conditions)) {
    CONFIG.statusEffects.push({ id, _id: id.padEnd(16, "0"), ...value });
  }
});

Hooks.once("ready", () => {
  // This is a good place to print ASCII art with `console.log`

  Hooks.callAll("system.ready");
});

/**
 * Render Hooks
 */

/**
 * Other Hooks
 */

Hooks.on("hotReload", utils.hotReload);
