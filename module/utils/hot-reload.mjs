import { systemPath } from "../constants.mjs";

/** @import { HotReloadData } from "@client/types.mjs" */

/**
 * A hook event that fires when a package that is being watched by the hot reload system has a file changed.
 * The hook provides the hot reload data related to the file change.
 * Hooked functions may intercept the hot reload and prevent the core software from handling it by returning false.
 *
 * @param {HotReloadData} data          The hot reload data
 */
export function hotReload(data) {
  console.log(data.path);
  if (data.packageType !== "system") return;
  if (data.path.includes(systemPath("lang"))) {
    // Hook is called *before* i18n is updated so need to wait for that to resolve
    // Can be removed if https://github.com/foundryvtt/foundryvtt/issues/11762 is implemented
    queueMicrotask(() => {
      // Repeat the i18n process from Localization.#localizeDataModels
      for (const documentName of CONST.ALL_DOCUMENT_TYPES) {
        for (const model of Object.values(CONFIG[documentName].dataModels ?? {})) {
          foundry.helpers.Localization.localizeDataModel(model, { prefixPath: "system." });
        }
      }
      // Render all apps again.
      for (const appV1 of Object.values(ui.windows)) appV1.render();
      for (const appV2 of foundry.applications.instances.values()) appV2.render();
    });
  }
  else if (data.path.includes(systemPath("styles"))) {
    // This must be adjusted if you register additional CSS files (e.g. to add a variables layer) in system.json
    const path = systemPath("styles/system.css");
    console.log(data.path, path);
    // Don't need to refresh if it's the root file
    if (data.path === path) return;
    // Taken from core's `Game##hotReloadCSS`
    const pathRegex = new RegExp(`@import "${path}(?:\\?[^"]+)?"`);
    for (const style of document.querySelectorAll("style")) {
      const [match] = style.textContent.match(pathRegex) ?? [];
      if (match) {
        style.textContent = style.textContent.replace(match, `@import "${path}?${Date.now()}"`);
        return;
      }
    }
  }
}
