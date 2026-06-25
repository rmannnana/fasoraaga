import axiosInstance from './axiosInstance'
import type { PaginatedResponse } from '../types/api.types'

export interface Notification {
    id: number
    title: string
    content: string
    type: 'contact_request' | 'contact_accepted' | 'new_message' | 'system'
    is_read: boolean
    created_at: string
}

export const notificationsApi = {
    getAll: async (): Promise<PaginatedResponse<Notification>> => {
        const { data } = await axiosInstance.get('/notifications/')
        return data
    },

    markRead: async (id: number): Promise<Notification> => {
        const { data } = await axiosInstance.post(`/notifications/${id}/mark_read/`)
        return data
    },

    markAllRead: async (): Promise<void> => {
        await axiosInstance.post('/notifications/mark_all_read/')
    },
}