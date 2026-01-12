import { describe, it, expect, beforeEach } from 'vitest';
import {
  gen,
  uuid,
  email,
  firstName,
  lastName,
  fullName,
  username,
  phone,
  url,
  address,
  city,
  country,
  zipCode,
  number,
  int,
  float,
  age,
  price,
  boolean,
  date,
  pastDate,
  futureDate,
  string,
  word,
  words,
  sentence,
  paragraph,
  title,
  slug,
  pattern,
  array,
  oneOf,
  sequence,
  constant,
  setSeed,
} from '../src';

describe('Generators', () => {
  beforeEach(() => {
    setSeed(12345); // Reset seed for deterministic tests
  });

  describe('UUID', () => {
    it('generates valid UUID v4 format', () => {
      const id = uuid()();
      expect(id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    it('generates unique UUIDs', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        ids.add(uuid()());
      }
      expect(ids.size).toBe(100);
    });
  });

  describe('Email', () => {
    it('generates valid email format', () => {
      const emailAddr = email()();
      expect(emailAddr).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it('generates realistic looking emails', () => {
      const emailAddr = email()();
      expect(emailAddr.includes('@')).toBe(true);
      expect(emailAddr.includes('.')).toBe(true);
    });
  });

  describe('Names', () => {
    it('generates first names', () => {
      const name = firstName()();
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(0);
    });

    it('generates last names', () => {
      const name = lastName()();
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(0);
    });

    it('generates full names with space', () => {
      const name = fullName()();
      expect(name).toContain(' ');
      const parts = name.split(' ');
      expect(parts.length).toBe(2);
    });

    it('generates usernames', () => {
      const user = username()();
      expect(typeof user).toBe('string');
      expect(user.length).toBeGreaterThan(0);
      // Should not contain spaces
      expect(user).not.toContain(' ');
    });
  });

  describe('Phone', () => {
    it('generates phone numbers', () => {
      const phoneNum = phone()();
      expect(typeof phoneNum).toBe('string');
      // Should contain digits
      expect(phoneNum).toMatch(/\d/);
    });
  });

  describe('URL', () => {
    it('generates valid URLs', () => {
      const urlStr = url()();
      expect(urlStr).toMatch(/^https?:\/\/.+/);
    });
  });

  describe('Address', () => {
    it('generates addresses', () => {
      const addr = address()();
      expect(typeof addr).toBe('string');
      expect(addr.length).toBeGreaterThan(0);
    });

    it('generates cities', () => {
      const cityName = city()();
      expect(typeof cityName).toBe('string');
    });

    it('generates countries', () => {
      const countryName = country()();
      expect(typeof countryName).toBe('string');
    });

    it('generates zip codes', () => {
      const zip = zipCode()();
      expect(zip).toMatch(/^\d{5}$/);
    });
  });

  describe('Numbers', () => {
    it('generates integers in range', () => {
      const gen = number({ min: 10, max: 20 });
      for (let i = 0; i < 100; i++) {
        const num = gen();
        expect(num).toBeGreaterThanOrEqual(10);
        expect(num).toBeLessThanOrEqual(20);
        expect(Number.isInteger(num)).toBe(true);
      }
    });

    it('int is alias for number', () => {
      const gen = int({ min: 0, max: 100 });
      const num = gen();
      expect(Number.isInteger(num)).toBe(true);
    });

    it('generates floats with decimals', () => {
      const gen = float({ min: 0, max: 10, decimals: 2 });
      const num = gen();
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThanOrEqual(10);
      // Check decimals
      const decimalPlaces = (num.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });

    it('generates ages in realistic range', () => {
      const gen = age();
      for (let i = 0; i < 50; i++) {
        const a = gen();
        expect(a).toBeGreaterThanOrEqual(18);
        expect(a).toBeLessThanOrEqual(80);
      }
    });

    it('generates prices', () => {
      const gen = price();
      const p = gen();
      expect(p).toBeGreaterThanOrEqual(0.99);
      expect(p).toBeLessThanOrEqual(999.99);
    });
  });

  describe('Boolean', () => {
    it('generates booleans', () => {
      const gen = boolean();
      const results = new Set<boolean>();
      for (let i = 0; i < 100; i++) {
        results.add(gen());
      }
      // Should have both true and false
      expect(results.size).toBe(2);
    });

    it('respects probability', () => {
      const alwaysTrue = boolean(1);
      for (let i = 0; i < 10; i++) {
        expect(alwaysTrue()).toBe(true);
      }

      const alwaysFalse = boolean(0);
      for (let i = 0; i < 10; i++) {
        expect(alwaysFalse()).toBe(false);
      }
    });
  });

  describe('Date', () => {
    it('generates dates', () => {
      const gen = date();
      const d = gen();
      expect(d).toBeInstanceOf(Date);
    });

    it('generates past dates', () => {
      const gen = pastDate();
      const d = gen();
      expect(d.getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('generates future dates', () => {
      const gen = futureDate();
      const d = gen();
      expect(d.getTime()).toBeGreaterThanOrEqual(Date.now());
    });

    it('respects min/max bounds', () => {
      const min = new Date('2020-01-01');
      const max = new Date('2020-12-31');
      const gen = date({ min, max });

      for (let i = 0; i < 50; i++) {
        const d = gen();
        expect(d.getTime()).toBeGreaterThanOrEqual(min.getTime());
        expect(d.getTime()).toBeLessThanOrEqual(max.getTime());
      }
    });
  });

  describe('Strings', () => {
    it('generates strings of specified length', () => {
      const gen = string({ length: 10 });
      const str = gen();
      expect(str.length).toBe(10);
    });

    it('generates alphanumeric strings', () => {
      const gen = string({ length: 20, charset: 'alphanumeric' });
      const str = gen();
      expect(str).toMatch(/^[a-zA-Z0-9]+$/);
    });

    it('generates hex strings', () => {
      const gen = string({ length: 16, charset: 'hex' });
      const str = gen();
      expect(str).toMatch(/^[0-9a-f]+$/);
    });

    it('generates words', () => {
      const w = word()();
      expect(typeof w).toBe('string');
      expect(w.length).toBeGreaterThan(0);
    });

    it('generates multiple words', () => {
      const w = words(5)();
      const wordList = w.split(' ');
      expect(wordList.length).toBe(5);
    });

    it('generates sentences', () => {
      const s = sentence()();
      expect(s.endsWith('.')).toBe(true);
      // First letter should be capitalized
      expect(s[0]).toBe(s[0].toUpperCase());
    });

    it('generates paragraphs', () => {
      const p = paragraph()();
      expect(typeof p).toBe('string');
      expect(p.length).toBeGreaterThan(0);
    });

    it('generates titles', () => {
      const t = title()();
      // All words should be capitalized
      const titleWords = t.split(' ');
      for (const w of titleWords) {
        expect(w[0]).toBe(w[0].toUpperCase());
      }
    });

    it('generates slugs', () => {
      const s = slug()();
      expect(s).toMatch(/^[a-z0-9-]+$/);
    });
  });

  describe('Pattern', () => {
    it('generates from pattern with digits', () => {
      const gen = pattern('###-###');
      const result = gen();
      expect(result).toMatch(/^\d{3}-\d{3}$/);
    });

    it('generates from pattern with letters', () => {
      const gen = pattern('AAA-aaa');
      const result = gen();
      expect(result).toMatch(/^[A-Z]{3}-[a-z]{3}$/);
    });

    it('preserves literal characters', () => {
      const gen = pattern('ID-####');
      const result = gen();
      expect(result).toMatch(/^ID-\d{4}$/);
    });
  });

  describe('Arrays', () => {
    it('generates arrays of specified length', () => {
      const gen = array(uuid(), { length: 5 });
      const arr = gen();
      expect(arr.length).toBe(5);
    });

    it('generates arrays within min/max range', () => {
      const gen = array(number(), { min: 2, max: 5 });
      for (let i = 0; i < 50; i++) {
        const arr = gen();
        expect(arr.length).toBeGreaterThanOrEqual(2);
        expect(arr.length).toBeLessThanOrEqual(5);
      }
    });

    it('uses the provided generator for each element', () => {
      const gen = array(uuid(), { length: 3 });
      const arr = gen();
      for (const item of arr) {
        expect(item).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        );
      }
    });
  });

  describe('oneOf (enum)', () => {
    it('picks from provided values', () => {
      const values = ['red', 'green', 'blue'] as const;
      const gen = oneOf(values);

      for (let i = 0; i < 50; i++) {
        const result = gen();
        expect(values).toContain(result);
      }
    });

    it('gen.enum works the same', () => {
      const values = ['a', 'b', 'c'] as const;
      const result = gen.enum(values)();
      expect(values).toContain(result);
    });
  });

  describe('Sequence', () => {
    it('generates sequential values', () => {
      const gen = sequence((n) => `item-${n}`);
      expect(gen()).toBe('item-1');
      expect(gen()).toBe('item-2');
      expect(gen()).toBe('item-3');
    });

    it('works with numbers', () => {
      const gen = sequence((n) => n * 10);
      expect(gen()).toBe(10);
      expect(gen()).toBe(20);
      expect(gen()).toBe(30);
    });
  });

  describe('Constant', () => {
    it('always returns the same value', () => {
      const gen = constant('fixed-value');
      for (let i = 0; i < 10; i++) {
        expect(gen()).toBe('fixed-value');
      }
    });
  });

  describe('Deterministic generation with seed', () => {
    it('produces same results with same seed', () => {
      setSeed(99999);
      const result1 = uuid()();

      setSeed(99999);
      const result2 = uuid()();

      expect(result1).toBe(result2);
    });
  });
});
