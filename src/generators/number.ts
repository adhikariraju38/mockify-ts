/**
 * Number generators
 */

import { randomInt, randomFloat as randomFloatUtil } from '../utils/random';
import type { Generator, NumberOptions, FloatOptions } from './types';

/**
 * Generate a random integer
 */
export function number(options: NumberOptions = {}): Generator<number> {
  const { min = 0, max = 100 } = options;

  return () => randomInt(min, max);
}

/**
 * Alias for number
 */
export const int = number;

/**
 * Generate a random float
 */
export function float(options: FloatOptions = {}): Generator<number> {
  const { min = 0, max = 100, decimals = 2 } = options;

  return () => randomFloatUtil(min, max, decimals);
}

/**
 * Generate a random age (18-80 by default)
 */
export function age(options: NumberOptions = {}): Generator<number> {
  const { min = 18, max = 80 } = options;

  return () => randomInt(min, max);
}

/**
 * Generate a random price
 */
export function price(options: FloatOptions = {}): Generator<number> {
  const { min = 0.99, max = 999.99, decimals = 2 } = options;

  return () => randomFloatUtil(min, max, decimals);
}

/**
 * Generate a random quantity (1-100 by default)
 */
export function quantity(options: NumberOptions = {}): Generator<number> {
  const { min = 1, max = 100 } = options;

  return () => randomInt(min, max);
}

/**
 * Generate a random count (0-1000 by default)
 */
export function count(options: NumberOptions = {}): Generator<number> {
  const { min = 0, max = 1000 } = options;

  return () => randomInt(min, max);
}

/**
 * Generate a random percentage (0-100)
 */
export function percentage(options: NumberOptions = {}): Generator<number> {
  const { min = 0, max = 100 } = options;

  return () => randomInt(min, max);
}

/**
 * Generate a random rating (1-5 by default)
 */
export function rating(options: FloatOptions = {}): Generator<number> {
  const { min = 1, max = 5, decimals = 1 } = options;

  return () => randomFloatUtil(min, max, decimals);
}
