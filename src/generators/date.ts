/**
 * Date generators
 */

import { randomInt } from '../utils/random';
import type { Generator, DateOptions } from './types';

// Default date range: 5 years ago to now
const FIVE_YEARS_MS = 5 * 365 * 24 * 60 * 60 * 1000;

/**
 * Generate a random date
 */
export function date(options: DateOptions = {}): Generator<Date> {
  const now = Date.now();
  const {
    min = new Date(now - FIVE_YEARS_MS),
    max = new Date(now),
  } = options;

  return () => {
    const minTime = min.getTime();
    const maxTime = max.getTime();
    return new Date(randomInt(minTime, maxTime));
  };
}

/**
 * Generate a past date (before now)
 */
export function pastDate(yearsBack = 5): Generator<Date> {
  return () => {
    const now = Date.now();
    const pastMs = yearsBack * 365 * 24 * 60 * 60 * 1000;
    return new Date(randomInt(now - pastMs, now));
  };
}

/**
 * Generate a future date (after now)
 */
export function futureDate(yearsAhead = 5): Generator<Date> {
  return () => {
    const now = Date.now();
    const futureMs = yearsAhead * 365 * 24 * 60 * 60 * 1000;
    return new Date(randomInt(now, now + futureMs));
  };
}

/**
 * Generate a recent date (within last N days)
 */
export function recentDate(days = 30): Generator<Date> {
  return () => {
    const now = Date.now();
    const recentMs = days * 24 * 60 * 60 * 1000;
    return new Date(randomInt(now - recentMs, now));
  };
}

/**
 * Generate a soon date (within next N days)
 */
export function soonDate(days = 30): Generator<Date> {
  return () => {
    const now = Date.now();
    const soonMs = days * 24 * 60 * 60 * 1000;
    return new Date(randomInt(now, now + soonMs));
  };
}

/**
 * Generate a birth date (for typical adult ages 18-80)
 */
export function birthDate(minAge = 18, maxAge = 80): Generator<Date> {
  return () => {
    const now = new Date();
    const year = now.getFullYear() - randomInt(minAge, maxAge);
    const month = randomInt(0, 11);
    const day = randomInt(1, 28); // Safe for all months
    return new Date(year, month, day);
  };
}

/**
 * Generate a timestamp (Unix timestamp in milliseconds)
 */
export function timestamp(options: DateOptions = {}): Generator<number> {
  return () => date(options)().getTime();
}

/**
 * Generate an ISO date string
 */
export function isoDate(options: DateOptions = {}): Generator<string> {
  return () => date(options)().toISOString();
}
