import { useQuery } from '@tanstack/react-query'
import { productsApi } from '../../../api/products.api'

export const productKeys = {
    detail: (id: number) => ['products', 'detail', id] as const,
}

export function useProduct(id: number) {
    return useQuery({
        queryKey: productKeys.detail(id),
        queryFn: () => productsApi.getOne(id),
        enabled: !!id,
    })
}