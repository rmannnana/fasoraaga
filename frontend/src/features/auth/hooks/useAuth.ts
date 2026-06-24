import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authApi } from '../../../api/auth.api'
import { useAuthStore } from '../store/authStore'
import type { LoginPayload, RegisterPayload } from '../../../types/auth.types'

export function useLogin() {
    const { setAuth } = useAuthStore()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: async (payload: LoginPayload) => {
            const tokens = await authApi.login(payload)
            // Stocker le refresh token
            localStorage.setItem('refresh_token', tokens.refresh)
            // Récupérer le profil utilisateur
            const user = await authApi.getMe()
            return { tokens, user }
        },
        onSuccess: ({ tokens, user }) => {
            setAuth(user, tokens.access)
            toast.success(`Bienvenue, ${user.first_name} !`)
            navigate('/')
        },
        onError: () => {
            toast.error('Email ou mot de passe incorrect.')
        },
    })
}

export function useRegister() {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: (payload: RegisterPayload) => authApi.register(payload),
        onSuccess: () => {
            toast.success('Compte créé avec succès. Connectez-vous.')
            navigate('/auth?tab=login')
        },
        onError: () => {
            toast.error('Une erreur est survenue. Vérifiez vos informations.')
        },
    })
}

export function useLogout() {
    const { logout } = useAuthStore()
    const navigate = useNavigate()

    return () => {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
            authApi.logout(refreshToken).catch(() => { })
            localStorage.removeItem('refresh_token')
        }
        logout()
        navigate('/auth')
        toast.success('Déconnecté avec succès.')
    }
}