// src/constants/index.ts

import { TreeDataNode } from '@/types/tree'

export const BASE_TYPES = ['object', 'array'] as const

export const INITIAL_SCHEMA: TreeDataNode[] = [
  {
    id: 'node-1',
    label: 'user', // Updated from "name"
    dataType: 'object', // Updated from "type"
    isRootNode: true, // Updated from "isRoot"
    children: [
      {
        id: 'node-2',
        label: 'name', // Updated from "name"
        dataType: 'person', // Updated from "type"
        fakerFunction: 'person.firstName', // Updated from "fakerMethod"
        isRootNode: false, // Updated from "isRoot"
      },
      {
        id: 'node-3',
        label: 'email', // Updated from "name"
        dataType: 'internet', // Updated from "type"
        fakerFunction: 'internet.email', // Updated from "fakerMethod"
        isRootNode: false, // Updated from "isRoot"
      },
      {
        id: 'node-4',
        label: 'address', // Updated from "name"
        dataType: 'object', // Updated from "type"
        isRootNode: false, // Updated from "isRoot"
        children: [
          {
            id: 'node-5',
            label: 'street', // Updated from "name"
            dataType: 'location', // Updated from "type"
            fakerFunction: 'location.streetAddress', // Updated from "fakerMethod"
            isRootNode: false, // Updated from "isRoot"
          },
          {
            id: 'node-6',
            label: 'city', // Updated from "name"
            dataType: 'location', // Updated from "type"
            fakerFunction: 'location.city', // Updated from "fakerMethod"
            isRootNode: false, // Updated from "isRoot"
          },
          {
            id: 'node-7',
            label: 'country', // Updated from "name"
            dataType: 'location', // Updated from "type"
            fakerFunction: 'location.country', // Updated from "fakerMethod"
            isRootNode: false, // Updated from "isRoot"
          },
        ],
      },
    ],
  },
]
