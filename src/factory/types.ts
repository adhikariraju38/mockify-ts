/**
 * Factory type definitions
 */

import type { Generator } from '../generators/types';

/**
 * A definition can be a generator, a static value, or a function
 */
export type FieldDefinition<T> = Generator<T> | T | (() => T);

/**
 * Schema definition for a factory
 * Each field can be a generator, static value, or function
 */
export type FactorySchema<T> = {
  [K in keyof T]?: FieldDefinition<T[K]>;
};

/**
 * Partial override for build method
 */
export type BuildOverride<T> = {
  [K in keyof T]?: T[K] | (() => T[K]);
};

/**
 * Trait definition - partial schema modifications
 */
export type TraitDefinition<T> = {
  [K in keyof T]?: FieldDefinition<T[K]>;
};

/**
 * Build options
 */
export interface BuildOptions {
  seed?: number;
}

/**
 * Factory interface
 */
export interface IFactory<T> {
  /**
   * Build a single instance
   */
  build(override?: BuildOverride<T>, options?: BuildOptions): T;
  build(traitName: string, override?: BuildOverride<T>, options?: BuildOptions): T;

  /**
   * Build multiple instances
   */
  buildMany(count: number, override?: BuildOverride<T>, options?: BuildOptions): T[];
  buildMany(count: number, traitName: string, override?: BuildOverride<T>, options?: BuildOptions): T[];

  /**
   * Define a trait (named variant)
   */
  trait(name: string, definition: TraitDefinition<T>): IFactory<T>;

  /**
   * Extend this factory with additional defaults
   */
  extend(schema: FactorySchema<T>): IFactory<T>;

  /**
   * Reset sequence counters
   */
  resetSequences(): void;
}

/**
 * Factory configuration options
 */
export interface FactoryConfig {
  /**
   * Enable smart field inference based on field names
   * @default true
   */
  smartInference?: boolean;
}

/**
 * Deep partial type for nested objects
 */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
