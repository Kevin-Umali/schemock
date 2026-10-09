import type { SchemaValue } from '@/types/schema';

export type FieldSourceKind = 'generator' | 'object' | 'array' | 'fixed' | 'custom';

export interface FieldSummary {
  kind: FieldSourceKind;
  label: string;
  detail: string;
  nested: boolean;
}

export interface RemovedField {
  name: string;
  value: SchemaValue;
  index: number;
}
