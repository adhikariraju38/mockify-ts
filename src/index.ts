/**
 * mockify-ts - Lightweight TypeScript mock data factory with smart field inference
 *
 * @example
 * ```typescript
 * import { factory, gen } from 'mockify-ts';
 *
 * interface User {
 *   id: string;
 *   email: string;
 *   name: string;
 *   age: number;
 *   isActive: boolean;
 * }
 *
 * // Create a factory with smart inference
 * const userFactory = factory<User>(['id', 'email', 'name', 'age', 'isActive']);
 *
 * // Or with explicit generators
 * const userFactory = factory<User>({
 *   id: gen.uuid(),
 *   email: gen.email(),
 *   name: gen.fullName(),
 *   age: gen.age(),
 *   isActive: gen.boolean(),
 * });
 *
 * // Build mock data
 * const user = userFactory.build();
 * const users = userFactory.buildMany(5);
 *
 * // With overrides
 * const admin = userFactory.build({ email: 'admin@test.com' });
 *
 * // With traits
 * const factoryWithTraits = userFactory
 *   .trait('admin', { role: 'admin' })
 *   .trait('inactive', { isActive: false });
 *
 * const adminUser = factoryWithTraits.build('admin');
 * ```
 *
 * @packageDocumentation
 */

// Factory
export { factory, autoFactory } from './factory';
export type {
  FactorySchema,
  BuildOverride,
  TraitDefinition,
  BuildOptions,
  IFactory,
  FactoryConfig,
} from './factory';

// Generators
export { gen } from './generators';
export * from './generators';

// Inference
export { inferGenerator, findGeneratorForField } from './inference';

// Random utilities (for advanced usage)
export {
  setSeed,
  getSeed,
  resetSeed,
  createSeededRandom,
} from './utils/random';
