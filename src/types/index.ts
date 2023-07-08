import { Dispatch } from '@reduxjs/toolkit'

export interface BaseType {
  id?: number
  createdBy?: number
  createdAt?: Date
  updatedBy?: number
  updatedAt?: Date
  isActive?: boolean
}
export interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export interface MetaPaginationResponse {
  currentPage: number
  itemCount: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

export interface PaginationResponse<T> {
  items?: T[]
  meta?: MetaPaginationResponse
}
