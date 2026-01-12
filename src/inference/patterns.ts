/**
 * Smart field name patterns for automatic generator inference
 */

import { gen } from '../generators';
import type { Generator } from '../generators/types';

/**
 * Pattern definition - regex pattern and corresponding generator
 */
interface PatternDefinition {
  pattern: RegExp;
  generator: () => Generator<unknown>;
  priority: number; // Higher = checked first
}

/**
 * Field name patterns mapped to generators
 * Patterns are checked in priority order (highest first)
 */
export const FIELD_PATTERNS: PatternDefinition[] = [
  // UUIDs - highest priority for exact matches
  { pattern: /^id$/i, generator: () => gen.uuid(), priority: 100 },
  { pattern: /^uuid$/i, generator: () => gen.uuid(), priority: 100 },
  { pattern: /Id$/i, generator: () => gen.uuid(), priority: 90 },
  { pattern: /_id$/i, generator: () => gen.uuid(), priority: 90 },

  // Email
  { pattern: /^email$/i, generator: () => gen.email(), priority: 95 },
  { pattern: /Email$/i, generator: () => gen.email(), priority: 85 },
  { pattern: /_email$/i, generator: () => gen.email(), priority: 85 },

  // Names
  { pattern: /^firstName$/i, generator: () => gen.firstName(), priority: 95 },
  { pattern: /^first_name$/i, generator: () => gen.firstName(), priority: 95 },
  { pattern: /^lastName$/i, generator: () => gen.lastName(), priority: 95 },
  { pattern: /^last_name$/i, generator: () => gen.lastName(), priority: 95 },
  { pattern: /^fullName$/i, generator: () => gen.fullName(), priority: 95 },
  { pattern: /^full_name$/i, generator: () => gen.fullName(), priority: 95 },
  { pattern: /^name$/i, generator: () => gen.fullName(), priority: 90 },
  { pattern: /^username$/i, generator: () => gen.username(), priority: 95 },
  { pattern: /^user_name$/i, generator: () => gen.username(), priority: 95 },

  // Phone
  { pattern: /^phone$/i, generator: () => gen.phone(), priority: 95 },
  { pattern: /^phoneNumber$/i, generator: () => gen.phone(), priority: 95 },
  { pattern: /^phone_number$/i, generator: () => gen.phone(), priority: 95 },
  { pattern: /Phone$/i, generator: () => gen.phone(), priority: 85 },

  // URLs
  { pattern: /^url$/i, generator: () => gen.url(), priority: 95 },
  { pattern: /Url$/i, generator: () => gen.url(), priority: 85 },
  { pattern: /^link$/i, generator: () => gen.url(), priority: 90 },
  { pattern: /^href$/i, generator: () => gen.url(), priority: 90 },
  { pattern: /^website$/i, generator: () => gen.url(), priority: 90 },
  { pattern: /^avatar$/i, generator: () => gen.avatarUrl(), priority: 95 },
  { pattern: /^avatarUrl$/i, generator: () => gen.avatarUrl(), priority: 95 },
  { pattern: /^image$/i, generator: () => gen.imageUrl(), priority: 90 },
  { pattern: /Image$/i, generator: () => gen.imageUrl(), priority: 85 },
  { pattern: /^imageUrl$/i, generator: () => gen.imageUrl(), priority: 95 },
  { pattern: /^thumbnail$/i, generator: () => gen.imageUrl(150, 150), priority: 90 },

  // Dates - check these before generic patterns
  { pattern: /^createdAt$/i, generator: () => gen.pastDate(), priority: 95 },
  { pattern: /^created_at$/i, generator: () => gen.pastDate(), priority: 95 },
  { pattern: /^updatedAt$/i, generator: () => gen.recentDate(), priority: 95 },
  { pattern: /^updated_at$/i, generator: () => gen.recentDate(), priority: 95 },
  { pattern: /^deletedAt$/i, generator: () => gen.recentDate(), priority: 95 },
  { pattern: /^deleted_at$/i, generator: () => gen.recentDate(), priority: 95 },
  { pattern: /^publishedAt$/i, generator: () => gen.pastDate(), priority: 95 },
  { pattern: /^published_at$/i, generator: () => gen.pastDate(), priority: 95 },
  { pattern: /^expiresAt$/i, generator: () => gen.futureDate(), priority: 95 },
  { pattern: /^expires_at$/i, generator: () => gen.futureDate(), priority: 95 },
  { pattern: /^birthDate$/i, generator: () => gen.birthDate(), priority: 95 },
  { pattern: /^birth_date$/i, generator: () => gen.birthDate(), priority: 95 },
  { pattern: /^dateOfBirth$/i, generator: () => gen.birthDate(), priority: 95 },
  { pattern: /^dob$/i, generator: () => gen.birthDate(), priority: 95 },
  { pattern: /^date$/i, generator: () => gen.date(), priority: 85 },
  { pattern: /Date$/i, generator: () => gen.date(), priority: 80 },
  { pattern: /At$/i, generator: () => gen.date(), priority: 75 },
  { pattern: /_at$/i, generator: () => gen.date(), priority: 75 },

  // Timestamps
  { pattern: /^timestamp$/i, generator: () => gen.timestamp(), priority: 95 },
  { pattern: /Timestamp$/i, generator: () => gen.timestamp(), priority: 85 },

  // Content
  { pattern: /^title$/i, generator: () => gen.title(), priority: 95 },
  { pattern: /Title$/i, generator: () => gen.title(), priority: 85 },
  { pattern: /^headline$/i, generator: () => gen.title(), priority: 90 },
  { pattern: /^subject$/i, generator: () => gen.title(), priority: 85 },
  { pattern: /^description$/i, generator: () => gen.paragraph(), priority: 95 },
  { pattern: /^bio$/i, generator: () => gen.paragraph(), priority: 95 },
  { pattern: /^summary$/i, generator: () => gen.paragraph(), priority: 95 },
  { pattern: /^about$/i, generator: () => gen.paragraph(), priority: 90 },
  { pattern: /^content$/i, generator: () => gen.lorem(100), priority: 95 },
  { pattern: /^body$/i, generator: () => gen.lorem(100), priority: 95 },
  { pattern: /^text$/i, generator: () => gen.sentence(), priority: 85 },
  { pattern: /^message$/i, generator: () => gen.sentence(), priority: 90 },
  { pattern: /^comment$/i, generator: () => gen.sentence(), priority: 90 },

  // Numbers with specific meanings
  { pattern: /^age$/i, generator: () => gen.age(), priority: 95 },
  { pattern: /^price$/i, generator: () => gen.price(), priority: 95 },
  { pattern: /Price$/i, generator: () => gen.price(), priority: 85 },
  { pattern: /^amount$/i, generator: () => gen.price(), priority: 90 },
  { pattern: /^cost$/i, generator: () => gen.price(), priority: 90 },
  { pattern: /^quantity$/i, generator: () => gen.quantity(), priority: 95 },
  { pattern: /^qty$/i, generator: () => gen.quantity(), priority: 95 },
  { pattern: /^count$/i, generator: () => gen.count(), priority: 90 },
  { pattern: /Count$/i, generator: () => gen.count(), priority: 85 },
  { pattern: /^total$/i, generator: () => gen.count(), priority: 85 },
  { pattern: /^rating$/i, generator: () => gen.rating(), priority: 95 },
  { pattern: /^score$/i, generator: () => gen.rating(), priority: 90 },
  { pattern: /^percentage$/i, generator: () => gen.percentage(), priority: 95 },
  { pattern: /^percent$/i, generator: () => gen.percentage(), priority: 90 },

  // Booleans
  { pattern: /^is[A-Z]/, generator: () => gen.boolean(), priority: 95 },
  { pattern: /^has[A-Z]/, generator: () => gen.boolean(), priority: 95 },
  { pattern: /^can[A-Z]/, generator: () => gen.boolean(), priority: 95 },
  { pattern: /^should[A-Z]/, generator: () => gen.boolean(), priority: 90 },
  { pattern: /^will[A-Z]/, generator: () => gen.boolean(), priority: 90 },
  { pattern: /Active$/i, generator: () => gen.boolean(), priority: 85 },
  { pattern: /^enabled$/i, generator: () => gen.boolean(), priority: 95 },
  { pattern: /^disabled$/i, generator: () => gen.boolean(), priority: 95 },
  { pattern: /^visible$/i, generator: () => gen.boolean(), priority: 95 },
  { pattern: /^hidden$/i, generator: () => gen.boolean(), priority: 95 },
  { pattern: /^verified$/i, generator: () => gen.boolean(), priority: 95 },
  { pattern: /^active$/i, generator: () => gen.boolean(), priority: 95 },
  { pattern: /^completed$/i, generator: () => gen.boolean(), priority: 95 },
  { pattern: /^published$/i, generator: () => gen.boolean(), priority: 95 },

  // Address
  { pattern: /^address$/i, generator: () => gen.address(), priority: 95 },
  { pattern: /Address$/i, generator: () => gen.address(), priority: 85 },
  { pattern: /^street$/i, generator: () => gen.address(), priority: 90 },
  { pattern: /^city$/i, generator: () => gen.city(), priority: 95 },
  { pattern: /^country$/i, generator: () => gen.country(), priority: 95 },
  { pattern: /^zip$/i, generator: () => gen.zipCode(), priority: 95 },
  { pattern: /^zipCode$/i, generator: () => gen.zipCode(), priority: 95 },
  { pattern: /^zip_code$/i, generator: () => gen.zipCode(), priority: 95 },
  { pattern: /^postalCode$/i, generator: () => gen.zipCode(), priority: 95 },
  { pattern: /^postal_code$/i, generator: () => gen.zipCode(), priority: 95 },

  // Company/Organization
  { pattern: /^company$/i, generator: () => gen.company(), priority: 95 },
  { pattern: /^companyName$/i, generator: () => gen.company(), priority: 95 },
  { pattern: /^organization$/i, generator: () => gen.company(), priority: 90 },

  // Technical
  { pattern: /^domain$/i, generator: () => gen.domain(), priority: 95 },
  { pattern: /^ip$/i, generator: () => gen.ipv4(), priority: 95 },
  { pattern: /^ipAddress$/i, generator: () => gen.ipv4(), priority: 95 },
  { pattern: /^ip_address$/i, generator: () => gen.ipv4(), priority: 95 },
  { pattern: /^mac$/i, generator: () => gen.macAddress(), priority: 95 },
  { pattern: /^macAddress$/i, generator: () => gen.macAddress(), priority: 95 },
  { pattern: /^color$/i, generator: () => gen.hexColor(), priority: 95 },
  { pattern: /Color$/i, generator: () => gen.hexColor(), priority: 85 },

  // Slug
  { pattern: /^slug$/i, generator: () => gen.slug(), priority: 95 },
  { pattern: /^handle$/i, generator: () => gen.slug(), priority: 90 },

  // Version
  { pattern: /^version$/i, generator: () => gen.pattern('#.#.#'), priority: 90 },

  // Token/Key
  { pattern: /^token$/i, generator: () => gen.string({ length: 32, charset: 'hex' }), priority: 90 },
  { pattern: /^key$/i, generator: () => gen.string({ length: 32, charset: 'alphanumeric' }), priority: 85 },
  { pattern: /^apiKey$/i, generator: () => gen.string({ length: 32, charset: 'alphanumeric' }), priority: 95 },
  { pattern: /^api_key$/i, generator: () => gen.string({ length: 32, charset: 'alphanumeric' }), priority: 95 },
  { pattern: /^secret$/i, generator: () => gen.string({ length: 64, charset: 'hex' }), priority: 90 },

].sort((a, b) => b.priority - a.priority);

/**
 * Find the best matching generator for a field name
 */
export function findGeneratorForField(fieldName: string): Generator<unknown> | null {
  for (const { pattern, generator } of FIELD_PATTERNS) {
    if (pattern.test(fieldName)) {
      return generator();
    }
  }
  return null;
}
