/**
 * A custom implementation of the Actor class.
 */
export default class MythCraftItem extends foundry.documents.Item {
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

  /**
   * Obtain the embedded collection of a given pseudo-document type.
   * @param {string} embeddedName   The document name of the embedded collection.
   * @returns {ModelCollection}     The embedded collection.
   */
  getEmbeddedPseudoDocumentCollection(embeddedName) {
    const collectionPath = this.system?.constructor.metadata.embedded?.[embeddedName];
    if (!collectionPath) {
      throw new Error(`${embeddedName} is not a valid embedded Pseudo-Document within the [${this.type}] ${this.documentName} subtype!`);
    }
    return foundry.utils.getProperty(this, collectionPath);
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  getEmbeddedDocument(embeddedName, id, { invalid = false, strict = false } = {}) {
    const systemEmbeds = this.system?.constructor.metadata.embedded ?? {};
    if (embeddedName in systemEmbeds) {
      const path = systemEmbeds[embeddedName];
      return foundry.utils.getProperty(this, path).get(id, { invalid, strict }) ?? null;
    }
    return super.getEmbeddedDocument(embeddedName, id, { invalid, strict });
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  prepareBaseData() {
    super.prepareBaseData();
    const documentNames = Object.keys(this.system?.constructor.metadata?.embedded ?? {});
    for (const documentName of documentNames) {
      for (const pseudoDocument of this.getEmbeddedPseudoDocumentCollection(documentName)) {
        pseudoDocument.prepareBaseData();
      }
    }
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();
    const documentNames = Object.keys(this.system?.constructor.metadata?.embedded ?? {});
    for (const documentName of documentNames) {
      for (const pseudoDocument of this.getEmbeddedPseudoDocumentCollection(documentName)) {
        pseudoDocument.prepareDerivedData();
      }
    }
  }

}
