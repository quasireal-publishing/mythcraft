/**
 * A custom implementation of the Actor class.
 */
export default class MythCraftItem extends foundry.documents.Item {
  /** @inheritdoc */
  _configure(options = {}) {
    super._configure(options);

    const collections = {};
    const model = CONFIG[this.documentName].dataModels[this._source.type];
    const embedded = model?.metadata?.embedded ?? {};
    for (const [documentName, fieldPath] of Object.entries(embedded)) {
      const data = foundry.utils.getProperty(this._source, fieldPath);
      const field = model.schema.getField(fieldPath.slice("system.".length));
      collections[documentName] = new field.constructor.implementation(documentName, this, data);
    }

    Object.defineProperty(this, "pseudoCollections", { value: Object.seal(collections), writable: false });
  }

  /* -------------------------------------------------- */

  /**
   * Return a data object which defines the data schema against which dice rolls can be evaluated.
   * @returns {Record<string, any>}
   */
  getRollData() {
    // Start with the parent actor roll data, if it's available
    const rollData = this.actor?.getRollData() ?? {};

    // Shallow copy
    rollData.item = { ...this.system, flags: this.flags, name: this.name };

    // Allow system-specific modifications, e.g. adding getters
    if (this.system.modifyRollData instanceof Function) {
      this.system.modifyRollData(rollData);
    }

    return rollData;
  }

  /* -------------------------------------------------- */

  /**
   * Return an item's MythCraft ID.
   * @type {string}
   */
  get mcid() {
    if (this.system._mcid) return this.system._mcid;
    const mcid = this.name.replaceAll(/(\w+)([\\|/])(\w+)/g, "$1-$3");
    return mcid.slugify({ strict: true });
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  getEmbeddedCollection(embeddedName) {
    return this.pseudoCollections[embeddedName] ?? super.getEmbeddedCollection(embeddedName);
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  prepareBaseData() {
    super.prepareBaseData();
    for (const collection of Object.values(this.pseudoCollections)) {
      for (const pseudo of collection) pseudo.prepareBaseData();
    }
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();
    for (const collection of Object.values(this.pseudoCollections)) {
      for (const pseudo of collection) pseudo.prepareDerivedData();
    }
  }

  /* -------------------------------------------------- */
  /*   Advancements                                     */
  /* -------------------------------------------------- */

  /**
   * Does this item type support advancements?
   * @type {boolean}
   */
  get supportsAdvancements() {
    return "Advancement" in this.pseudoCollections;
  }

  /* -------------------------------------------------- */

  /**
   * Has this item granted other items via advancements?
   * @type {boolean}
   */
  get hasGrantedItems() {
    if (!this.supportsAdvancements || !this.parent) return false;
    return this.collection.some(item => {
      if (item.getFlag(systemID, "advancement.parentId") === this.id)
        return !!this.getEmbeddedCollection("Advancement").get(item.getFlag(systemID, "advancement.advancementId"));
      return false;
    });
  }

  /* -------------------------------------------------- */

  /**
   * An alternative to the document delete method, this deletes the item as well as any items that were
   * added as a result of this item's creation via advancements.
   * @param {Object} options
   * @param {boolean} [options.replacement=false]   Should the window title indicate that this is a replacement?
   * @param {boolean} [options.skipDialog=false]    Whether to skip the confirmation dialog, e.g., if there's already been another.
   * @returns {Promise<foundry.documents.Item[]|null>}   A promise that resolves to the deleted items.
   */
  async advancementDeletionPrompt({ replacement = false, skipDialog = false } = {}) {
    if (!this.isEmbedded) {
      throw new Error("You cannot prompt for deletion of advancements of an unowned item.");
    }

    if (!this.supportsAdvancements) {
      throw new Error(`The [${this.type}] item type does not support advancements.`);
    }

    const content = document.createElement("div");

    content.insertAdjacentHTML("afterbegin", `<p>${game.i18n.localize("MYTHCRAFT.Advancement.DeleteDialog.Content")}</p>`);
    content.append(this.toAnchor());

    const itemIds = new Set([this.id]);
    for (const advancement of this.getEmbeddedCollection("Advancement").documentsByType.itemGrant) {
      for (const item of advancement.grantedItemsChain()) {
        content.append(item.toAnchor());
        itemIds.add(item.id);
      }
    }

    if (!skipDialog) {
      const title = game.i18n.format(
        replacement ? "MYTHCRAFT.Advancement.DeleteDialog.ReplaceTitle" : "DOCUMENT.Delete",
        { type: this.name },
      );
      const confirm = await mythcraft.applications.api.MythCraftDialog.confirm({
        content,
        window: {
          title,
          icon: "fa-solid fa-trash",
        },
      });
      if (!confirm) return;
    }

    return this.actor.deleteEmbeddedDocuments("Item", Array.from(itemIds));
  }
}
