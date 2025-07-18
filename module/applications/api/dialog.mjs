/**
 * An extension of DialogV2 that adjusts the defaults for the system.
 */
export default class MythCraftDialog extends foundry.applications.api.Dialog {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["mythcraft"],
    position: {
      width: 400,
      height: "auto",
    },
  };
}
