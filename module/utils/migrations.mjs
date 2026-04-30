/**
 * Map old currency keys to new named keys.
 * @param {object|null} oldCurrency - Old currency object with keys a, sc, q, dc.
 * @returns {object} Update data with new keys, or empty object if no migration needed.
 */
export function migrateCurrencyData(oldCurrency) {
  if (!oldCurrency || typeof oldCurrency !== "object") return {};
  const map = { a: "astra", sc: "scillings", q: "quints", dc: "denarii" };
  const result = {};
  for (const [oldKey, newKey] of Object.entries(map)) {
    if (oldKey in oldCurrency) result[newKey] = oldCurrency[oldKey];
  }
  return result;
}
