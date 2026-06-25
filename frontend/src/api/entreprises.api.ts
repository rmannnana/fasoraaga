import axiosInstance from './axiosInstance'
import type { Entreprise } from '../types/entreprise.types'
import type { PaginatedResponse } from '../types/api.types'
import type { Product } from '../types/product.types'

export const entreprisesApi = {
    getOne: async (id: number): Promise<Entreprise> => {
        const { data } = await axiosInstance.get(`/enterprises/${id}/`)
        return data
    },

    getProducts: async (entrepriseId: number): Promise<PaginatedResponse<Product>> => {
        const { data } = await axiosInstance.get('/products/', {
            params: { entreprise: entrepriseId }
        })
        return data
    },
}