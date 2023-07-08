// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'
import roles from './apps/roles'
import users from './apps/users'
import categories from './apps/categories'
import products from './apps/products'
import orders from './apps/orders'

// ** Reducers

export const store = configureStore({
  reducer: {
    roles,
    users,
    categories,
    products,
    orders
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
