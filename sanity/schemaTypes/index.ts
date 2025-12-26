import { type SchemaTypeDefinition } from 'sanity'

import { categoryType } from './categoryType'
import { customerType } from './customerType'
import { heroSettingsType } from './heroSettingsType'
import { orderType } from './orderType'
import { productType } from './productType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [categoryType, customerType, heroSettingsType, productType, orderType],
}
