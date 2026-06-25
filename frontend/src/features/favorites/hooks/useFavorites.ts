import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { favoritesApi } from '../../../api/favorites.api'
import { useAuthStore } from '../../auth/store/authStore'

export const favoriteKeys = {
    all: ['favorites'] as const,
}

export function useFavorites() {
    const { isAuthenticated } = useAuthStore()

    return useQuery({
        queryKey: favoriteKeys.all,
        queryFn: favoritesApi.getAll,
        enabled: isAuthenticated,
    })
}

export function useAddFavorite() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ type, id }: { type: 'enterprise' | 'product'; id: number }) =>
            type === 'enterprise'
                ? favoritesApi.addEnterprise(id)
                : favoritesApi.addProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: favoriteKeys.all })
            toast.success('Ajouté aux favoris.')
        },
        onError: () => {
            toast.error('Erreur lors de l\'ajout.')
        },
    })
}

export function useRemoveFavorite() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (favoriteId: number) => favoritesApi.remove(favoriteId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: favoriteKeys.all })
            toast.success('Retiré des favoris.')
        },
        onError: () => {
            toast.error('Erreur lors de la suppression.')
        },
    })
}