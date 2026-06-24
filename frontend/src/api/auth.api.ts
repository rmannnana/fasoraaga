import axiosInstance from './axiosInstance'
import type { AuthTokens, LoginPayload, RegisterPayload, User } from '../types/auth.types'

export const authApi = {
    login: async (payload: LoginPayload): Promise<AuthTokens> => {
        const { data } = await axiosInstance.post('/auth/token/', payload)
        return data
    },

    register: async (payload: RegisterPayload): Promise<User> => {
        const { data } = await axiosInstance.post('/auth/register/', payload)
        return data
    },

    getMe: async (): Promise<User> => {
        const { data } = await axiosInstance.get('/profile/')
        return data
    },

    logout: async (refreshToken: string): Promise<void> => {
        await axiosInstance.post('/auth/token/blacklist/', { refresh: refreshToken })
    },

    changePassword: async (payload: {
        old_password: string
        new_password: string
    }): Promise<void> => {
        await axiosInstance.post('/profile/password/', payload)
    },
}