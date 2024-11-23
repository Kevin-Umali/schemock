import { FakerMethods, Locales } from '../../constant'
import type { HonoRouteHandler } from '../../lib/types'
import type { EnumRoute } from './helper.route'

export const enumHandler: HonoRouteHandler<EnumRoute> = async (c) => {
  const { name } = c.req.valid('param')
  let options: string[] = []
  switch (name) {
    case 'faker':
      options = FakerMethods.options
      break
    case 'locale':
      options = Locales.options
      break
    default:
      options = []
  }

  return c.json({ data: options })
}
