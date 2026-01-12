/**
 * Special generators: UUID, email, URL, phone, address, etc.
 */

import { random, randomInt, randomPick } from '../utils/random';
import {
  FIRST_NAMES,
  LAST_NAMES,
  EMAIL_DOMAINS,
  CITIES,
  COUNTRIES,
  STREET_SUFFIXES,
  COMPANY_SUFFIXES,
  TLD,
} from '../utils/data';
import type { Generator } from './types';

/**
 * Generate a UUID v4
 */
export function uuid(): Generator<string> {
  return () => {
    const hex = '0123456789abcdef';
    let result = '';

    for (let i = 0; i < 36; i++) {
      if (i === 8 || i === 13 || i === 18 || i === 23) {
        result += '-';
      } else if (i === 14) {
        result += '4'; // Version 4
      } else if (i === 19) {
        result += hex[randomInt(8, 11)]; // Variant bits
      } else {
        result += hex[randomInt(0, 15)];
      }
    }

    return result;
  };
}

/**
 * Generate a valid email address
 */
export function email(): Generator<string> {
  return () => {
    const firstName = randomPick(FIRST_NAMES).toLowerCase();
    const lastName = randomPick(LAST_NAMES).toLowerCase();
    const domain = randomPick(EMAIL_DOMAINS);

    const formats = [
      `${firstName}.${lastName}`,
      `${firstName}${lastName}`,
      `${firstName}_${lastName}`,
      `${firstName}${randomInt(1, 99)}`,
      `${firstName[0]}${lastName}`,
    ];

    return `${randomPick(formats)}@${domain}`;
  };
}

/**
 * Generate a first name
 */
export function firstName(): Generator<string> {
  return () => randomPick(FIRST_NAMES);
}

/**
 * Generate a last name
 */
export function lastName(): Generator<string> {
  return () => randomPick(LAST_NAMES);
}

/**
 * Generate a full name
 */
export function fullName(): Generator<string> {
  return () => `${randomPick(FIRST_NAMES)} ${randomPick(LAST_NAMES)}`;
}

/**
 * Generate a username
 */
export function username(): Generator<string> {
  return () => {
    const firstName = randomPick(FIRST_NAMES).toLowerCase();
    const lastName = randomPick(LAST_NAMES).toLowerCase();

    const formats = [
      `${firstName}${lastName}`,
      `${firstName}_${lastName}`,
      `${firstName}${randomInt(1, 999)}`,
      `${firstName[0]}${lastName}${randomInt(1, 99)}`,
      `the${firstName}`,
    ];

    return randomPick(formats);
  };
}

/**
 * Generate a URL
 */
export function url(): Generator<string> {
  return () => {
    const protocols = ['https'];
    const protocol = randomPick(protocols);
    const domain = randomPick(LAST_NAMES).toLowerCase();
    const tld = randomPick(TLD);
    const paths = ['', '/about', '/products', '/contact', '/blog', '/api'];
    const path = randomPick(paths);

    return `${protocol}://${domain}.${tld}${path}`;
  };
}

/**
 * Generate an image URL (placeholder service)
 */
export function imageUrl(width = 640, height = 480): Generator<string> {
  return () => {
    const id = randomInt(1, 1000);
    return `https://picsum.photos/seed/${id}/${width}/${height}`;
  };
}

/**
 * Generate an avatar URL
 */
export function avatarUrl(): Generator<string> {
  return () => {
    const id = randomInt(1, 70);
    const gender = random() < 0.5 ? 'men' : 'women';
    return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
  };
}

/**
 * Generate a phone number
 */
export function phone(): Generator<string> {
  return () => {
    const areaCode = randomInt(200, 999);
    const exchange = randomInt(200, 999);
    const subscriber = randomInt(1000, 9999);
    return `(${areaCode}) ${exchange}-${subscriber}`;
  };
}

/**
 * Generate a street address
 */
export function address(): Generator<string> {
  return () => {
    const number = randomInt(1, 9999);
    const street = randomPick(LAST_NAMES);
    const suffix = randomPick(STREET_SUFFIXES);
    return `${number} ${street} ${suffix}`;
  };
}

/**
 * Generate a city name
 */
export function city(): Generator<string> {
  return () => randomPick(CITIES);
}

/**
 * Generate a country name
 */
export function country(): Generator<string> {
  return () => randomPick(COUNTRIES);
}

/**
 * Generate a zip/postal code
 */
export function zipCode(): Generator<string> {
  return () => {
    const zip = randomInt(10000, 99999);
    return zip.toString();
  };
}

/**
 * Generate a company name
 */
export function company(): Generator<string> {
  return () => {
    const name = randomPick(LAST_NAMES);
    const suffix = randomPick(COMPANY_SUFFIXES);
    return `${name} ${suffix}`;
  };
}

/**
 * Generate a domain name
 */
export function domain(): Generator<string> {
  return () => {
    const name = randomPick(LAST_NAMES).toLowerCase();
    const tld = randomPick(TLD);
    return `${name}.${tld}`;
  };
}

/**
 * Generate an IP address (v4)
 */
export function ipv4(): Generator<string> {
  return () => {
    return [
      randomInt(1, 255),
      randomInt(0, 255),
      randomInt(0, 255),
      randomInt(1, 254),
    ].join('.');
  };
}

/**
 * Generate a MAC address
 */
export function macAddress(): Generator<string> {
  return () => {
    const hex = '0123456789ABCDEF';
    const parts: string[] = [];

    for (let i = 0; i < 6; i++) {
      parts.push(hex[randomInt(0, 15)] + hex[randomInt(0, 15)]);
    }

    return parts.join(':');
  };
}

/**
 * Generate a hex color
 */
export function hexColor(): Generator<string> {
  return () => {
    const hex = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += hex[randomInt(0, 15)];
    }
    return color;
  };
}

/**
 * Generate a RGB color
 */
export function rgbColor(): Generator<string> {
  return () => {
    return `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
  };
}
