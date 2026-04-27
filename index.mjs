import { applications, canvas, data, documents, rolls, utils, SystemCONFIG, SystemCONST } from "./module/_module.mjs";
import { migrateCurrencyData } from "./module/utils/migrations.mjs";

globalThis.mythcraft = { CONFIG: SystemCONFIG, CONST: SystemCONST, applications, data, documents, rolls, utils };

Hooks.once("init", () => {

  // Register all Document classes
  CONFIG.Actor.documentClass = documents.MythCraftActor;
  CONFIG.Item.documentClass = documents.MythCraftItem;
  CONFIG.Token.documentClass = documents.MythCraftTokenDocument;

  // Register system data models
  Object.assign(CONFIG.ActiveEffect.dataModels, data.ActiveEffect.config);
  Object.assign(CONFIG.Actor.dataModels, data.Actor.config);
  Object.assign(CONFIG.ChatMessage.dataModels, data.ChatMessage.config);
  Object.assign(CONFIG.Item.dataModels, data.Item.config);

  // Register system sheets
  const DocumentSheetConfig = foundry.applications.apps.DocumentSheetConfig;

  DocumentSheetConfig.registerSheet(foundry.documents.Actor, SystemCONST.systemId, applications.sheets.CharacterSheet, {
    makeDefault: true,
    types: ["character"],
  });
  DocumentSheetConfig.registerSheet(foundry.documents.Actor, SystemCONST.systemId, applications.sheets.NPCSheet, {
    makeDefault: true,
    types: ["npc"],
  });
  DocumentSheetConfig.registerSheet(foundry.documents.Actor, SystemCONST.systemId, applications.sheets.SiegeWeaponSheet, {
    makeDefault: true,
    types: ["siege"],
  });
  DocumentSheetConfig.registerSheet(foundry.documents.Item, SystemCONST.systemId, applications.sheets.MythCraftItemSheet, {
    makeDefault: true,
  });
  DocumentSheetConfig.registerSheet(foundry.documents.ActiveEffect, SystemCONST.systemId, applications.sheets.MythCraftActiveEffectConfig, {
    makeDefault: true,
  });

  // Movement
  CONFIG.Token.rulerClass = canvas.MythCraftTokenRuler;
  canvas.MythCraftTokenRuler.applyMCMovementConfig();

  // Register system rolls
  CONFIG.Dice.rolls = [rolls.MythCraftRoll, rolls.AttributeRoll, rolls.DamageRoll, rolls.SpellRoll, rolls.AttackRoll, rolls.InitiativeRoll];

  // Configure initiative
  CONFIG.Combat.initiative = {
    formula: "1d20 + @attributes.awr + @initiative.bonus",
    decimals: 2,
  };

  // Register enrichers
  CONFIG.TextEditor.enrichers = [applications.ux.enrichers.roll];

  // Register custom form elements (guard prevents duplicate-define error on hot reload)
  if (!customElements.get("tag-input")) customElements.define("tag-input", applications.ux.TagInputElement);

  // Handlebars helpers for TagInputElement
  Handlebars.registerHelper("json", (value) => JSON.stringify(value));
  Handlebars.registerHelper("join", (arr, sep) => Array.from(arr ?? []).join(sep));

  // Register system settings
  utils.SystemSettingsHandler.registerSettings();

  // Schema version tracking for data migrations
  game.settings.register("mythcraft", "schemaVersion", {
    name: "Schema Version",
    scope: "world",
    config: false,
    type: Number,
    default: 0,
  });
});

Hooks.once("i18nInit", () => {
  // Status Effect Transfer.
  // Foundry v14's CONFIG.statusEffects is a Proxy whose `ownKeys` trap returns
  // each entry's `id`; duplicate ids violate the proxy invariant and throw at
  // runtime ("trap returned duplicate entries"). Filter out any core-default
  // status effect whose id collides with one of our system conditions before
  // pushing our overrides.
  const systemConditionIds = new Set(Object.keys(SystemCONFIG.conditions));
  CONFIG.statusEffects = CONFIG.statusEffects.filter(effect => !systemConditionIds.has(effect.id));
  for (const [id, value] of Object.entries(SystemCONFIG.conditions)) {
    CONFIG.statusEffects.push({ id, _id: id.padEnd(16, "0"), ...value });
  }

  // Localize pseudo-documents. Base first, then loop through the types in use
  foundry.helpers.Localization.localizeDataModel(data.pseudoDocuments.advancements.BaseAdvancement);

  const localizePseudos = record => {
    for (const cls of Object.values(record)) {
      foundry.helpers.Localization.localizeDataModel(cls);
    }
  };

  localizePseudos(data.pseudoDocuments.advancements.BaseAdvancement.TYPES);
});

Hooks.once("ready", async () => {
  console.log(` __  __       _   _      ____            __ _
|  \\/  |_   _| |_| |__  / ___|_ __ __ _ / _| |_
| |\\/| | | | | __| '_ \\| |   | '__/ _\` | |_| __|
| |  | | |_| | |_| | | | |___| | | (_| |  _| |_
|_|  |_|\\__, |\\__|_| |_|\\____|_|  \\__,_|_|  \\__|
        |___/
`);

  // Data migrations
  const currentVersion = game.settings.get("mythcraft", "schemaVersion");
  if (currentVersion < 1) {
    // Migrate world actors
    for (const actor of game.actors) {
      if (actor.type !== "character") continue;
      const oldCurrency = actor.system.currency;
      if (!oldCurrency || typeof oldCurrency !== "object") continue;
      const migrated = migrateCurrencyData(oldCurrency);
      const update = {};
      for (const [key, value] of Object.entries(migrated)) {
        update[`system.currency.${key}`] = value;
      }
      if (Object.keys(update).length) await actor.update(update);
    }
    // Migrate unlinked token actors in scenes
    for (const scene of game.scenes) {
      for (const token of scene.tokens) {
        if (token.actorLink || token.actor?.type !== "character") continue;
        const oldCurrency = token.actor.system.currency;
        if (!oldCurrency || typeof oldCurrency !== "object") continue;
        const migrated = migrateCurrencyData(oldCurrency);
        const update = {};
        for (const [key, value] of Object.entries(migrated)) {
          update[`system.currency.${key}`] = value;
        }
        if (Object.keys(update).length) {
          await token.actor.update(update);
        }
      }
    }
    await game.settings.set("mythcraft", "schemaVersion", 1);
  }

  Hooks.callAll("mc.ready");
});

/**
 * Render Hooks.
 */

Hooks.on("renderChatMessageHTML", applications.hooks.renderChatMessageHTML);

/**
 * Other Hooks.
 */

Hooks.on("hotReload", utils.hotReload);
