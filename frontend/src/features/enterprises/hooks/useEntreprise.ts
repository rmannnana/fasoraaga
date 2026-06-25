import { useQuery } from '@tanstack/react-query'
import { entreprisesApi } from '../../../api/entreprises.api'

export const entrepriseKeys = {
    detail: (id: number) => ['entreprises', 'detail', id] as const,
    products: (id: number) => ['entreprises', 'products', id] as const,
}

export function useEntreprise(id: number) {
    return useQuery({
        queryKey: entrepriseKeys.detail(id),
        queryFn: () => entreprisesApi.getOne(id),
        enabled: !!id,
    })
}

export function useEntrepriseProducts(id: number) {
    return useQuery({
        queryKey: entrepriseKeys.products(id),
        queryFn: () => entreprisesApi.getProducts(id),
        enabled: !!id,
    })
}