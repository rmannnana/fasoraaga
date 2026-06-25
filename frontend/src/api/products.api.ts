import axiosInstance from './axiosInstance'
import type { Product } from '../types/product.types'
import type { PaginatedResponse } from '../types/api.types'

export interface ProductPayload {
    name: string
    description?: string
    category: number
    indicative_price: string
    unit: string
    quantity_available?: string | null
    status: 'disponible' | 'sur_commande' | 'indisponible'
}

export const productsApi = {
    getOne: async (id: number): Promise<Product> => {
        const { data } = await axiosInstance.get(`/products/${id}/`)
        return data
    },

    getMyProducts: async (enterpriseId: number): Promise<PaginatedResponse<Product>> => {
        const { data } = await axiosInstance.get('/products/', {
            params: { enterprise: enterpriseId }
        })
        return data
    },

    create: async (payload: ProductPayload): Promise<Product> => {
        const { data } = await axiosInstance.post('/products/', payload)
        return data
    },

    update: async (id: number, payload: Partial<ProductPayload>): Promise<Product> => {
        const { data } = await axiosInstance.patch(`/products/${id}/`, payload)
        return data
    },

    delete: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/products/${id}/`)
    },

    uploadImage: async (productId: number, file: File): Promise<void> => {
        const formData = new FormData()
        formData.append('image', file)
        await axiosInstance.post(`/products/${productId}/images/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
}