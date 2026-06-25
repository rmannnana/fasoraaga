import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { entreprisesApi } from '../../../api/entreprises.api'
import type { EntreprisePayload } from '../../../types/entreprise.types'

export const entrepriseKeys = {
    detail: (id: number) => ['entreprises', 'detail', id] as const,
    products: (id: number) => ['entreprises', 'products', id] as const,
    mine: ['entreprises', 'mine'] as const,
}

export function useEntreprise(id: number) {
    return useQuery({
        queryKey: entrepriseKeys.detail(id),
        queryFn: () => entreprisesApi.getOne(id),
        enabled: !!id,
    })
}

export function useMyEnterprise() {
    return useQuery({
        queryKey: entrepriseKeys.mine,
        queryFn: entreprisesApi.getMyEnterprise,
        retry: false,
    })
}

export function useEntrepriseProducts(id: number) {
    return useQuery({
        queryKey: entrepriseKeys.products(id),
        queryFn: () => entreprisesApi.getProducts(id),
        enabled: !!id,
    })
}

export function useUpdateEntreprise() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: EntreprisePayload }) =>
            entreprisesApi.update(id, payload),
        onSuccess: (updated) => {
            queryClient.invalidateQueries({ queryKey: entrepriseKeys.mine })
            queryClient.invalidateQueries({ queryKey: entrepriseKeys.detail(updated.id) })
            toast.success('Entreprise mise à jour.')
        },
        onError: () => {
            toast.error('Erreur lors de la mise à jour.')
        },
    })
}

export function useUpdateEntrepriseLogo() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, file }: { id: number; file: File }) =>
            entreprisesApi.updateLogo(id, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: entrepriseKeys.mine })
            toast.success('Logo mis à jour.')
        },
        onError: () => {
            toast.error('Erreur lors du téléchargement.')
        },
    })
}