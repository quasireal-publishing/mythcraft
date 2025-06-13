/** @import { NumberFieldOptions } from "@common/data/_types.mjs" */

/**
 * Helper function to generate the right options
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
