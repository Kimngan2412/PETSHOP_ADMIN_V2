// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosResponse } from 'axios'
import axios from 'src/configs/axios-interceptor'
import { PaginationResponse, Redux } from 'src/types'
import { UserType } from './user.type'
import { LIMIT_PAGE } from 'src/common'

export interface DataParams {
  keyword: string
  status?: number | null
  page: number
  limit: number
}

export const fetchData = createAsyncThunk('users/get', async (params: DataParams) => {
  const response: AxiosResponse<PaginationResponse<UserType>> = await axios.get('/users', {
    params
  })

  return response.data
})

export const addEntity = createAsyncThunk('users/add', async (data: any, { dispatch }: Redux) => {
  const response = await axios.post('/users', data)
  dispatch(fetchData({ keyword: '', page: 1, limit: LIMIT_PAGE }))

  return response.data
})
export const fetchUser = createAsyncThunk<UserType, number>('users/fetchById', async (id: number) => {
  const response = await axios.get<UserType>(`/users/getById/${id}`)

  return response.data
})

export const updateEntity = createAsyncThunk(
  'users/update',
  async ({ id, data }: { id: number; data: any }, { dispatch }: Redux) => {
    console.log('data', data)
    const response = await axios.put(`/users/updateUserInfo/${id}`, data)
    dispatch(fetchData({ keyword: '', page: 1, limit: LIMIT_PAGE }))

    return response.data
  }
)

export const deleteUsers = createAsyncThunk('users/delete', async (id: number, { dispatch }: Redux) => {
  try {
    await axios.delete(`/users/${id}`)
    dispatch(fetchData({ keyword: '', page: 1, limit: LIMIT_PAGE }))

    return id
  } catch (error) {
    console.error(error)
  }
})

interface UserStore {
  data: UserType[] | undefined
  total?: number
  params: {}
  allData: any[]
}

const initialState: UserStore = {
  data: [],
  total: 1,
  params: {},
  allData: []
}

export const appUsersSlice = createSlice({
  name: 'users',
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
