/**
 * Seeded Pseudo-Random Number Generator using Mulberry32 algorithm
 * Provides deterministic random generation for reproducible tests
 */

let globalSeed = Date.now();
let currentState = globalSeed;

/**
 * Mulberry32 PRNG - fast, simple, and has good statistical properties
 */
function mulberry32(seed: number): number {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/**
 * Get the next random number between 0 and 1
 */
export function random(): number {
  currentState = (currentState * 1103515245 + 12345) & 0x7fffffff;
  return mulberry32(currentState);
}

/**
 * Set the global seed for reproducible generation
 */
export function setSeed(seed: number): void {
  globalSeed = seed;
  currentState = seed;
}

/**
 * Get current seed
 */
export function getSeed(): number {
  return globalSeed;
}

/**
 * Reset to initial seed
 */
export function resetSeed(): void {
  currentState = globalSeed;
}

/**
 * Generate random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

/**
 * Generate random float between min and max
 */
export function randomFloat(min: number, max: number, decimals = 2): number {
  const value = random() * (max - min) + min;
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Pick a random element from an array
 */
export function randomPick<T>(array: readonly T[]): T {
  return array[randomInt(0, array.length - 1)];
}

/**
 * Pick multiple unique random elements from an array
 */
export function randomPickMany<T>(array: readonly T[], count: number): T[] {
  const shuffled = [...array].sort(() => random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Shuffle an array
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generate a random boolean
 */
export function randomBoolean(): boolean {
  return random() < 0.5;
}

/**
 * Create a scoped random generator with its own seed
 */
export function createSeededRandom(seed: number) {
  let state = seed;

  return {
    random(): number {
      state = (state * 1103515245 + 12345) & 0x7fffffff;
      return mulberry32(state);
    },
    randomInt(min: number, max: number): number {
      return Math.floor(this.random() * (max - min + 1)) + min;
    },
    randomFloat(min: number, max: number, decimals = 2): number {
      const value = this.random() * (max - min) + min;
      const factor = Math.pow(10, decimals);
      return Math.round(value * factor) / factor;
    },
    randomPick<T>(array: readonly T[]): T {
      return array[this.randomInt(0, array.length - 1)];
    },
    randomBoolean(): boolean {
      return this.random() < 0.5;
    },
    reset(): void {
      state = seed;
    },
  };
}
