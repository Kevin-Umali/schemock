// src/constants/index.ts

import { TreeNode } from '@/types/tree'

export const BASE_TYPES = ['object', 'array'] as const

export const INITIAL_SCHEMA: TreeNode[] = [
  {
    id: 'node-1',
    name: 'user',
    type: 'object',
    isRoot: true,
    children: [
      {
        id: 'node-2',
        name: 'name',
        type: 'string',
        fakerMethod: 'person.firstName',
        isRoot: false,
      },
      {
        id: 'node-3',
        name: 'email',
        type: 'string',
        fakerMethod: 'internet.email',
        isRoot: false,
      },
      {
        id: 'node-4',
        name: 'address',
        type: 'object',
        isRoot: false,
        children: [
          {
            id: 'node-5',
            name: 'street',
            type: 'string',
            fakerMethod: 'location.streetAddress',
            isRoot: false,
          },
          {
            id: 'node-6',
            name: 'city',
            type: 'string',
            fakerMethod: 'location.city',
            isRoot: false,
          },
          {
            id: 'node-7',
            name: 'country',
            type: 'string',
            fakerMethod: 'location.country',
            isRoot: false,
          },
        ],
      },
    ],
  },
]
