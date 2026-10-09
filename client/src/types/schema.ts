export type SchemaValue = string | number | boolean | null | Schema | ArraySchema
export interface Schema {
  [key: string]: SchemaValue
}
export interface ArraySchema {
  items: SchemaValue
  count: number
}
export type OutputFormat = 'json' | 'csv' | 'sql'
