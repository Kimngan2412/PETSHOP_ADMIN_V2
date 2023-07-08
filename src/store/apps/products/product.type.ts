import { BaseType } from 'src/types'

export interface ProductType extends BaseType {
  productName?: string
  desciption?: string
  originalPrice?: string
  size?: string
  quantity?: number
  categoriesId?: number
  status?: string
}
