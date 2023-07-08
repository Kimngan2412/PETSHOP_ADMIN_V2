// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosResponse } from 'axios'
import axios from 'src/configs/axios-interceptor'
import { PaginationResponse, Redux } from 'src/types'
import { ProductType } from './product.type'
import { LIMIT_PAGE } from 'src/common'

export interface DataParams {
  keyword: string
  status?: number | null
  page: number
  limit: number
}

// interface TakeProxyNote {
//   key: string
//   note: string
// }

export const fetchData = createAsyncThunk('products/get', async (params: DataParams) => {
  const response: AxiosResponse<PaginationResponse<ProductType>> = await axios.get('/products', {
    params
  })

  return response.data
})

export const addEntity = createAsyncThunk('products/add', async (data: any, { dispatch }: Redux) => {
  const response = await axios.post('/products/new-create-product', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  dispatch(fetchData({ keyword: '', page: 1, limit: LIMIT_PAGE }))

  return response.data
})

export const deleteProduct = createAsyncThunk('products/delete', async (id: number, { dispatch }: Redux) => {
  try {
    await axios.delete(`/products/${id}`)
    dispatch(fetchData({ keyword: '', page: 1, limit: LIMIT_PAGE }))

    return id
  } catch (error) {
    console.error(error)
  }
})

export const fetchProduct = createAsyncThunk<ProductType, number>('products/fetchById', async (id: number) => {
  const response = await axios.get<ProductType>(`/products/${id}`)

  return response.data
})

export const updateEntity = createAsyncThunk(
  'products/update',
  async ({ id, data }: { id: number; data: any }, { dispatch }: Redux) => {
    const response = await axios.put(`/products/${id}`, data)
    dispatch(fetchData({ keyword: '', page: 1, limit: LIMIT_PAGE }))

    return response.data
  }
)

// export const addNote = createAsyncThunk('roles/add', async (data: TakeProxyNote, { dispatch }: Redux) => {
//   const response = await axios.post('/proxy', data)
//   dispatch(fetchData({ keyword: '', pageIndex: 0, pageSize: LIMIT_PAGE }))

//   return response.data
// })

interface ProductStore {
  data: ProductType[] | undefined
  total?: number
  params: {}
  allData: any[]
}

const initialState: ProductStore = {
  data: [],
  total: 1,
  params: {},
  allData: []
}

export const appUsersSlice = createSlice({
  name: 'products',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      const result = action.payload
      state.data = result?.items
      state.total = result?.meta?.totalItems
    })
  }
})

export default appUsersSlice.reducer
