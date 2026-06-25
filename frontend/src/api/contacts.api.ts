import axiosInstance from './axiosInstance'
import type { PaginatedResponse } from '../types/api.types'

export interface ContactRequest {
    id: number
    sender: {
        id: number
        name: string
        logo: string | null
        region: string
    }
    receiver: {
        id: number
        name: string
        logo: string | null
        region: string
    }
    message: string
    status: 'pending' | 'accepted' | 'declined'
    created_at: string
    responded_at: string | null
}

export interface Conversation {
    id: number
    contact_request: ContactRequest
    unread_count: number
    messages: Message[]
    created_at: string
    updated_at: string
}

export interface Message {
    id: number
    sender: number
    sender_name: string
    content: string
    is_read: boolean
    created_at: string
}

export const contactsApi = {
    getRequests: async (): Promise<PaginatedResponse<ContactRequest>> => {
        const { data } = await axiosInstance.get('/contact-requests/')
        return data
    },

    sendRequest: async (payload: {
        receiver: number
        message: string
    }): Promise<ContactRequest> => {
        const { data } = await axiosInstance.post('/contact-requests/', payload)
        return data
    },

    accept: async (id: number): Promise<Conversation> => {
        const { data } = await axiosInstance.post(`/contact-requests/${id}/accept/`)
        return data
    },

    decline: async (id: number): Promise<ContactRequest> => {
        const { data } = await axiosInstance.post(`/contact-requests/${id}/decline/`)
        return data
    },

    getConversations: async (): Promise<PaginatedResponse<Conversation>> => {
        const { data } = await axiosInstance.get('/conversations/')
        return data
    },

    getConversation: async (id: number): Promise<Conversation> => {
        const { data } = await axiosInstance.get(`/conversations/${id}/`)
        return data
    },

    sendMessage: async (conversationId: number, content: string): Promise<Message> => {
        const { data } = await axiosInstance.post(`/conversations/${conversationId}/messages/`, { content })
        return data
    },

    markRead: async (conversationId: number): Promise<void> => {
        await axiosInstance.post(`/conversations/${conversationId}/mark_read/`)
    },
}