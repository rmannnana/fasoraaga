import axiosInstance from './axiosInstance'
import type { Entreprise, EntreprisePayload } from '../types/entreprise.types'
import type { PaginatedResponse } from '../types/api.types'
import type { Product } from '../types/product.types'

export const entreprisesApi = {
    getOne: async (id: number): Promise<Entreprise> => {
        const { data } = await axiosInstance.get(`/enterprises/${id}/`)
        return data
    },

    getMyEnterprise: async (): Promise<Entreprise> => {
        const { data } = await axiosInstance.get('/enterprises/me/')
        return data
    },

    getProducts: async (enterpriseId: number): Promise<PaginatedResponse<Product>> => {
        const { data } = await axiosInstance.get('/products/', {
            params: { enterprise: enterpriseId }
        })
        return data
    },

    update: async (id: number, payload: EntreprisePayload): Promise<Entreprise> => {
        const { data } = await axiosInstance.patch(`/enterprises/${id}/`, payload)
        return data
    },

    updateLogo: async (id: number, file: File): Promise<Entreprise> => {
        const formData = new FormData()
        formData.append('logo', file)
        const { data } = await axiosInstance.patch(`/enterprises/${id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        return data
    },
}