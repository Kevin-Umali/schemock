// src/constants/index.ts

export const FAKER_METHODS = [
  "person.firstName",
  "person.lastName",
  "person.fullName",
  "internet.email",
  "internet.userName",
  "datatype.number",
  "datatype.boolean",
  "date.recent",
  "date.past",
  "location.streetAddress",
  "location.city",
  "location.country",
  "company.name",
  "commerce.department",
] as const;

export const LOCALES = ["en", "en_US", "fr", "de", "es", "it", "ja", "zh_CN"] as const;

export const DATA_TYPES = ["string", "number", "boolean", "date", "object", "array"] as const;
