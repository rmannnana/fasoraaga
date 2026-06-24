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
}