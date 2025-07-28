import { applications, canvas, data, documents, rolls, utils, SystemCONFIG, SystemCONST } from "./module/_module.mjs";

globalThis.mythcraft = { CONFIG: SystemCONFIG, CONST: SystemCONST, applications, data, documents, rolls, utils };

Hooks.once("init", () => {

  // Register all Document classes
  CONFIG.Actor.documentClass = documents.MythCraftActor;
  CONFIG.Item.documentClass = documents.MythCraftItem;
  CONFIG.Token.documentClass = documents.MythCraftTokenDocument;

  // Register system data models
  Object.assign(CONFIG.ActiveEffect.dataModels, data.ActiveEffect.config);
  Object.assign(CONFIG.Actor.dataModels, data.Actor.config);
  Object.assign(CONFIG.Item.dataModels, data.Item.config);

  // Register system sheets
  const DocumentSheetConfig = foundry.applications.apps.DocumentSheetConfig;

  DocumentSheetConfig.registerSheet(foundry.documents.Actor, SystemCONST.systemId, applications.sheets.MythCraftActorSheet, {
    makeDefault: true,
  });
  DocumentSheetConfig.registerSheet(foundry.documents.Item, SystemCONST.systemId, applications.sheets.MythCraftItemSheet, {
    makeDefault: true,
  });

  // Movement
  CONFIG.Token.rulerClass = canvas.MythCraftTokenRuler;
  canvas.MythCraftTokenRuler.applyMCMovementConfig();

  // Register system rolls
  CONFIG.Dice.rolls = [rolls.MythCraftRoll, rolls.AttributeRoll];

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
  console.log(` __  __       _   _      ____            __ _
|  \\/  |_   _| |_| |__  / ___|_ __ __ _ / _| |_
| |\\/| | | | | __| '_ \\| |   | '__/ _\` | |_| __|
| |  | | |_| | |_| | | | |___| | | (_| |  _| |_
|_|  |_|\\__, |\\__|_| |_|\\____|_|  \\__,_|_|  \\__|
        |___/
`);

  Hooks.callAll("mc.ready");
});

/**
 * Render Hooks.
 */

/**
 * Other Hooks.
 */

Hooks.on("hotReload", utils.hotReload);
