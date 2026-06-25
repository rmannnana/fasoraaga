import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { productsApi, type ProductPayload } from '../../../api/products.api'
import { categoriesApi } from '../../../api/categories.api'
import { useMyEnterprise } from '../../enterprises/hooks/useEntreprise'

export const productKeys = {
    detail: (id: number) => ['products', 'detail', id] as const,
    mine: ['products', 'mine'] as const,
}

export function useProduct(id: number) {
    return useQuery({
        queryKey: productKeys.detail(id),
        queryFn: () => productsApi.getOne(id),
        enabled: !!id,
    })
}

export function useMyProducts() {
    const { data: enterprise } = useMyEnterprise()

    return useQuery({
        queryKey: productKeys.mine,
        queryFn: () => productsApi.getMyProducts(enterprise!.id),
        enabled: !!enterprise,
    })
}

export function useSubSectors() {
    return useQuery({
        queryKey: ['subsectors'],
        queryFn: async () => {
            const data = await categoriesApi.getSubSectors()
            return data.results
        },
    })
}

export function useCategories(subSectorId?: number) {
    return useQuery({
        queryKey: ['categories', subSectorId],
        queryFn: async () => {
            const data = await categoriesApi.getCategories(subSectorId)
            return data.results
        },
    })
}

export function useCreateProduct() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: ProductPayload) => productsApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.mine })
            toast.success('Produit créé avec succès.')
        },
        onError: () => {
            toast.error('Erreur lors de la création.')
        },
    })
}

export function useUpdateProduct() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: Partial<ProductPayload> }) =>
            productsApi.update(id, payload),
        onSuccess: (updated) => {
            queryClient.invalidateQueries({ queryKey: productKeys.mine })
            queryClient.invalidateQueries({ queryKey: productKeys.detail(updated.id) })
            toast.success('Produit mis à jour.')
        },
        onError: () => {
            toast.error('Erreur lors de la mise à jour.')
        },
    })
}

export function useDeleteProduct() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => productsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.mine })
            toast.success('Produit supprimé.')
        },
        onError: () => {
            toast.error('Erreur lors de la suppression.')
        },
    })
}

export function useUploadProductImage() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ productId, file }: { productId: number; file: File }) =>
            productsApi.uploadImage(productId, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.mine })
            toast.success('Image ajoutée.')
        },
        onError: () => {
            toast.error('Erreur lors du téléchargement.')
        },
    })
}