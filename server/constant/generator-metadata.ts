export const CUSTOM_GENERATORS = {
  category: 'custom',
  description: 'Use fixed values and explicit dates in a schema.',
  items: [
    {
      method: 'custom.literal',
      description: 'Return a fixed JSON string, number, boolean, or null. Use this for strings containing dots.',
      parameters: 'value: string | number | boolean | null',
      example: 'custom.literal("Draft")',
    },
    {
      method: 'custom.date',
      description:
        'Return an ISO date from a date string, timestamp, or numeric date parts. Numeric months start at zero.',
      parameters: 'date?: string | number, or year: number, month: number, day?: number',
      example: 'custom.date("2026-01-01")',
    },
  ],
}
