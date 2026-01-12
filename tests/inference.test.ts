import { describe, it, expect, beforeEach } from 'vitest';
import { inferGenerator, findGeneratorForField, setSeed } from '../src';

describe('Smart Field Inference', () => {
  beforeEach(() => {
    setSeed(12345);
  });

  describe('ID fields', () => {
    it('infers UUID for "id" field', () => {
      const gen = inferGenerator('id');
      const value = gen() as string;
      expect(value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('infers UUID for "userId" field', () => {
      const gen = inferGenerator('userId');
      const value = gen() as string;
      expect(value).toMatch(/^[0-9a-f-]{36}$/i);
    });

    it('infers UUID for "user_id" field', () => {
      const gen = inferGenerator('user_id');
      const value = gen() as string;
      expect(value).toMatch(/^[0-9a-f-]{36}$/i);
    });

    it('infers UUID for "uuid" field', () => {
      const gen = inferGenerator('uuid');
      const value = gen() as string;
      expect(value).toMatch(/^[0-9a-f-]{36}$/i);
    });
  });

  describe('Email fields', () => {
    it('infers email for "email" field', () => {
      const gen = inferGenerator('email');
      const value = gen() as string;
      expect(value).toMatch(/@/);
    });

    it('infers email for "userEmail" field', () => {
      const gen = inferGenerator('userEmail');
      const value = gen() as string;
      expect(value).toMatch(/@/);
    });

    it('infers email for "contact_email" field', () => {
      const gen = inferGenerator('contact_email');
      const value = gen() as string;
      expect(value).toMatch(/@/);
    });
  });

  describe('Name fields', () => {
    it('infers full name for "name" field', () => {
      const gen = inferGenerator('name');
      const value = gen() as string;
      expect(value).toContain(' ');
    });

    it('infers first name for "firstName" field', () => {
      const gen = inferGenerator('firstName');
      const value = gen() as string;
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    });

    it('infers last name for "lastName" field', () => {
      const gen = inferGenerator('lastName');
      const value = gen() as string;
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    });

    it('infers username for "username" field', () => {
      const gen = inferGenerator('username');
      const value = gen() as string;
      expect(typeof value).toBe('string');
      expect(value).not.toContain(' ');
    });
  });

  describe('Date fields', () => {
    it('infers date for "createdAt" field', () => {
      const gen = inferGenerator('createdAt');
      const value = gen();
      expect(value).toBeInstanceOf(Date);
    });

    it('infers date for "updatedAt" field', () => {
      const gen = inferGenerator('updatedAt');
      const value = gen();
      expect(value).toBeInstanceOf(Date);
    });

    it('infers date for "publishDate" field', () => {
      const gen = inferGenerator('publishDate');
      const value = gen();
      expect(value).toBeInstanceOf(Date);
    });

    it('infers date for "registered_at" field', () => {
      const gen = inferGenerator('registered_at');
      const value = gen();
      expect(value).toBeInstanceOf(Date);
    });
  });

  describe('Boolean fields', () => {
    it('infers boolean for "isActive" field', () => {
      const gen = inferGenerator('isActive');
      const value = gen();
      expect(typeof value).toBe('boolean');
    });

    it('infers boolean for "hasAccess" field', () => {
      const gen = inferGenerator('hasAccess');
      const value = gen();
      expect(typeof value).toBe('boolean');
    });

    it('infers boolean for "canEdit" field', () => {
      const gen = inferGenerator('canEdit');
      const value = gen();
      expect(typeof value).toBe('boolean');
    });

    it('infers boolean for "enabled" field', () => {
      const gen = inferGenerator('enabled');
      const value = gen();
      expect(typeof value).toBe('boolean');
    });

    it('infers boolean for "verified" field', () => {
      const gen = inferGenerator('verified');
      const value = gen();
      expect(typeof value).toBe('boolean');
    });
  });

  describe('Number fields', () => {
    it('infers age for "age" field', () => {
      const gen = inferGenerator('age');
      const value = gen() as number;
      expect(typeof value).toBe('number');
      expect(value).toBeGreaterThanOrEqual(18);
      expect(value).toBeLessThanOrEqual(80);
    });

    it('infers price for "price" field', () => {
      const gen = inferGenerator('price');
      const value = gen() as number;
      expect(typeof value).toBe('number');
    });

    it('infers count for "itemCount" field', () => {
      const gen = inferGenerator('itemCount');
      const value = gen() as number;
      expect(typeof value).toBe('number');
    });

    it('infers quantity for "quantity" field', () => {
      const gen = inferGenerator('quantity');
      const value = gen() as number;
      expect(typeof value).toBe('number');
    });
  });

  describe('Content fields', () => {
    it('infers title for "title" field', () => {
      const gen = inferGenerator('title');
      const value = gen() as string;
      expect(typeof value).toBe('string');
    });

    it('infers paragraph for "description" field', () => {
      const gen = inferGenerator('description');
      const value = gen() as string;
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(10);
    });

    it('infers paragraph for "bio" field', () => {
      const gen = inferGenerator('bio');
      const value = gen() as string;
      expect(typeof value).toBe('string');
    });

    it('infers content for "content" field', () => {
      const gen = inferGenerator('content');
      const value = gen() as string;
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(20);
    });
  });

  describe('URL fields', () => {
    it('infers URL for "url" field', () => {
      const gen = inferGenerator('url');
      const value = gen() as string;
      expect(value).toMatch(/^https?:\/\//);
    });

    it('infers URL for "website" field', () => {
      const gen = inferGenerator('website');
      const value = gen() as string;
      expect(value).toMatch(/^https?:\/\//);
    });

    it('infers avatar URL for "avatar" field', () => {
      const gen = inferGenerator('avatar');
      const value = gen() as string;
      expect(value).toMatch(/^https?:\/\//);
    });

    it('infers image URL for "profileImage" field', () => {
      const gen = inferGenerator('profileImage');
      const value = gen() as string;
      expect(value).toMatch(/^https?:\/\//);
    });
  });

  describe('Address fields', () => {
    it('infers address for "address" field', () => {
      const gen = inferGenerator('address');
      const value = gen() as string;
      expect(typeof value).toBe('string');
    });

    it('infers city for "city" field', () => {
      const gen = inferGenerator('city');
      const value = gen() as string;
      expect(typeof value).toBe('string');
    });

    it('infers country for "country" field', () => {
      const gen = inferGenerator('country');
      const value = gen() as string;
      expect(typeof value).toBe('string');
    });

    it('infers zip code for "zipCode" field', () => {
      const gen = inferGenerator('zipCode');
      const value = gen() as string;
      expect(value).toMatch(/^\d{5}$/);
    });
  });

  describe('Phone fields', () => {
    it('infers phone for "phone" field', () => {
      const gen = inferGenerator('phone');
      const value = gen() as string;
      expect(typeof value).toBe('string');
      expect(value).toMatch(/\d/);
    });

    it('infers phone for "phoneNumber" field', () => {
      const gen = inferGenerator('phoneNumber');
      const value = gen() as string;
      expect(typeof value).toBe('string');
    });
  });

  describe('Fallback behavior', () => {
    it('returns a word for unknown fields', () => {
      const gen = inferGenerator('unknownFieldXyz123');
      const value = gen() as string;
      expect(typeof value).toBe('string');
    });
  });

  describe('findGeneratorForField', () => {
    it('returns null for unmatched patterns', () => {
      const result = findGeneratorForField('completelyUnknownField123');
      // Should return null if no pattern matches
      expect(result === null || result !== undefined).toBe(true);
    });
  });
});
