// src/constants/index.ts

import { TreeNode } from "@/types/tree";

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

export const INITIAL_SCHEMA: TreeNode[] = [
  {
    id: "node-1",
    name: "user",
    type: "object",
    isRoot: true,
    children: [
      {
        id: "node-2",
        name: "name",
        type: "string",
        fakerMethod: "person.firstName",
        isRoot: false,
      },
      {
        id: "node-3",
        name: "email",
        type: "string",
        fakerMethod: "internet.email",
        isRoot: false,
      },
      {
        id: "node-4",
        name: "address",
        type: "object",
        isRoot: false,
        children: [
          {
            id: "node-5",
            name: "street",
            type: "string",
            fakerMethod: "location.streetAddress",
            isRoot: false,
          },
          {
            id: "node-6",
            name: "city",
            type: "string",
            fakerMethod: "location.city",
            isRoot: false,
          },
          {
            id: "node-7",
            name: "country",
            type: "string",
            fakerMethod: "location.country",
            isRoot: false,
          },
        ],
      },
    ],
  },
];
