/**
 * Generator type definitions
 */

/**
 * A generator is a function that produces a value
 */
export type Generator<T> = () => T;

/**
 * Options for string generation
 */
export interface StringOptions {
  length?: number;
  charset?: 'alphanumeric' | 'alpha' | 'numeric' | 'hex' | 'lowercase' | 'uppercase';
}

/**
 * Options for number generation
 */
export interface NumberOptions {
  min?: number;
  max?: number;
}

/**
 * Options for float generation
 */
export interface FloatOptions extends NumberOptions {
  decimals?: number;
}

/**
 * Options for date generation
 */
export interface DateOptions {
  min?: Date;
  max?: Date;
}

/**
 * Options for array generation
 */
export interface ArrayOptions {
  min?: number;
  max?: number;
  length?: number;
}

/**
 * Options for paragraph generation
 */
export interface ParagraphOptions {
  sentences?: number;
}

/**
 * Options for sentence generation
 */
export interface SentenceOptions {
  words?: number;
}
