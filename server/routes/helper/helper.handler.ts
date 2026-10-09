import { CUSTOM_GENERATORS } from '../../constant/generator-metadata'
import { FakerMethods, Locales } from '../../constant'
import { FakerFunctions } from '../../constant/faker-method'
import { fakerMethodNames } from '../../constant'
import type { HonoRouteHandler } from '../../lib/types'
import type { EnumRoute, FakerMethodRoute } from './helper.route'
export const enumHandler: HonoRouteHandler<EnumRoute> = async (c) => {
  const { name } = c.req.valid('param')
  const options = name === 'faker' ? FakerMethods.options : name === 'locale' ? Locales.options : []
  return c.json({ data: options })
}
export const fakerMethodHandler: HonoRouteHandler<FakerMethodRoute> = async (c) => {
  const documentation = new Map(
    FakerFunctions.flatMap((category) => category.items.map((item) => [item.method, item] as const)),
  )
  const groups = new Map<string, (typeof FakerFunctions)[number]>()
  for (const method of fakerMethodNames) {
    const category = method.split('.')[0]
    if (!groups.has(category)) groups.set(category, { category, description: `Generate ${category} data.`, items: [] })
    groups.get(category)!.items.push(
      method === 'internet.email' || method === 'internet.exampleEmail'
        ? {
            method,
            description: 'Generate a fake email on the reserved example.test domain. Custom providers are ignored.',
            parameters: '{ firstName?: string; lastName?: string; allowSpecialCharacters?: boolean }',
            example: 'alex@example.test',
          }
        : documentation.get(method) || {
            method,
            description: `Generate a value using ${method}.`,
            parameters: '',
            example: '',
          },
    )
  }
  return c.json({ data: [CUSTOM_GENERATORS, ...groups.values()] })
}
