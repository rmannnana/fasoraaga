import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { authApi } from '../../../api/auth.api'
import { useAuthStore } from '../store/authStore'

export function useProfile() {
    const { setAuth, accessToken } = useAuthStore()

    return useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const user = await authApi.getMe()
            return user
        },
        enabled: !!accessToken,
    })
}

export function useUpdateProfile() {
    const queryClient = useQueryClient()
    const { user, accessToken, setAuth } = useAuthStore()

    return useMutation({
        mutationFn: (payload: Partial<{
            first_name: string
            last_name: string
            phone: string
            bio: string
        }>) => authApi.updateProfile(payload),
        onSuccess: (updatedUser) => {
            setAuth(updatedUser, accessToken!)
            queryClient.invalidateQueries({ queryKey: ['profile'] })
            toast.success('Profil mis à jour.')
        },
        onError: () => {
            toast.error('Erreur lors de la mise à jour.')
        },
    })
}

export function useUpdateProfilePicture() {
    const queryClient = useQueryClient()
    const { accessToken, setAuth } = useAuthStore()

    return useMutation({
        mutationFn: (file: File) => authApi.updateProfilePicture(file),
        onSuccess: (updatedUser) => {
            setAuth(updatedUser, accessToken!)
            queryClient.invalidateQueries({ queryKey: ['profile'] })
            toast.success('Photo de profil mise à jour.')
        },
        onError: () => {
            toast.error('Erreur lors du téléchargement.')
        },
    })
}

export function useChangePassword() {
    return useMutation({
        mutationFn: authApi.changePassword,
        onSuccess: () => {
            toast.success('Mot de passe modifié avec succès.')
        },
        onError: () => {
            toast.error('Mot de passe actuel incorrect.')
        },
    })
}