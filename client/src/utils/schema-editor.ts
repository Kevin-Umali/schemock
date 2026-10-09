import type { FakerMethodCategory } from '@/types/faker'
import { checkSchema } from '@/utils/schema-validation'
import { startCompletion, type CompletionContext, type CompletionResult } from '@codemirror/autocomplete'
import { syntaxTree } from '@codemirror/language'
import type { Diagnostic } from '@codemirror/lint'
import { jsonParseLinter } from '@codemirror/lang-json'
import type { EditorView } from '@codemirror/view'

export const schemaDiagnostics = (view: EditorView, methods: FakerMethodCategory[]): Diagnostic[] => {
  const syntax = jsonParseLinter()(view)
  if (syntax.length) return syntax
  const text = view.state.doc.toString()
  const { issues } = checkSchema(text, methods)
  return issues.map((issue) => {
    const needle = issue.value ? JSON.stringify(issue.value) : ''
    const position = needle ? text.indexOf(needle) : 0
    const from = Math.max(0, position)
    return { from, to: Math.min(text.length, from + (needle.length || 1)), severity: 'error', message: issue.message }
  })
}

export const generatorCompletions = (
  context: CompletionContext,
  methods: FakerMethodCategory[],
): CompletionResult | null => {
  const node = syntaxTree(context.state).resolveInner(context.pos, -1)
  const word = context.matchBefore(/[\w.]*/)
  if (!word || node.name === 'PropertyName') return null
  const line = context.state.doc.sliceString(context.state.doc.lineAt(context.pos).from, context.pos)
  const inString = node.name === 'String' || /:\s*"[^"\n]*$/.test(line)
  if (!inString || (!word.text && !context.explicit)) return null
  return {
    from: word.from,
    to: context.pos + (context.state.doc.sliceString(context.pos).match(/^[\w.]*/)?.[0].length ?? 0),
    ...(context.explicit ? { filter: false } : { validFor: /^[\w.]*$/ }),
    options: methods.flatMap((category) =>
      category.items.map((item) => ({
        label: item.method,
        type: 'function',
        detail: category.category,
        info: item.description,
      })),
    ),
  }
}

export const suggestGenerator = (view: EditorView): boolean => {
  const current = syntaxTree(view.state).resolveInner(view.state.selection.main.head, -1)
  if (current.name !== 'String') {
    let position: number | undefined
    syntaxTree(view.state).iterate({
      enter: (node) => {
        if (position !== undefined || node.name !== 'String') return
        const value = view.state.doc.sliceString(node.from + 1, node.to - 1)
        const argumentsStart = value.indexOf('(')
        position = argumentsStart >= 0 ? node.from + 1 + argumentsStart : node.to - 1
      },
    })
    if (position === undefined) return false
    view.dispatch({ selection: { anchor: position } })
  }
  view.focus()
  return startCompletion(view)
}
