import { systemId } from "../constants.mjs";

/** @import {SettingConfig} from "@client/_types.mjs" */

/**
 * A helper class that collects all of your settings and registers them
 */
export default class SystemSettingsHandler {
  /**
   * All settings for this system. Each entry is the key for the setting and the value is the registration object.
   * @type {Record<string, SettingConfig>}
   */
  static get systemSettings() {
    return {};
  }

  /**
   * Loop through all system settings and register them.
   * Called during the `init` hook.
   */
  static registerSettings() {
    for (const [key, value] of Object.entries(this.systemSettings)) {
      game.settings.register(systemId, key, value);
    }
  }
}
