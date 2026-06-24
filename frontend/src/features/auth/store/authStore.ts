import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../../../types/auth.types'

interface AuthState {
    user: User | null
    accessToken: string | null
    isAuthenticated: boolean
    setAuth: (user: User, accessToken: string) => void
    setAccessToken: (token: string) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,

            setAuth: (user, accessToken) =>
                set({ user, accessToken, isAuthenticated: true }),

            setAccessToken: (token) =>
                set({ accessToken: token }),

            logout: () =>
                set({ user: null, accessToken: null, isAuthenticated: false }),
        }),
        {
            name: 'fasoraaga-auth', // clé dans localStorage
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)