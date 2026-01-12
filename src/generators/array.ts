/**
 * Array and collection generators
 */

import { randomInt, randomPick } from '../utils/random';
import type { Generator, ArrayOptions } from './types';

/**
 * Generate an array of values using a generator
 */
export function array<T>(generator: Generator<T>, options: ArrayOptions = {}): Generator<T[]> {
  const { min = 1, max = 5, length } = options;

  return () => {
    const count = length !== undefined ? length : randomInt(min, max);
    const result: T[] = [];

    for (let i = 0; i < count; i++) {
      result.push(generator());
    }

    return result;
  };
}

/**
 * Pick a random value from an array (for enums)
 */
export function oneOf<T extends readonly unknown[]>(values: T): Generator<T[number]> {
  return () => randomPick(values);
}

/**
 * Alias for oneOf (for enum-like arrays)
 */
export function enumValue<T extends readonly unknown[]>(values: T): Generator<T[number]> {
  return oneOf(values);
}

/**
 * Pick multiple unique values from an array
 */
export function someOf<T>(values: readonly T[], options: ArrayOptions = {}): Generator<T[]> {
  const { min = 1, max = values.length } = options;

  return () => {
    const count = randomInt(min, Math.min(max, values.length));
    const shuffled = [...values].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };
}

/**
 * Create a sequence generator
 */
export function sequence<T>(fn: (n: number) => T): Generator<T> {
  let counter = 1;
  return () => fn(counter++);
}

/**
 * Create a sequence with reset capability
 */
export function sequenceWithReset<T>(fn: (n: number) => T): Generator<T> & { reset: () => void } {
  let counter = 1;
  const generator = (() => fn(counter++)) as Generator<T> & { reset: () => void };
  generator.reset = () => {
    counter = 1;
  };
  return generator;
}

/**
 * Always return a constant value
 */
export function constant<T>(value: T): Generator<T> {
  return () => value;
}

/**
 * Nullable - sometimes returns null
 */
export function nullable<T>(generator: Generator<T>, probability = 0.1): Generator<T | null> {
  return () => {
    if (Math.random() < probability) {
      return null;
    }
    return generator();
  };
}

/**
 * Optional - sometimes returns undefined
 */
export function optional<T>(generator: Generator<T>, probability = 0.1): Generator<T | undefined> {
  return () => {
    if (Math.random() < probability) {
      return undefined;
    }
    return generator();
  };
}

/**
 * Weighted random selection
 */
export function weighted<T>(options: Array<{ value: T; weight: number }>): Generator<T> {
  const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0);

  return () => {
    let random = Math.random() * totalWeight;

    for (const option of options) {
      random -= option.weight;
      if (random <= 0) {
        return option.value;
      }
    }

    return options[options.length - 1].value;
  };
}

/**
 * Lazy generator - evaluates the generator function on each call
 */
export function lazy<T>(generatorFn: () => Generator<T>): Generator<T> {
  return () => generatorFn()();
}

/**
 * Pick one of multiple generators randomly
 */
export function oneOfGenerators<T>(generators: Generator<T>[]): Generator<T> {
  return () => {
    const generator = randomPick(generators);
    return generator();
  };
}
