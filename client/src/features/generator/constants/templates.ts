import type { SchemaTemplate } from '../types/templates'
export const templates: SchemaTemplate[] = [
  {
    id: 'people',
    name: 'People',
    description: 'Names, emails, and contact details.',
    schema: {
      id: 'string.uuid',
      name: 'person.fullName',
      email: 'internet.exampleEmail',
      city: 'location.city',
      active: 'datatype.boolean',
    },
  },
  {
    id: 'products',
    name: 'Products',
    description: 'A catalog ready for your next prototype.',
    schema: {
      id: 'string.uuid',
      name: 'commerce.productName',
      price: 'commerce.price',
      category: 'commerce.department',
      description: 'commerce.productDescription',
    },
  },
  {
    id: 'companies',
    name: 'Companies',
    description: 'Businesses, websites, and locations.',
    schema: {
      id: 'string.uuid',
      company: 'company.name',
      website: 'internet.url',
      city: 'location.city',
      country: 'location.country',
    },
  },
  {
    id: 'nested',
    name: 'Nested profiles',
    description: 'Objects and arrays, without starting from scratch.',
    schema: {
      user: {
        name: 'person.fullName',
        email: 'internet.exampleEmail',
        address: { street: 'location.streetAddress', city: 'location.city' },
      },
      tags: { items: 'lorem.word', count: 3 },
    },
  },
]
