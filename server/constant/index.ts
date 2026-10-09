import { allLocales, faker, type LocaleDefinition } from '@faker-js/faker'
import { z } from 'zod'
export const localeMap: Record<string, LocaleDefinition> = allLocales
export const Locales = z.enum(Object.keys(allLocales) as [string, ...string[]])
// Discover public module methods from the installed Faker release. Internal
// properties and prototype paths never become callable schema methods.
export const fakerMethodNames = Object.entries(faker)
  .filter(([category]) => category !== 'fakerCore')
  .flatMap(([category, module]) =>
    Object.keys(module)
      .filter(
        (method) =>
          method !== 'faker' &&
          !['fake', 'fromRegExp', 'mustache', 'uniqueArray'].includes(method) &&
          typeof (module as unknown as Record<string, unknown>)[method] === 'function',
      )
      .map((method) => `${category}.${method}`),
  )
  .sort()
export const FakerMethods = z.enum(['custom.date', 'custom.literal', 'custom.customFunction', ...fakerMethodNames] as [
  string,
  ...string[],
])
export const allowedFakerMethods = new Set(FakerMethods.options)
