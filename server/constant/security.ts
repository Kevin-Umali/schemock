export const REQUEST_LIMITS = {
  bodyBytes: 64 * 1024,
  schemaDepth: 32,
  fieldsPerObject: 100,
  arrayItems: 100,
  generatedValues: 10000,
  valueCharacters: 10000,
  responseCharacters: 2_000_000,
  argumentCharacters: 4000,
  argumentDepth: 5,
  argumentItems: 100,
  argumentSize: 1000,
} as const
export const RESERVED_KEYS = new Set(['__proto__', 'constructor', 'prototype'])
export const SAFE_EMAIL_DOMAIN = 'example.test'
export const JSON_CONTENT_TYPE = /^application\/(?:[a-z0-9.+-]*\+)?json(?:\s*;|$)/i
