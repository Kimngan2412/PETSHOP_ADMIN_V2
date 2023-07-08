// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosResponse } from 'axios'
import axios from 'src/configs/axios-interceptor'
import { PaginationResponse, Redux } from 'src/types'
import { LIMIT_PAGE } from 'src/common'
import { OrderType } from './order.type'

export interface DataParams {
  keyword: string
  status?: number | null
  page: number
  limit: number
}

export const fetchAllOrder = createAsyncThunk('orders/get', async (params: DataParams) => {
  const response: AxiosResponse<PaginationResponse<OrderType>> = await axios.get('/orders', {
    params
  })

  return response.data
})

export const addEntity = createAsyncThunk('orders/add', async (data: any, { dispatch }: Redux) => {
  const response = await axios.post('/orders', data)
  dispatch(fetchAllOrder({ keyword: '', page: 1, limit: LIMIT_PAGE }))

  return response.data
})

export const deleteOrder = createAsyncThunk('orders/delete', async (id: number, { dispatch }: Redux) => {
  try {
    await axios.delete(`/orders/${id}`)
    dispatch(fetchAllOrder({ keyword: '', page: 1, limit: LIMIT_PAGE }))

    return id
  } catch (error) {
    console.error(error)
  }
})

export const fetchOrder = createAsyncThunk<OrderType, number>('orders/fetchById', async (id: number) => {
  const response = await axios.get<OrderType>(`/orders/${id}`)

  return response.data
})

export const updateEntity = createAsyncThunk(
  'orders/update',
  async ({ id, data }: { id: number; data: any }, { dispatch }: Redux) => {
    console.log(data)
    const response = await axios.put(`/orders/${id}`, data)
    dispatch(fetchAllOrder({ keyword: '', page: 1, limit: LIMIT_PAGE }))

    return response.data
  }
)

interface OrderStore {
  data: OrderType[] | undefined
  total?: number
  params: {}
  allData: any[]
}

const initialState: OrderStore = {
  data: [],
  total: 1,
  params: {},
  allData: []
}

export const appOrdersSlice = createSlice({
  name: 'orders',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAllOrder.fulfilled, (state, action) => {
      const result = action.payload
      state.data = result?.items
      state.total = result?.meta?.totalItems
    })
  }
})

export default appOrdersSlice.reducer
