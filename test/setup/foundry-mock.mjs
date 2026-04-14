// Field mocks — constructors store options, no validation
class MockDataField {
  constructor(options = {}) { this.options = options; this.initial = options.initial ?? undefined; }
}
class MockNumberField extends MockDataField {}
class MockStringField extends MockDataField {}
class MockBooleanField extends MockDataField {}
class MockHTMLField extends MockDataField {}
class MockFormulaField extends MockDataField {}
class MockSetField extends MockDataField {
  constructor(elementField, options = {}) { super(options); this.element = elementField; }
}
class MockSchemaField extends MockDataField {
  constructor(schema = {}, options = {}) { super(options); this.fields = schema; }
}
class MockTypedObjectField extends MockDataField {
  constructor(modelOrField, options = {}) { super(options); this.model = modelOrField; }
}
class MockEmbeddedDataField extends MockDataField {
  constructor(model, options = {}) { super(options); this.model = model; }
}
class MockCollectionField extends MockDataField {
  constructor(model, options = {}) { super(options); this.model = model; }
}

// TypeDataModel mock
class MockTypeDataModel {
  static LOCALIZATION_PREFIXES = [];
  static defineSchema() { return {}; }
  constructor(data = {}) { Object.assign(this, data); }
  prepareBaseData() {}
  prepareDerivedData() {}
}

// Roll mock with simple arithmetic evaluation
class MockRoll {
  constructor(formula = '', data = {}, options = {}) {
    this.formula = formula;
    this.data = data;
    this.options = { ...options };
    this._evaluated = false;
    this.terms = [];
    this.dice = [];
  }
  evaluateSync() {
    this._evaluated = true;
    let expr = this.formula.replace(/@([\w.]+)/g, (_, path) => {
      return path.split('.').reduce((o, k) => o?.[k], this.data) ?? 0;
    });
    try { this.total = Function(`"use strict"; return (${expr})`)(); }
    catch { this.total = 0; }
    return this;
  }
  async evaluate() { return this.evaluateSync(); }
  async render() { return `<div>${this.formula} = ${this.total}</div>`; }
  async toMessage(messageData = {}, options = {}) { return messageData; }
  get isDeterministic() { return !this.formula.match(/d\d/i); }
  static replaceFormulaData(formula, data) {
    return formula.replace(/@(\w+)/g, (_, key) => data[key] ?? 0);
  }
}

// Assign globals
// DataModel mock (non-typed base)
class MockDataModel {
  static defineSchema() { return {}; }
  constructor(data = {}) { Object.assign(this, data); }
}

globalThis.foundry = {
  data: {
    fields: {
      NumberField: MockNumberField, StringField: MockStringField,
      BooleanField: MockBooleanField, HTMLField: MockHTMLField,
      SchemaField: MockSchemaField, SetField: MockSetField,
      TypedObjectField: MockTypedObjectField, EmbeddedDataField: MockEmbeddedDataField,
      CollectionField: MockCollectionField, FormulaField: MockFormulaField,
    }
  },
  abstract: { DataModel: MockDataModel, TypeDataModel: MockTypeDataModel },
  dice: { Roll: MockRoll },
  utils: {
    mergeObject: (a, b) => Object.assign({}, a, b),
    getProperty: (obj, path) => path.split('.').reduce((o, k) => o?.[k], obj),
    setProperty: (obj, path, val) => {
      const parts = path.split('.');
      const last = parts.pop();
      const target = parts.reduce((o, k) => o[k] ??= {}, obj);
      target[last] = val;
    },
    randomID: () => Math.random().toString(36).slice(2, 10),
  },
};
globalThis.game = {
  i18n: {
    localize: (key) => key,
    format: (key, data) => key,
    getListFormatter: () => ({ format: (arr) => arr.join(', ') }),
  },
};
globalThis.mythcraft = { CONFIG: {}, utils: {}, rolls: {} };
globalThis.CONST = { TOKEN_DISPOSITIONS: { FRIENDLY: 1, NEUTRAL: 0, HOSTILE: -1 } };
globalThis.renderTemplate = async (path, data) => '<div>rendered</div>';
globalThis.ChatMessage = { getSpeaker: () => ({}) };
