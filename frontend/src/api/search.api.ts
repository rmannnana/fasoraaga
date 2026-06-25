import axiosInstance from './axiosInstance'
import type { PaginatedResponse } from '../types/api.types'
import type { Product, ProductFilters, EnterpriseFilters } from '../types/product.types'
import type { Entreprise } from '../types/entreprise.types'

export const searchApi = {
    searchProducts: async (filters: ProductFilters): Promise<PaginatedResponse<Product>> => {
        const { data } = await axiosInstance.get('/products/', { params: filters })
        return data
    },

    searchEnterprises: async (filters: EnterpriseFilters): Promise<PaginatedResponse<Entreprise>> => {
        const { data } = await axiosInstance.get('/enterprises/', { params: filters })
        return data
    },

    getRecentProducts: async (): Promise<PaginatedResponse<Product>> => {
        const { data } = await axiosInstance.get('/products/', {
            params: { ordering: '-created_at', page_size: 4 }
        })
        return data
    },

    getRecentEnterprises: async (): Promise<PaginatedResponse<Entreprise>> => {
        const { data } = await axiosInstance.get('/enterprises/', {
            params: { ordering: '-created_at', page_size: 3 }
        })
        return data
    },
}