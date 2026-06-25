import axiosInstance from './axiosInstance'
import type { PaginatedResponse } from '../types/api.types'

export interface EnterpriseDetail {
    id: number
    name: string
    description: string
    logo: string | null
    region: string
}

export interface ProductDetail {
    id: number
    name: string
    indicative_price: string
    unit: string
    images: { id: number; image: string; alt_text: string }[]
    status: 'disponible' | 'sur_commande' | 'indisponible'
    enterprise_name: string
    region: string
    category_name: string
}

export interface Favorite {
    id: number
    user: number
    enterprise: number | null
    product: number | null
    enterprise_detail: EnterpriseDetail | null
    product_detail: ProductDetail | null
    created_at: string
}

export const favoritesApi = {
    getAll: async (): Promise<PaginatedResponse<Favorite>> => {
        const { data } = await axiosInstance.get('/favorites/')
        return data
    },

    addEnterprise: async (enterpriseId: number): Promise<Favorite> => {
        const { data } = await axiosInstance.post('/favorites/', { enterprise: enterpriseId })
        return data
    },

    addProduct: async (productId: number): Promise<Favorite> => {
        const { data } = await axiosInstance.post('/favorites/', { product: productId })
        return data
    },

    remove: async (favoriteId: number): Promise<void> => {
        await axiosInstance.delete(`/favorites/${favoriteId}/`)
    },
}