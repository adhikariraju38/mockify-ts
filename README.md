# mockify-ts

[![npm version](https://img.shields.io/npm/v/mockify-ts.svg)](https://www.npmjs.com/package/mockify-ts)
[![npm downloads](https://img.shields.io/npm/dm/mockify-ts.svg)](https://www.npmjs.com/package/mockify-ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-green.svg)](https://www.npmjs.com/package/mockify-ts)

**Lightweight TypeScript mock data factory with smart field inference for Jest/Vitest and React Testing Library.**

Generate realistic mock data for your tests with zero heavy dependencies. Just define your types and let mockify-ts intelligently generate appropriate data based on field names.

## Features

- **Smart Field Inference** - Automatically generates appropriate data based on field names (`email` → valid email, `id` → UUID, etc.)
- **Factory Pattern** - Reusable, composable mock definitions with traits/variants
- **Full Type Safety** - Complete TypeScript inference for your interfaces
- **Lightweight** - ~36KB bundle, zero runtime dependencies (vs Faker.js at 30.5MB)
- **Deterministic** - Seeded random generation for reproducible tests
- **Framework Agnostic** - Works with Jest, Vitest, React Testing Library, and more

## Installation

```bash
npm install mockify-ts --save-dev
```

## Quick Start

```typescript
import { factory, gen } from 'mockify-ts';

// Define your interface
interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  isActive: boolean;
  createdAt: Date;
}

// Create a factory with smart inference
const userFactory = factory<User>(['id', 'email', 'name', 'age', 'isActive', 'createdAt']);

// Generate mock data - fields auto-detected!
const user = userFactory.build();
// {
//   id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",  ← detected as UUID
//   email: "john.doe@example.com",                ← detected as email
//   name: "John Smith",                           ← detected as name
//   age: 28,                                      ← detected as number (18-80)
//   isActive: true,                               ← detected as boolean
//   createdAt: 2024-01-15T10:30:00.000Z          ← detected as date
// }

// Generate multiple
const users = userFactory.buildMany(5);

// Override specific fields
const admin = userFactory.build({ email: 'admin@company.com', isActive: true });
```

## Smart Field Detection

mockify-ts automatically infers the right data type based on common field naming conventions:

| Field Pattern | Generated Data |
|---------------|----------------|
| `id`, `uuid`, `*Id`, `*_id` | UUID v4 |
| `email`, `*Email`, `*_email` | Valid email |
| `name`, `firstName`, `lastName` | Realistic names |
| `username`, `userName` | Username format |
| `phone`, `phoneNumber` | Phone number |
| `createdAt`, `updatedAt`, `*At` | Date object |
| `url`, `*Url`, `link`, `href` | Valid URL |
| `avatar`, `image`, `*Image` | Image URL |
| `title`, `*Title` | Capitalized words |
| `description`, `bio`, `summary` | Paragraph text |
| `content`, `body` | Longer text |
| `age` | Number (18-80) |
| `price`, `*Price`, `amount` | Currency format |
| `count`, `*Count`, `quantity` | Integer |
| `isActive`, `has*`, `can*`, `enabled` | Boolean |
| `address`, `city`, `country`, `zipCode` | Address data |

## Explicit Generators

For full control, use explicit generators:

```typescript
import { factory, gen } from 'mockify-ts';

interface Product {
  id: string;
  name: string;
  price: number;
  category: 'electronics' | 'clothing' | 'food';
  tags: string[];
  sku: string;
}

const productFactory = factory<Product>({
  id: gen.uuid(),
  name: gen.words(2),
  price: gen.float({ min: 9.99, max: 999.99, decimals: 2 }),
  category: gen.enum(['electronics', 'clothing', 'food']),
  tags: gen.array(gen.word(), { min: 1, max: 5 }),
  sku: gen.pattern('SKU-####-AAA'),  // SKU-1234-XYZ
});
```

## Available Generators

### Strings
```typescript
gen.string({ length: 10, charset: 'alphanumeric' })
gen.word()
gen.words(5)
gen.sentence()
gen.paragraph()
gen.lorem(50)
gen.title()
gen.slug()
gen.pattern('###-AAA')  // 123-XYZ
```

### Numbers
```typescript
gen.number({ min: 0, max: 100 })
gen.int({ min: 0, max: 100 })
gen.float({ min: 0, max: 100, decimals: 2 })
gen.age()
gen.price()
gen.quantity()
gen.count()
gen.percentage()
gen.rating()
```

### Boolean
```typescript
gen.boolean()
gen.boolean(0.8)  // 80% chance of true
gen.truthy()
gen.falsy()
```

### Dates
```typescript
gen.date()
gen.pastDate()
gen.futureDate()
gen.recentDate(30)  // Within last 30 days
gen.soonDate(30)    // Within next 30 days
gen.birthDate()
gen.timestamp()
gen.isoDate()
```

### Identity
```typescript
gen.uuid()
gen.email()
gen.firstName()
gen.lastName()
gen.fullName()
gen.username()
gen.phone()
```

### Location
```typescript
gen.address()
gen.city()
gen.country()
gen.zipCode()
```

### Web
```typescript
gen.url()
gen.imageUrl(640, 480)
gen.avatarUrl()
gen.domain()
gen.ipv4()
gen.hexColor()
```

### Collections
```typescript
gen.array(gen.uuid(), { length: 5 })
gen.array(gen.word(), { min: 1, max: 10 })
gen.oneOf(['red', 'green', 'blue'])
gen.enum(['active', 'inactive', 'pending'])
gen.someOf(['a', 'b', 'c', 'd'], { min: 1, max: 3 })
gen.sequence((n) => `item-${n}`)
gen.constant('fixed-value')
gen.nullable(gen.string())
gen.optional(gen.string())
```

## Traits (Variants)

Create named variants for different scenarios:

```typescript
const userFactory = factory<User>({
  id: gen.uuid(),
  email: gen.email(),
  name: gen.fullName(),
  age: gen.age(),
  isActive: gen.boolean(),
  role: 'user',
})
  .trait('admin', { role: 'admin', isActive: true })
  .trait('inactive', { isActive: false })
  .trait('senior', { age: gen.number({ min: 60, max: 80 }) });

// Use traits
const admin = userFactory.build('admin');
const inactiveUser = userFactory.build('inactive');
const seniorUser = userFactory.build('senior');

// Combine trait with overrides
const customAdmin = userFactory.build('admin', { email: 'boss@company.com' });
```

## Nested Objects

Handle complex nested structures:

```typescript
interface Post {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
  };
  comments: Comment[];
}

const commentFactory = factory<Comment>(['id', 'text', 'authorId']);

const postFactory = factory<Post>({
  id: gen.uuid(),
  title: gen.title(),
  author: () => ({
    id: gen.uuid()(),
    name: gen.fullName()(),
  }),
  comments: () => commentFactory.buildMany(3),
});
```

## API Response Factories

Perfect for mocking API responses in tests:

```typescript
interface ApiResponse<T> {
  data: T;
  meta: {
    page: number;
    total: number;
    hasMore: boolean;
  };
  errors: Array<{ code: string; message: string }>;
}

const userResponseFactory = factory<ApiResponse<User>>({
  data: () => userFactory.build(),
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

// Use in tests
const success = userResponseFactory.build('success');
const paginated = userResponseFactory.build('paginated');
const error = userResponseFactory.build('error');
```

## React Testing Library Example

```typescript
import { factory, gen } from 'mockify-ts';
import { render, screen } from '@testing-library/react';
import { UserProfile } from './UserProfile';

const userFactory = factory<User>(['id', 'email', 'name', 'age', 'isActive']);

describe('UserProfile', () => {
  it('displays user information', () => {
    const user = userFactory.build({
      name: 'Jane Doe',
      email: 'jane@example.com',
    });

    render(<UserProfile user={user} />);

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('handles multiple users', () => {
    const users = userFactory.buildMany(5);

    render(<UserList users={users} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(5);
  });
});
```

## Deterministic Generation (Seeding)

For reproducible tests and snapshots:

```typescript
import { factory, setSeed } from 'mockify-ts';

// Global seed
setSeed(12345);

// Or per-build seed
const user1 = userFactory.build({}, { seed: 99999 });
const user2 = userFactory.build({}, { seed: 99999 });
// user1 and user2 are identical!
```

## Extending Factories

```typescript
const baseFactory = factory<User>({
  id: gen.uuid(),
  email: gen.email(),
  name: gen.fullName(),
});

const extendedFactory = baseFactory.extend({
  isActive: gen.constant(true),
  role: gen.constant('premium'),
});
```

## Comparison

| Feature | mockify-ts | @faker-js/faker | fishery | factory.ts |
|---------|------------|-----------------|---------|------------|
| Bundle Size | ~36KB | 30.5MB | +Faker | ~20KB |
| Smart Inference | Yes | No | No | No |
| Factory Pattern | Yes | No | Yes | Yes |
| Type Safety | Full | Basic | Good | Good |
| Zero Dependencies | Yes | No | No | Yes |
| Seeded Random | Yes | Yes | No | No |
| Built-in Generators | Yes | Yes | No | No |

## License

MIT

## Contributing

Contributions welcome! Please open an issue or submit a pull request.

## Author

Raju Kumar Yadav ([@adhikariraju38](https://github.com/adhikariraju38))
