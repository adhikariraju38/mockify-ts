/**
 * Factory implementation - the heart of mockify-ts
 */

import { inferGenerator } from '../inference';
import { setSeed, resetSeed } from '../utils/random';
import type {
  FactorySchema,
  BuildOverride,
  TraitDefinition,
  BuildOptions,
  IFactory,
  FactoryConfig,
} from './types';

/**
 * Resolve a field definition to its value
 */
function resolveValue<T>(definition: unknown): T {
  if (typeof definition === 'function') {
    return (definition as () => T)();
  }
  return definition as T;
}

/**
 * Deep merge two objects
 */
function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = target[key];

      if (
        sourceValue !== null &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue !== null &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        ) as T[Extract<keyof T, string>];
      } else {
        result[key] = sourceValue as T[Extract<keyof T, string>];
      }
    }
  }

  return result;
}

/**
 * Factory class for creating mock data
 */
class Factory<T extends object> implements IFactory<T> {
  private schema: FactorySchema<T>;
  private traits: Map<string, TraitDefinition<T>> = new Map();
  private fieldNames: (keyof T)[];
  private config: FactoryConfig;

  constructor(
    schema: FactorySchema<T> = {},
    fieldNames: (keyof T)[] = [],
    config: FactoryConfig = {}
  ) {
    this.schema = schema;
    this.fieldNames = fieldNames;
    this.config = { smartInference: true, ...config };
  }

  /**
   * Build a single instance
   */
  build(overrideOrTrait?: BuildOverride<T> | string, overrideOrOptions?: BuildOverride<T> | BuildOptions, maybeOptions?: BuildOptions): T {
    let traitName: string | undefined;
    let override: BuildOverride<T> = {};
    let options: BuildOptions = {};

    // Parse arguments
    if (typeof overrideOrTrait === 'string') {
      traitName = overrideOrTrait;
      override = (overrideOrOptions as BuildOverride<T>) || {};
      options = maybeOptions || {};
    } else {
      override = overrideOrTrait || {};
      options = (overrideOrOptions as BuildOptions) || {};
    }

    // Handle seed
    if (options.seed !== undefined) {
      setSeed(options.seed);
    }

    // Get trait definitions if specified
    const traitDefs: TraitDefinition<T> = traitName ? this.traits.get(traitName) || {} : {};

    // Build the object
    const result = {} as T;

    // Get all field names (from schema, traits, override, and inferred)
    const allFields = new Set([
      ...Object.keys(this.schema),
      ...Object.keys(traitDefs),
      ...Object.keys(override),
      ...this.fieldNames.map(String),
    ]);

    for (const fieldName of allFields) {
      const key = fieldName as keyof T;

      // Priority: override > trait > schema > inference
      if (key in override) {
        result[key] = resolveValue(override[key]);
      } else if (key in traitDefs && traitDefs[key] !== undefined) {
        result[key] = resolveValue(traitDefs[key]);
      } else if (key in this.schema && this.schema[key] !== undefined) {
        result[key] = resolveValue(this.schema[key]);
      } else if (this.config.smartInference) {
        // Use smart inference based on field name
        const generator = inferGenerator(String(key));
        result[key] = generator() as T[keyof T];
      }
    }

    // Reset seed state after building
    if (options.seed !== undefined) {
      resetSeed();
    }

    return result;
  }

  /**
   * Build multiple instances
   */
  buildMany(count: number, overrideOrTrait?: BuildOverride<T> | string, overrideOrOptions?: BuildOverride<T> | BuildOptions, maybeOptions?: BuildOptions): T[] {
    const results: T[] = [];

    for (let i = 0; i < count; i++) {
      results.push(this.build(overrideOrTrait as string, overrideOrOptions as BuildOverride<T>, maybeOptions));
    }

    return results;
  }

  /**
   * Define a trait (named variant)
   */
  trait(name: string, definition: TraitDefinition<T>): Factory<T> {
    // Return a new factory with the trait added (immutable)
    const newFactory = new Factory<T>(this.schema, this.fieldNames, this.config);
    newFactory.traits = new Map(this.traits);
    newFactory.traits.set(name, definition);
    return newFactory;
  }

  /**
   * Extend this factory with additional defaults
   */
  extend(schema: FactorySchema<T>): Factory<T> {
    const mergedSchema = deepMerge(this.schema as Record<string, unknown>, schema as Record<string, unknown>) as FactorySchema<T>;
    const newFactory = new Factory<T>(mergedSchema, this.fieldNames, this.config);
    newFactory.traits = new Map(this.traits);
    return newFactory;
  }

  /**
   * Reset sequence counters (for generators that use sequences)
   */
  resetSequences(): void {
    // Sequences are typically managed within generators
    // This is a placeholder for future implementation
    resetSeed();
  }
}

/**
 * Create a factory for a type
 *
 * @example
 * ```typescript
 * interface User {
 *   id: string;
 *   email: string;
 *   name: string;
 * }
 *
 * // Basic usage - fields auto-inferred from names
 * const userFactory = factory<User>(['id', 'email', 'name']);
 *
 * // With explicit generators
 * const userFactory = factory<User>({
 *   id: gen.uuid(),
 *   email: gen.email(),
 *   name: gen.fullName(),
 * });
 *
 * // Build instances
 * const user = userFactory.build();
 * const users = userFactory.buildMany(5);
 *
 * // With overrides
 * const admin = userFactory.build({ email: 'admin@test.com' });
 *
 * // With traits
 * const userFactoryWithTraits = userFactory
 *   .trait('admin', { role: 'admin' })
 *   .trait('inactive', { isActive: false });
 *
 * const adminUser = userFactoryWithTraits.build('admin');
 * ```
 */
export function factory<T extends object>(
  schemaOrFields?: FactorySchema<T> | (keyof T)[],
  config?: FactoryConfig
): Factory<T> {
  if (Array.isArray(schemaOrFields)) {
    // Field names provided - use smart inference
    return new Factory<T>({}, schemaOrFields, config);
  }

  // Schema provided
  return new Factory<T>(schemaOrFields || {}, [], config);
}

/**
 * Create a factory with smart inference enabled
 * Alias for factory() with smartInference: true
 */
export function autoFactory<T extends object>(
  fields: (keyof T)[]
): Factory<T> {
  return factory<T>(fields, { smartInference: true });
}

// Re-export types
export type { FactorySchema, BuildOverride, TraitDefinition, BuildOptions, IFactory, FactoryConfig } from './types';
