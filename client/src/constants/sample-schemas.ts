import type { Schema } from '@/types/schema'
export const peopleSchema: Schema = {
  id: 'string.uuid',
  name: 'person.fullName',
  email: 'internet.exampleEmail',
  city: 'location.city',
}
