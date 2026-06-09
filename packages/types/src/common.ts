export type ID = string

export interface Timestamps {
  createdAt: Date
  updatedAt: Date
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data: T | null
  error: string | null
}
