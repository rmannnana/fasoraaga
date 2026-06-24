export interface PaginatedResponse<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

export interface ApiError {
    detail?: string
    [key: string]: unknown
}