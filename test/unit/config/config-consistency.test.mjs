import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Read config.mjs as text and extract the currencies export
// This avoids importing the full module graph which requires deep Foundry mocks
describe('currency config consistency', () => {
  const configPath = resolve(import.meta.dirname, '../../../module/config.mjs');
  const configSource = readFileSync(configPath, 'utf-8');

  it('has exactly the expected currency keys', () => {
    // Extract currency keys from the source using regex
    const currencyBlock = configSource.match(/export const currencies = \{([\s\S]*?)\n\};/);
    expect(currencyBlock).not.toBeNull();

    const keys = [...currencyBlock[1].matchAll(/^\s{2}(\w+):/gm)].map(m => m[1]);
    expect(keys).toEqual(['astra', 'scillings', 'quints', 'denarii']);
  });

  it('each currency entry has label and tooltip', () => {
    const currencyBlock = configSource.match(/export const currencies = \{([\s\S]*?)\n\};/);
    expect(currencyBlock).not.toBeNull();

    const keys = [...currencyBlock[1].matchAll(/^\s{2}(\w+):/gm)].map(m => m[1]);
    for (const key of keys) {
      const keyPattern = new RegExp(`${key}:[\\s\\S]*?label:`, 'm');
      expect(currencyBlock[1]).toMatch(keyPattern);
      const tooltipPattern = new RegExp(`${key}:[\\s\\S]*?tooltip:`, 'm');
      expect(currencyBlock[1]).toMatch(tooltipPattern);
    }
  });
});
