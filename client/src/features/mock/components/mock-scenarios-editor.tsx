import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { SearchSelect } from '@/components/ui/search-select'
import type { FakerMethodCategory } from '@/types/faker'
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import type * as React from 'react'
import { MOCK_LIMITS, MOCK_METHODS } from '../constants/definition'
import type { MockCondition, MockMethod, MockScenario } from '../types/definition'
import { createMockScenario } from '../utils/builder'
import { MockResponseEditor } from './mock-response-editor'

interface MockScenariosEditorProps {
  scenarios: MockScenario[]
  resource: boolean
  methods: FakerMethodCategory[]
  locales: string[]
  onChange: (scenarios: MockScenario[]) => void
  onIssue: (id: string, message: string) => void
}

export const MockScenariosEditor: React.FC<MockScenariosEditorProps> = ({
  scenarios,
  resource,
  methods,
  locales,
  onChange,
  onIssue,
}) => {
  const update = (index: number, scenario: MockScenario) =>
    onChange(scenarios.map((item, position) => (position === index ? scenario : item)))
  const move = (index: number, direction: number) => {
    const next = [...scenarios]
    ;[next[index], next[index + direction]] = [next[index + direction], next[index]]
    onChange(next)
  }
  return (
    <section className='space-y-4'>
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div>
          <h3 className='text-sm font-semibold'>Response scenarios</h3>
          <p className='mt-1 text-xs leading-5 text-muted-foreground'>
            All conditions must match. The first matching scenario wins; otherwise use the default response.
          </p>
        </div>
        <Button
          variant='outline'
          size='sm'
          disabled={scenarios.length >= MOCK_LIMITS.scenarios}
          onClick={() => onChange([...scenarios, createMockScenario()])}
        >
          <Plus size={14} />
          Add scenario
        </Button>
      </div>
      {!scenarios.length && (
        <p className='text-sm text-muted-foreground'>
          Add a scenario to simulate errors or respond to a specific request.
        </p>
      )}
      {scenarios.map((scenario, index) => (
        <details key={index} open className='rounded-lg border border-border'>
          <summary className='cursor-pointer px-4 py-3 text-sm font-medium'>
            {index + 1}. {scenario.name || 'Untitled scenario'}
          </summary>
          <div className='space-y-5 border-t border-border p-4'>
            <div className='flex flex-wrap items-end gap-2'>
              <Field className='min-w-40 flex-1 gap-2'>
                <FieldLabel htmlFor={`scenario-${index}-name`}>Name</FieldLabel>
                <Input
                  id={`scenario-${index}-name`}
                  value={scenario.name}
                  onChange={(event) => update(index, { ...scenario, name: event.target.value })}
                />
              </Field>
              {resource && (
                <Field className='w-36 gap-2'>
                  <FieldLabel>Method</FieldLabel>
                  <SearchSelect
                    label={`Scenario ${index + 1} method`}
                    value={scenario.method ?? 'ANY'}
                    options={[
                      { value: 'ANY', label: 'Any method' },
                      ...MOCK_METHODS.map((method) => ({ value: method, label: method })),
                    ]}
                    onChange={(method) =>
                      update(index, { ...scenario, method: method === 'ANY' ? undefined : (method as MockMethod) })
                    }
                  />
                </Field>
              )}
              <Button
                variant='outline'
                size='icon'
                aria-label={`Move scenario ${index + 1} up`}
                disabled={index === 0}
                onClick={() => move(index, -1)}
              >
                <ChevronUp />
              </Button>
              <Button
                variant='outline'
                size='icon'
                aria-label={`Move scenario ${index + 1} down`}
                disabled={index === scenarios.length - 1}
                onClick={() => move(index, 1)}
              >
                <ChevronDown />
              </Button>
              <Button
                variant='outline'
                size='icon'
                aria-label={`Remove scenario ${index + 1}`}
                onClick={() => onChange(scenarios.filter((_, position) => position !== index))}
              >
                <Trash2 />
              </Button>
            </div>
            <div className='space-y-3'>
              {scenario.conditions.map((condition, conditionIndex) => (
                <div key={conditionIndex} className='grid items-end gap-2 sm:grid-cols-[7rem_1fr_1fr_auto]'>
                  <Field className='gap-2'>
                    <FieldLabel>Source</FieldLabel>
                    <SearchSelect
                      label={`Condition ${conditionIndex + 1} source`}
                      value={condition.source}
                      options={[
                        { value: 'query', label: 'Query' },
                        { value: 'header', label: 'Header' },
                        { value: 'body', label: 'JSON body' },
                      ]}
                      onChange={(source) =>
                        update(index, {
                          ...scenario,
                          conditions: scenario.conditions.map((item, position) =>
                            position === conditionIndex ? { ...item, source: source as MockCondition['source'] } : item,
                          ),
                        })
                      }
                    />
                  </Field>
                  <Field className='gap-2'>
                    <FieldLabel htmlFor={`scenario-${index}-field-${conditionIndex}`}>Field</FieldLabel>
                    <Input
                      id={`scenario-${index}-field-${conditionIndex}`}
                      placeholder={condition.source === 'body' ? 'user.role' : 'scenario'}
                      value={condition.field}
                      onChange={(event) =>
                        update(index, {
                          ...scenario,
                          conditions: scenario.conditions.map((item, position) =>
                            position === conditionIndex ? { ...item, field: event.target.value } : item,
                          ),
                        })
                      }
                    />
                  </Field>
                  <Field className='gap-2'>
                    <FieldLabel htmlFor={`scenario-${index}-value-${conditionIndex}`}>Equals</FieldLabel>
                    <Input
                      id={`scenario-${index}-value-${conditionIndex}`}
                      value={typeof condition.value === 'string' ? condition.value : JSON.stringify(condition.value)}
                      onChange={(event) => {
                        let value: MockCondition['value'] = event.target.value
                        if (condition.source === 'body') {
                          try {
                            const parsed: unknown = JSON.parse(value)
                            if (parsed === null || ['string', 'number', 'boolean'].includes(typeof parsed))
                              value = parsed as MockCondition['value']
                          } catch {
                            /* Unquoted input is a string value. */
                          }
                        }
                        update(index, {
                          ...scenario,
                          conditions: scenario.conditions.map((item, position) =>
                            position === conditionIndex ? { ...item, value } : item,
                          ),
                        })
                      }}
                    />
                  </Field>
                  <Button
                    variant='outline'
                    size='icon'
                    aria-label={`Remove condition ${conditionIndex + 1} from scenario ${index + 1}`}
                    onClick={() =>
                      update(index, {
                        ...scenario,
                        conditions: scenario.conditions.filter((_, position) => position !== conditionIndex),
                      })
                    }
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
              <Button
                variant='ghost'
                size='sm'
                disabled={scenario.conditions.length >= MOCK_LIMITS.conditions}
                onClick={() =>
                  update(index, {
                    ...scenario,
                    conditions: [...scenario.conditions, { source: 'query', field: 'scenario', value: 'error' }],
                  })
                }
              >
                <Plus size={14} />
                Add condition
              </Button>
              <p className='text-xs text-muted-foreground'>
                JSON body values accept numbers, booleans, null, or text. An empty condition list matches every request.
              </p>
            </div>
            <MockResponseEditor
              id={`scenario-${index}`}
              response={scenario.response}
              methods={methods}
              locales={locales}
              onChange={(response) => update(index, { ...scenario, response })}
              onIssue={onIssue}
            />
          </div>
        </details>
      ))}
    </section>
  )
}
