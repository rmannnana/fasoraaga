import axiosInstance from './axiosInstance'
import type { Product } from '../types/product.types'

export const productsApi = {
    getOne: async (id: number): Promise<Product> => {
        const { data } = await axiosInstance.get(`/products/${id}/`)
        return data
    },
}