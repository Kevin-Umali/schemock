import type { GuideEndpoint, GuideNavItem, GuideStep } from '../types/content'
import { absoluteApiUrl } from '@/utils/api-url'

export const SCHEMA_EXAMPLE = `{
  "id": "string.uuid",
  "name": "person.fullName",
  "email": "internet.exampleEmail",
  "status": "custom.literal(\\"active\\")",
  "address": {
    "city": "location.city",
    "country": "location.country"
  },
  "tags": { "items": "lorem.word", "count": 3 }
}`

export const MOCK_REQUEST_EXAMPLE = `{
  "schema": {
    "id": "string.uuid",
    "name": "person.fullName",
    "email": "internet.exampleEmail"
  },
  "count": 30,
  "locale": "en"
}`

export const MOCK_CURL_EXAMPLE = `curl -X POST '${absoluteApiUrl('/mock/pagination?page=1&limit=10&sort=name:asc')}' \\
  -H 'Content-Type: application/json' \\
  -d '${MOCK_REQUEST_EXAMPLE.replaceAll("'", "'\\''")}'`

export const GUIDE_STEPS: GuideStep[] = [
  {
    title: 'Start from an example',
    description: 'Choose a schema template or import a JSON object to create fields from its values.',
  },
  {
    title: 'Set up the fields',
    description: 'Choose Faker, Fixed, Object, or Array for each field. Add child fields to shape nested data.',
  },
  {
    title: 'Generate a preview',
    description: 'Choose a record count and locale, then review the output. CSV and SQL have extra format options.',
  },
  {
    title: 'Use the result',
    description: 'Search, copy, or download records. Saved schemas stay in this browser.',
  },
]

export const GUIDE_NAVIGATION: GuideNavItem[] = [
  { href: '#getting-started', label: 'Getting started' },
  { href: '#schema', label: 'Build a schema' },
  { href: '#formats', label: 'Generate and export' },
  { href: '#templates', label: 'Text templates' },
  { href: '#mock-api', label: 'Mock API' },
  { href: '#limits', label: 'Limits and help' },
]

export const API_ENDPOINTS: GuideEndpoint[] = [
  {
    format: 'JSON records',
    method: 'POST',
    path: '/generate/json',
    description: 'Generate one object or a list of records.',
  },
  { format: 'CSV file', method: 'POST', path: '/generate/csv', description: 'Download generated records as CSV.' },
  {
    format: 'SQL inserts',
    method: 'POST',
    path: '/generate/sql',
    description: 'Create single-row or multi-row INSERT statements.',
  },
  {
    format: 'Text template',
    method: 'POST',
    path: '/generate/template',
    description: 'Fill {{faker.method}} placeholders in text.',
  },
  {
    format: 'Paginated mock',
    method: 'POST',
    path: '/mock/pagination',
    description: 'Generate a page of records with optional sorting.',
  },
]
