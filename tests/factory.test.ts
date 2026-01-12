import { describe, it, expect, beforeEach } from 'vitest';
import { factory, gen, setSeed } from '../src';

interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  isActive: boolean;
  createdAt: Date;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  tags: string[];
  publishedAt: Date;
}

interface ApiResponse<T> {
  data: T;
  meta: {
    page: number;
    total: number;
    hasMore: boolean;
  };
  errors: Array<{ code: string; message: string }>;
}

describe('Factory', () => {
  beforeEach(() => {
    setSeed(12345);
  });

  describe('Basic factory creation', () => {
    it('creates factory with explicit generators', () => {
      const userFactory = factory<User>({
        id: gen.uuid(),
        email: gen.email(),
        name: gen.fullName(),
        age: gen.age(),
        isActive: gen.boolean(),
        createdAt: gen.date(),
      });

      const user = userFactory.build();

      expect(user.id).toMatch(/^[0-9a-f-]{36}$/i);
      expect(user.email).toMatch(/@/);
      expect(typeof user.name).toBe('string');
      expect(user.age).toBeGreaterThanOrEqual(18);
      expect(user.age).toBeLessThanOrEqual(80);
      expect(typeof user.isActive).toBe('boolean');
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('creates factory with field names (smart inference)', () => {
      const userFactory = factory<User>(['id', 'email', 'name', 'age', 'isActive', 'createdAt']);

      const user = userFactory.build();

      expect(user.id).toBeDefined();
      expect(user.email).toMatch(/@/);
      expect(typeof user.name).toBe('string');
      expect(typeof user.age).toBe('number');
      expect(typeof user.isActive).toBe('boolean');
    });
  });

  describe('build()', () => {
    it('builds a single instance', () => {
      const userFactory = factory<User>({
        id: gen.uuid(),
        email: gen.email(),
        name: gen.fullName(),
        age: gen.age(),
        isActive: gen.boolean(),
        createdAt: gen.date(),
      });

      const user = userFactory.build();

      expect(user).toBeDefined();
      expect(typeof user.id).toBe('string');
    });

    it('accepts overrides', () => {
      const userFactory = factory<User>({
        id: gen.uuid(),
        email: gen.email(),
        name: gen.fullName(),
        age: gen.age(),
        isActive: gen.boolean(),
        createdAt: gen.date(),
      });

      const user = userFactory.build({
        email: 'test@example.com',
        isActive: false,
      });

      expect(user.email).toBe('test@example.com');
      expect(user.isActive).toBe(false);
      // Other fields should still be generated
      expect(user.id).toBeDefined();
    });

    it('accepts functions as overrides', () => {
      const userFactory = factory<User>({
        id: gen.uuid(),
        email: gen.email(),
        name: gen.fullName(),
        age: gen.age(),
        isActive: gen.boolean(),
        createdAt: gen.date(),
      });

      const user = userFactory.build({
        email: () => 'dynamic@test.com',
      });

      expect(user.email).toBe('dynamic@test.com');
    });
  });

  describe('buildMany()', () => {
    it('builds multiple instances', () => {
      const userFactory = factory<User>({
        id: gen.uuid(),
        email: gen.email(),
        name: gen.fullName(),
        age: gen.age(),
        isActive: gen.boolean(),
        createdAt: gen.date(),
      });

      const users = userFactory.buildMany(5);

      expect(users.length).toBe(5);
      // All should be unique
      const ids = users.map((u) => u.id);
      expect(new Set(ids).size).toBe(5);
    });

    it('applies overrides to all instances', () => {
      const userFactory = factory<User>({
        id: gen.uuid(),
        email: gen.email(),
        name: gen.fullName(),
        age: gen.age(),
        isActive: gen.boolean(),
        createdAt: gen.date(),
      });

      const users = userFactory.buildMany(3, { isActive: true });

      for (const user of users) {
        expect(user.isActive).toBe(true);
      }
    });
  });

  describe('Traits', () => {
    it('defines and uses traits', () => {
      const userFactory = factory<User>({
        id: gen.uuid(),
        email: gen.email(),
        name: gen.fullName(),
        age: gen.age(),
        isActive: gen.boolean(),
        createdAt: gen.date(),
      })
        .trait('inactive', { isActive: false })
        .trait('senior', { age: 65 });

      const inactiveUser = userFactory.build('inactive');
      expect(inactiveUser.isActive).toBe(false);

      const seniorUser = userFactory.build('senior');
      expect(seniorUser.age).toBe(65);
    });

    it('allows overrides with traits', () => {
      const userFactory = factory<User>({
        id: gen.uuid(),
        email: gen.email(),
        name: gen.fullName(),
        age: gen.age(),
        isActive: gen.boolean(),
        createdAt: gen.date(),
      }).trait('inactive', { isActive: false });

      const user = userFactory.build('inactive', { email: 'custom@test.com' });

      expect(user.isActive).toBe(false);
      expect(user.email).toBe('custom@test.com');
    });

    it('trait does not modify original factory', () => {
      const userFactory = factory<User>({
        id: gen.uuid(),
        email: gen.email(),
        name: gen.fullName(),
        age: gen.age(),
        isActive: gen.boolean(),
        createdAt: gen.date(),
      });

      const factoryWithTrait = userFactory.trait('inactive', { isActive: false });

      // Original factory should not have the trait
      const user1 = userFactory.build();
      // isActive should be randomly true or false (just verify it builds)
      expect(user1).toBeDefined();

      const user2 = factoryWithTrait.build('inactive');
      expect(user2.isActive).toBe(false);
    });
  });

  describe('extend()', () => {
    it('extends factory with additional defaults', () => {
      const baseFactory = factory<User>({
        id: gen.uuid(),
        email: gen.email(),
        name: gen.fullName(),
        age: gen.age(),
        isActive: gen.boolean(),
        createdAt: gen.date(),
      });

      const extendedFactory = baseFactory.extend({
        isActive: gen.constant(true),
      });

      const user = extendedFactory.build();
      expect(user.isActive).toBe(true);
    });
  });

  describe('Nested objects', () => {
    it('handles nested object structures', () => {
      const postFactory = factory<Post>({
        id: gen.uuid(),
        title: gen.title(),
        content: gen.paragraph(),
        author: () => ({
          id: gen.uuid()(),
          name: gen.fullName()(),
        }),
        tags: gen.array(gen.word(), { min: 1, max: 5 }),
        publishedAt: gen.pastDate(),
      });

      const post = postFactory.build();

      expect(post.author).toBeDefined();
      expect(post.author.id).toBeDefined();
      expect(post.author.name).toBeDefined();
      expect(Array.isArray(post.tags)).toBe(true);
    });

    it('allows overriding nested properties', () => {
      const postFactory = factory<Post>({
        id: gen.uuid(),
        title: gen.title(),
        content: gen.paragraph(),
        author: () => ({
          id: gen.uuid()(),
          name: gen.fullName()(),
        }),
        tags: gen.array(gen.word(), { min: 1, max: 5 }),
        publishedAt: gen.pastDate(),
      });

      const post = postFactory.build({
        author: { id: 'custom-id', name: 'Custom Author' },
      });

      expect(post.author.id).toBe('custom-id');
      expect(post.author.name).toBe('Custom Author');
    });
  });

  describe('Complex API response factories', () => {
    it('creates API response with traits for different scenarios', () => {
      const userResponseFactory = factory<ApiResponse<User>>({
        data: () => ({
          id: gen.uuid()(),
          email: gen.email()(),
          name: gen.fullName()(),
          age: gen.age()(),
          isActive: gen.boolean()(),
          createdAt: gen.date()(),
        }),
        meta: () => ({
          page: 1,
          total: gen.number({ min: 1, max: 100 })(),
          hasMore: gen.boolean()(),
        }),
        errors: gen.constant([]),
      })
        .trait('success', {
          errors: [],
          meta: () => ({ page: 1, total: 1, hasMore: false }),
        })
        .trait('paginated', {
          meta: () => ({ page: 1, total: 100, hasMore: true }),
        })
        .trait('error', {
          data: null as unknown as User,
          errors: [{ code: 'NOT_FOUND', message: 'User not found' }],
        });

      const successResponse = userResponseFactory.build('success');
      expect(successResponse.errors).toEqual([]);
      expect(successResponse.data).toBeDefined();

      const paginatedResponse = userResponseFactory.build('paginated');
      expect(paginatedResponse.meta.hasMore).toBe(true);

      const errorResponse = userResponseFactory.build('error');
      expect(errorResponse.errors.length).toBeGreaterThan(0);
      expect(errorResponse.errors[0].code).toBe('NOT_FOUND');
    });
  });

  describe('Deterministic generation', () => {
    it('produces same results with same seed', () => {
      const userFactory = factory<User>({
        id: gen.uuid(),
        email: gen.email(),
        name: gen.fullName(),
        age: gen.age(),
        isActive: gen.boolean(),
        createdAt: gen.date(),
      });

      const user1 = userFactory.build({}, { seed: 99999 });
      const user2 = userFactory.build({}, { seed: 99999 });

      expect(user1.id).toBe(user2.id);
      expect(user1.email).toBe(user2.email);
      expect(user1.name).toBe(user2.name);
    });
  });

  describe('Static values in schema', () => {
    it('accepts static values', () => {
      const factory1 = factory<{ name: string; count: number }>({
        name: 'Static Name',
        count: 42,
      });

      const obj = factory1.build();
      expect(obj.name).toBe('Static Name');
      expect(obj.count).toBe(42);
    });
  });
});
