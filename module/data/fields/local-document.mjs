/**
 * @import Document from "@common/abstract/document.mjs";
 * @import { StringFieldOptions, DataFieldContext } from "@common/data/_types.mjs"
 */

/**
 * A special class of {@link foundry.data.fields.StringField} field which references another DataModel by its id.
 * This field may also be null to indicate that no foreign model is linked.
 */
export default class LocalDocumentField extends DocumentIdField {
  /**
   * @param {typeof Document} model           The foreign DataModel class definition which this field links to.
   * @param {StringFieldOptions} [options]    Options which configure the behavior of the field.
   * @param {DataFieldContext} [context]      Additional context which describes the field.
   */
  constructor(model, options = {}, context = {}) {
    super(options, context);
    if (!isSubclass(model, foundry.abstract.DataModel)) {
      throw new Error("A LocalDocumentField must specify a DataModel subclass as its type");
    }
    /**
     * A reference to the model class which is stored in this field.
     * @type {typeof Document}
     */
    this.model = model;
  }

  /** @inheritdoc */
  static get _defaults() {
    return Object.assign(super._defaults, { nullable: true, readonly: false, idOnly: false });
  }

  /** @override */
  _cast(value) {
    if (typeof value === "string") return value;
    if ((value instanceof this.model)) return value._id;
    throw new Error(`The value provided to a LocalDocumentField must be a ${this.model.name} instance.`);
  }

  /** @inheritdoc */
  initialize(value, model, options = {}) {
    if (this.idOnly) return value;
    return () => model?.getEmbeddedDocument(this.model.documentName, value) ?? null;
  }

  /** @inheritdoc */
  toObject(value) {
    return value?._id ?? value;
  }

  // _toInput is difficult to implement than desired due to lack of built-in document reference
}
