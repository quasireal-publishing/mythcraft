/** @import { NumberFieldOptions } from "@common/data/_types.mjs" */

const { StringField } = foundry.data.fields;

/**
 * Helper function to generate the right options.
 * @param {NumberFieldOptions} options
 * @returns {NumberFieldOptions}
 */
export function requiredInteger(options) {
  return {
    required: true,
    integer: true,
    nullable: false,
    ...options,
  };
}

/**
 * Constructs a string field for use inside of a SetField.
 * @param {object} [options] Options to forward to the field.
 * @param {Record<string, string>} [options.choices] CONST-derived choices for the field.
 * @param {Function} [options.validate] A validator function for field values.
 * @returns A string field that is always truthy.
 */
export const setOptions = ({ choices, validate } = {}) => new StringField({ required: true, blank: false, choices, validate });
