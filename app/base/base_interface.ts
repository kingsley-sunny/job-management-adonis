import { LucidRow, ModelAttributes } from '@adonisjs/lucid/types/model'
import { DateTime } from 'luxon'

export interface ExceptionResponse {
  statusCode: number
  message: string | string[] | object
  error: boolean
  path?: string
  resource?: string
  timestamp: string
}

export interface ResponseType {
  statusCode: number
  message: string
  data: Record<any, any>
  timestamp: string
  path?: string
  resource?: string
}

export interface BaseModelInterface {
  id: string
  updated_at: DateTime
  created_at: DateTime
}

export interface SearchFilter {
  search?: string
  filterBy?: string
  orderBy?: string
  order?: 'asc' | 'desc'
}

export type FetchQuery = SearchFilter & {
  page?: number
  perPage?: number
}

export type FetchColumn<T extends LucidRow> = Partial<ModelAttributes<T>>
