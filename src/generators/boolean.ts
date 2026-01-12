/**
 * Boolean generators
 */

import { random } from '../utils/random';
import type { Generator } from './types';

/**
 * Generate a random boolean
 */
export function boolean(probability = 0.5): Generator<boolean> {
  return () => random() < probability;
}

/**
 * Always return true
 */
export function truthy(): Generator<boolean> {
  return () => true;
}

/**
 * Always return false
 */
export function falsy(): Generator<boolean> {
  return () => false;
}
