/**
 * Smart field inference system
 */

import { findGeneratorForField } from './patterns';
import { gen } from '../generators';
import type { Generator } from '../generators/types';

export { findGeneratorForField } from './patterns';

/**
 * Infer a generator based on field name
 * Falls back to a basic generator if no pattern matches
 */
export function inferGenerator(fieldName: string): Generator<unknown> {
  // Try to find a matching pattern
  const matched = findGeneratorForField(fieldName);
  if (matched) {
    return matched;
  }

  // Default fallback - generate a random word
  return gen.word();
}

/**
 * Infer generators for all fields in a schema definition
 */
export function inferGeneratorsForSchema<T extends Record<string, unknown>>(
  fieldNames: (keyof T)[]
): Record<keyof T, Generator<unknown>> {
  const generators = {} as Record<keyof T, Generator<unknown>>;

  for (const fieldName of fieldNames) {
    generators[fieldName] = inferGenerator(String(fieldName));
  }

  return generators;
}

/**
 * Check if a field name matches a boolean pattern
 */
export function isBooleanField(fieldName: string): boolean {
  const booleanPatterns = [
    /^is[A-Z]/,
    /^has[A-Z]/,
    /^can[A-Z]/,
    /^should[A-Z]/,
    /^will[A-Z]/,
    /Active$/i,
    /^enabled$/i,
    /^disabled$/i,
    /^visible$/i,
    /^hidden$/i,
    /^verified$/i,
    /^active$/i,
    /^completed$/i,
    /^published$/i,
  ];

  return booleanPatterns.some((pattern) => pattern.test(fieldName));
}

/**
 * Check if a field name matches a date pattern
 */
export function isDateField(fieldName: string): boolean {
  const datePatterns = [
    /Date$/i,
    /At$/i,
    /_at$/i,
    /^timestamp$/i,
    /Timestamp$/i,
    /^date$/i,
  ];

  return datePatterns.some((pattern) => pattern.test(fieldName));
}

/**
 * Check if a field name matches an ID pattern
 */
export function isIdField(fieldName: string): boolean {
  const idPatterns = [/^id$/i, /^uuid$/i, /Id$/, /_id$/];

  return idPatterns.some((pattern) => pattern.test(fieldName));
}

/**
 * Check if a field name matches a numeric pattern
 */
export function isNumericField(fieldName: string): boolean {
  const numericPatterns = [
    /^age$/i,
    /^price$/i,
    /Price$/i,
    /^amount$/i,
    /^cost$/i,
    /^quantity$/i,
    /^qty$/i,
    /^count$/i,
    /Count$/i,
    /^total$/i,
    /^rating$/i,
    /^score$/i,
    /^percentage$/i,
    /^percent$/i,
  ];

  return numericPatterns.some((pattern) => pattern.test(fieldName));
}
