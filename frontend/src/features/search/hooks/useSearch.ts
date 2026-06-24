import { useQuery } from '@tanstack/react-query'
import { searchApi } from '../../../api/search.api'
import type { ProductFilters, EnterpriseFilters } from '../../../types/product.types'

export const searchKeys = {
    products: (filters: ProductFilters) => ['search', 'products', filters] as const,
    enterprises: (filters: EnterpriseFilters) => ['search', 'enterprises', filters] as const,
}

export function useSearchProducts(filters: ProductFilters, enabled = true) {
    return useQuery({
        queryKey: searchKeys.products(filters),
        queryFn: () => searchApi.searchProducts(filters),
        enabled: enabled && (!!filters.q || !!filters.sector || !!filters.region),
    })
}

export function useSearchEnterprises(filters: EnterpriseFilters, enabled = true) {
    return useQuery({
        queryKey: searchKeys.enterprises(filters),
        queryFn: () => searchApi.searchEnterprises(filters),
        enabled: enabled && (!!filters.q || !!filters.sector || !!filters.region),
    })
}