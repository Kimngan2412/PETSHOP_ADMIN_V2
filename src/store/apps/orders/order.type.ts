import { BaseType } from 'src/types'

export interface OrderType extends BaseType {
  userId?: number
  shippingId?: number
  isActive?: boolean
  orderDetails?: any
  address?: any
}
