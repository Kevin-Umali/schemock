export const SCHEMA_LIMITS = {
  depth: 12,
  fields: 100,
  arrayItems: 100,
  valueCharacters: 10_000,
  generatedValues: 10_000,
} as const
export const RESERVED_FIELD_NAMES = new Set(['__proto__', 'constructor', 'prototype'])
export const GENERATOR_EXPRESSION = /^([a-zA-Z][\w]*)\.([a-zA-Z][\w]*)(?:\(([\s\S]*)\))?$/
export const SCHEMA_EDITOR_SETUP = {
  syntaxHighlighting: false,
  lineNumbers: true,
  foldGutter: true,
  highlightActiveLine: true,
  bracketMatching: true,
  closeBrackets: true,
  autocompletion: false,
  lintKeymap: true,
}
