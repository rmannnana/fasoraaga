import axiosInstance from './axiosInstance'
import type { PaginatedResponse } from '../types/api.types'

export interface SubSector {
    id: number
    name: string
    description: string
}

export interface Category {
    id: number
    name: string
    description: string
    sub_sector: number
    sub_sector_name: string
}

export const categoriesApi = {
    getSubSectors: async (): Promise<PaginatedResponse<SubSector>> => {
        const { data } = await axiosInstance.get('/sub-sectors/')
        return data
    },

    getCategories: async (subSectorId?: number): Promise<PaginatedResponse<Category>> => {
        const params = subSectorId ? { sub_sector: subSectorId } : {}
        const { data } = await axiosInstance.get('/categories/', { params })
        return data
    },
}