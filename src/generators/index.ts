/**
 * Generator exports - the `gen` namespace
 */

// Re-export all generators
export * from './types';

// String generators
export {
  string,
  word,
  words,
  sentence,
  paragraph,
  lorem,
  title,
  slug,
  pattern,
} from './string';

// Number generators
export {
  number,
  int,
  float,
  age,
  price,
  quantity,
  count,
  percentage,
  rating,
} from './number';

// Boolean generators
export { boolean, truthy, falsy } from './boolean';

// Date generators
export {
  date,
  pastDate,
  futureDate,
  recentDate,
  soonDate,
  birthDate,
  timestamp,
  isoDate,
} from './date';

// Special generators
export {
  uuid,
  email,
  firstName,
  lastName,
  fullName,
  username,
  url,
  imageUrl,
  avatarUrl,
  phone,
  address,
  city,
  country,
  zipCode,
  company,
  domain,
  ipv4,
  macAddress,
  hexColor,
  rgbColor,
} from './special';

// Array and collection generators
export {
  array,
  oneOf,
  enumValue,
  someOf,
  sequence,
  sequenceWithReset,
  constant,
  nullable,
  optional,
  weighted,
  lazy,
  oneOfGenerators,
} from './array';

// Import all for the gen namespace object
import * as stringGen from './string';
import * as numberGen from './number';
import * as booleanGen from './boolean';
import * as dateGen from './date';
import * as specialGen from './special';
import * as arrayGen from './array';

/**
 * The `gen` namespace object - convenient access to all generators
 */
export const gen = {
  // String
  string: stringGen.string,
  word: stringGen.word,
  words: stringGen.words,
  sentence: stringGen.sentence,
  paragraph: stringGen.paragraph,
  lorem: stringGen.lorem,
  title: stringGen.title,
  slug: stringGen.slug,
  pattern: stringGen.pattern,

  // Number
  number: numberGen.number,
  int: numberGen.int,
  float: numberGen.float,
  age: numberGen.age,
  price: numberGen.price,
  quantity: numberGen.quantity,
  count: numberGen.count,
  percentage: numberGen.percentage,
  rating: numberGen.rating,

  // Boolean
  boolean: booleanGen.boolean,
  truthy: booleanGen.truthy,
  falsy: booleanGen.falsy,

  // Date
  date: dateGen.date,
  pastDate: dateGen.pastDate,
  futureDate: dateGen.futureDate,
  recentDate: dateGen.recentDate,
  soonDate: dateGen.soonDate,
  birthDate: dateGen.birthDate,
  timestamp: dateGen.timestamp,
  isoDate: dateGen.isoDate,

  // Special
  uuid: specialGen.uuid,
  email: specialGen.email,
  firstName: specialGen.firstName,
  lastName: specialGen.lastName,
  fullName: specialGen.fullName,
  name: specialGen.fullName, // Alias
  username: specialGen.username,
  url: specialGen.url,
  imageUrl: specialGen.imageUrl,
  avatarUrl: specialGen.avatarUrl,
  phone: specialGen.phone,
  address: specialGen.address,
  city: specialGen.city,
  country: specialGen.country,
  zipCode: specialGen.zipCode,
  company: specialGen.company,
  domain: specialGen.domain,
  ipv4: specialGen.ipv4,
  macAddress: specialGen.macAddress,
  hexColor: specialGen.hexColor,
  rgbColor: specialGen.rgbColor,

  // Array/Collection
  array: arrayGen.array,
  oneOf: arrayGen.oneOf,
  enum: arrayGen.enumValue,
  someOf: arrayGen.someOf,
  sequence: arrayGen.sequence,
  constant: arrayGen.constant,
  nullable: arrayGen.nullable,
  optional: arrayGen.optional,
  weighted: arrayGen.weighted,
  lazy: arrayGen.lazy,
} as const;
