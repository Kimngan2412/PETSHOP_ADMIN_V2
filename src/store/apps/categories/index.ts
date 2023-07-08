// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosResponse } from 'axios'
import axios from 'src/configs/axios-interceptor'
import { PaginationResponse, Redux } from 'src/types'
import { CategoryType } from './category.type'
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

export const fetchAllCategories = createAsyncThunk('categories/get', async (params: DataParams) => {
  const response: AxiosResponse<PaginationResponse<CategoryType>> = await axios.get('/categories', {
    params
  })

  return response.data
})

export const addEntity = createAsyncThunk('categories/add', async (data: any, { dispatch }: Redux) => {
  const response = await axios.post('/categories', data)
  dispatch(fetchAllCategories({ keyword: '', page: 1, limit: LIMIT_PAGE }))

  return response.data
})

export const deleteCategories = createAsyncThunk('categories/delete', async (id: number, { dispatch }: Redux) => {
  try {
    await axios.delete(`/categories/${id}`)
    dispatch(fetchAllCategories({ keyword: '', page: 1, limit: LIMIT_PAGE }))

    return id
  } catch (error) {
    console.error(error)
  }
})

export const fetchCategories = createAsyncThunk<CategoryType, number>('roles/fetchById', async (id: number) => {
  const response = await axios.get<CategoryType>(`/categories/${id}`)

  return response.data
})

export const updateEntity = createAsyncThunk(
  'categories/update',
  async ({ id, data }: { id: number; data: any }, { dispatch }: Redux) => {
    console.log(data)
    const response = await axios.put(`/categories/${id}`, data)
    dispatch(fetchAllCategories({ keyword: '', page: 1, limit: LIMIT_PAGE }))

    return response.data
  }
)

interface CategoryStore {
  data: CategoryType[] | undefined
  total?: number
  params: {}
  allData: any[]
}

const initialState: CategoryStore = {
  data: [],
  total: 1,
  params: {},
  allData: []
}

export const appUsersSlice = createSlice({
  name: 'categories',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAllCategories.fulfilled, (state, action) => {
      const result = action.payload
      state.data = result?.items
      state.total = result?.meta?.totalItems
    })
  }
})

export default appUsersSlice.reducer
