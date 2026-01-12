/**
 * String generators
 */

import { random, randomInt, randomPick } from '../utils/random';
import { WORDS, NOUNS, ADJECTIVES, LOREM_WORDS } from '../utils/data';
import type { Generator, StringOptions, SentenceOptions, ParagraphOptions } from './types';

const CHARSETS = {
  alphanumeric: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  alpha: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numeric: '0123456789',
  hex: '0123456789abcdef',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
} as const;

/**
 * Generate a random string
 */
export function string(options: StringOptions = {}): Generator<string> {
  const { length = 10, charset = 'alphanumeric' } = options;
  const chars = CHARSETS[charset];

  return () => {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[randomInt(0, chars.length - 1)];
    }
    return result;
  };
}

/**
 * Generate a random word
 */
export function word(): Generator<string> {
  return () => randomPick(WORDS);
}

/**
 * Generate multiple random words
 */
export function words(count: number): Generator<string> {
  return () => {
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      result.push(randomPick(WORDS));
    }
    return result.join(' ');
  };
}

/**
 * Generate a random sentence
 */
export function sentence(options: SentenceOptions = {}): Generator<string> {
  const { words: wordCount = randomInt(5, 12) } = options;

  return () => {
    const sentenceWords: string[] = [];
    const count = typeof wordCount === 'number' ? wordCount : randomInt(5, 12);

    for (let i = 0; i < count; i++) {
      sentenceWords.push(randomPick(WORDS));
    }

    // Capitalize first word
    if (sentenceWords.length > 0) {
      sentenceWords[0] = sentenceWords[0].charAt(0).toUpperCase() + sentenceWords[0].slice(1);
    }

    return sentenceWords.join(' ') + '.';
  };
}

/**
 * Generate a random paragraph
 */
export function paragraph(options: ParagraphOptions = {}): Generator<string> {
  const { sentences: sentenceCount = randomInt(3, 6) } = options;

  return () => {
    const sentences: string[] = [];
    const count = typeof sentenceCount === 'number' ? sentenceCount : randomInt(3, 6);

    for (let i = 0; i < count; i++) {
      sentences.push(sentence({ words: randomInt(5, 15) })());
    }

    return sentences.join(' ');
  };
}

/**
 * Generate lorem ipsum text
 */
export function lorem(wordCount = 50): Generator<string> {
  return () => {
    const result: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      result.push(randomPick(LOREM_WORDS));
    }

    // Capitalize first word
    if (result.length > 0) {
      result[0] = result[0].charAt(0).toUpperCase() + result[0].slice(1);
    }

    return result.join(' ') + '.';
  };
}

/**
 * Generate a title (capitalized words)
 */
export function title(wordCount = 4): Generator<string> {
  return () => {
    const titleWords: string[] = [];

    // Mix of adjectives and nouns for realistic titles
    for (let i = 0; i < wordCount; i++) {
      const word = i % 2 === 0 ? randomPick(ADJECTIVES) : randomPick(NOUNS);
      titleWords.push(word.charAt(0).toUpperCase() + word.slice(1));
    }

    return titleWords.join(' ');
  };
}

/**
 * Generate a slug (url-friendly string)
 */
export function slug(wordCount = 3): Generator<string> {
  return () => {
    const slugWords: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      slugWords.push(randomPick(WORDS).toLowerCase());
    }
    return slugWords.join('-');
  };
}

/**
 * Generate from a pattern
 * # = digit, A = uppercase letter, a = lowercase letter, * = alphanumeric
 */
export function pattern(template: string): Generator<string> {
  return () => {
    let result = '';
    for (const char of template) {
      switch (char) {
        case '#':
          result += randomInt(0, 9).toString();
          break;
        case 'A':
          result += String.fromCharCode(randomInt(65, 90));
          break;
        case 'a':
          result += String.fromCharCode(randomInt(97, 122));
          break;
        case '*':
          if (random() < 0.5) {
            result += randomInt(0, 9).toString();
          } else {
            result += String.fromCharCode(randomInt(97, 122));
          }
          break;
        default:
          result += char;
      }
    }
    return result;
  };
}
