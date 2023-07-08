// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosResponse } from 'axios'
import { LIMIT_PAGE } from 'src/common'
import axios from 'src/configs/axios-interceptor'
import { PaginationResponse, Redux } from 'src/types'
import { RoleType } from './role.type'

export interface DataParams {
  keyword: string
  status?: number | null
  page?: number
  limit?: number
}

// interface TakeProxyNote {
//   key: string
//   note: string
// }

export const fetchData = createAsyncThunk('roles/get', async (params: DataParams) => {
  const response: AxiosResponse<PaginationResponse<RoleType>> = await axios.get('/roles', {
    params
  })

  return response.data
})

export const addEntity = createAsyncThunk('roles/add', async (data: any, { dispatch }: Redux) => {
  const response = await axios.post('/roles', data)
  dispatch(fetchData({ keyword: '', page: 1, limit: LIMIT_PAGE }))

  return response.data
})

export const fetchRole = createAsyncThunk<RoleType, number>('roles/fetchById', async (id: number) => {
  const response = await axios.get<RoleType>(`/roles/${id}`)

  return response.data
})

export const updateEntity = createAsyncThunk(
  'roles/update',
  async ({ id, data }: { id: number; data: any }, { dispatch }: Redux) => {
    console.log(data)
    const response = await axios.put(`/roles/${id}`, data)
    dispatch(fetchData({ keyword: '', page: 1, limit: LIMIT_PAGE }))

    return response.data
  }
)

export const deleteRoles = createAsyncThunk('roles/delete', async (id: number, { dispatch }: Redux) => {
  try {
    await axios.delete(`/roles/${id}`)
    dispatch(fetchData({ keyword: '', page: 1, limit: LIMIT_PAGE }))

    return id
  } catch (error) {
    console.error(error)
  }
})

interface RoleStore {
  data: RoleType[] | undefined
  total?: number
  params: {}
  allData: any[]
  passwordResseted: string
}

const initialState: RoleStore = {
  data: [],
  total: 1,
  params: {},
  allData: [],
  passwordResseted: ''
}

export const appUsersSlice = createSlice({
  name: 'roles',
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
