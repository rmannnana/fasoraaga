import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
    Plus, Pencil, Trash2, Loader2, Package,
    X, ImagePlus, ChevronDown
} from 'lucide-react'
import {
    useMyProducts, useSubSectors, useCategories,
    useCreateProduct, useUpdateProduct, useDeleteProduct,
    useUploadProductImage,
} from '../../features/products/hooks/useProduct'
import { useMyEnterprise } from '../../features/enterprises/hooks/useEntreprise'
import EmptyState from '../../components/shared/EmptyState'
import Badge from '../../components/ui/Badge'
import type { Product } from '../../types/product.types'

const UNITS = ['kg', 'tonne', 'litre', 'pièce', 'tête', 'sac', 'autre']
const STATUS_OPTIONS = [
    { value: 'disponible', label: 'Disponible' },
    { value: 'sur_commande', label: 'Sur commande' },
    { value: 'indisponible', label: 'Indisponible' },
]

const statusConfig = {
    disponible: { label: 'Disponible', color: 'green' as const },
    sur_commande: { label: 'Sur commande', color: 'yellow' as const },
    indisponible: { label: 'Indisponible', color: 'gray' as const },
}

const productSchema = z.object({
    name: z.string().min(2, 'Nom requis'),
    description: z.string().optional(),
    category: z.string().min(1, 'Catégorie requise'),
    indicative_price: z.string().min(1, 'Prix requis'),
    unit: z.string().min(1, 'Unité requise'),
    quantity_available: z.string().optional(),
    status: z.enum(['disponible', 'sur_commande', 'indisponible']),
})

type ProductForm = z.infer<typeof productSchema>

// ── Modal formulaire ───────────────────────────────────────────────
function ProductFormModal({
    product,
    onClose,
}: {
    product?: Product
    onClose: () => void
}) {
    const [selectedSubSector, setSelectedSubSector] = useState<number | undefined>()
    const imageInputRef = useRef<HTMLInputElement>(null)

    const subSectorsQuery = useSubSectors()
    const categoriesQuery = useCategories(selectedSubSector)
    const createProduct = useCreateProduct()
    const updateProduct = useUpdateProduct()
    const uploadImage = useUploadProductImage()

    const isEdit = !!product

    const { register, handleSubmit, formState: { errors } } = useForm<ProductForm>({
        resolver: zodResolver(productSchema),
        values: product ? {
            name: product.name,
            description: product.description ?? '',
            category: String(product.category),
            indicative_price: product.indicative_price,
            unit: product.unit,
            quantity_available: product.quantity_available ?? '',
            status: product.status,
        } : {
            name: '',
            description: '',
            category: '',
            indicative_price: '',
            unit: 'kg',
            quantity_available: '',
            status: 'disponible',
        },
    })

    const onSubmit = (data: ProductForm) => {
        const payload = {
            name: data.name,
            description: data.description,
            category: Number(data.category),
            indicative_price: data.indicative_price,
            unit: data.unit,
            quantity_available: data.quantity_available || null,
            status: data.status,
        }

        if (isEdit) {
            updateProduct.mutate(
                { id: product.id, payload },
                { onSuccess: () => onClose() }
            )
        } else {
            createProduct.mutate(payload, {
                onSuccess: () => onClose(),
            })
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && product) {
            uploadImage.mutate({ productId: product.id, file })
        }
    }

    const isPending = createProduct.isPending || updateProduct.isPending

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 px-0 md:px-4">
            <div className="bg-white w-full md:max-w-lg rounded-t-2xl md:rounded-2xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
                    <h2 className="font-bold text-gray-800">
                        {isEdit ? 'Modifier le produit' : 'Nouveau produit'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">

                    {/* Nom */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Nom du produit</label>
                        <input
                            {...register('name')}
                            placeholder="Ex: Mil local de qualité"
                            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors
                ${errors.name ? 'border-red-400' : 'border-gray-200 focus:border-green-600'}`}
                        />
                        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            placeholder="Décrivez votre produit..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-600 text-sm outline-none transition-colors resize-none"
                        />
                    </div>

                    {/* Sous-secteur → Catégorie */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Sous-secteur</label>
                            <div className="relative">
                                <select
                                    onChange={(e) => setSelectedSubSector(Number(e.target.value) || undefined)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-600 text-sm outline-none appearance-none bg-white"
                                >
                                    <option value="">Tous</option>
                                    {subSectorsQuery.data?.map((s) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                            <div className="relative">
                                <select
                                    {...register('category')}
                                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none appearance-none bg-white
                    ${errors.category ? 'border-red-400' : 'border-gray-200 focus:border-green-600'}`}
                                >
                                    <option value="">Choisir</option>
                                    {categoriesQuery.data?.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-4 text-gray-400 pointer-events-none" />
                            </div>
                            {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
                        </div>
                    </div>

                    {/* Prix + Unité */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Prix indicatif (FCFA)</label>
                            <input
                                {...register('indicative_price')}
                                type="number"
                                placeholder="Ex: 5000"
                                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors
                  ${errors.indicative_price ? 'border-red-400' : 'border-gray-200 focus:border-green-600'}`}
                            />
                            {errors.indicative_price && <p className="text-xs text-red-500">{errors.indicative_price.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Unité</label>
                            <div className="relative">
                                <select
                                    {...register('unit')}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-600 text-sm outline-none appearance-none bg-white"
                                >
                                    {UNITS.map((u) => (
                                        <option key={u} value={u}>{u}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Quantité + Statut */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Quantité disponible</label>
                            <input
                                {...register('quantity_available')}
                                type="number"
                                placeholder="Optionnel"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-600 text-sm outline-none transition-colors"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Statut</label>
                            <div className="relative">
                                <select
                                    {...register('status')}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-600 text-sm outline-none appearance-none bg-white"
                                >
                                    {STATUS_OPTIONS.map((s) => (
                                        <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Upload image (seulement en mode édition) */}
                    {isEdit && (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Images</label>
                            <div className="flex flex-wrap gap-2">
                                {product.images?.map((img) => (
                                    <div key={img.id} className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                        <img src={img.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => imageInputRef.current?.click()}
                                    disabled={uploadImage.isPending}
                                    className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-green-600 transition-colors"
                                >
                                    {uploadImage.isPending
                                        ? <Loader2 size={16} className="animate-spin text-gray-400" />
                                        : <ImagePlus size={16} className="text-gray-400" />
                                    }
                                </button>
                            </div>
                            <input
                                ref={imageInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </div>
                    )}

                    {/* Bouton submit */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-3 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                    >
                        {isPending && <Loader2 size={16} className="animate-spin" />}
                        {isPending
                            ? (isEdit ? 'Modification...' : 'Création...')
                            : (isEdit ? 'Modifier le produit' : 'Créer le produit')
                        }
                    </button>
                </form>
            </div>
        </div>
    )
}

// ── Page principale ────────────────────────────────────────────────
export default function ProductManagementPage() {
    const [modalOpen, setModalOpen] = useState(false)
    const [editProduct, setEditProduct] = useState<Product | undefined>()

    const productsQuery = useMyProducts()
    const deleteProduct = useDeleteProduct()

    const products = productsQuery.data?.results ?? []

    const openCreate = () => {
        setEditProduct(undefined)
        setModalOpen(true)
    }

    const openEdit = (product: Product) => {
        setEditProduct(product)
        setModalOpen(true)
    }

    const handleDelete = (product: Product) => {
        if (confirm(`Supprimer "${product.name}" ?`)) {
            deleteProduct.mutate(product.id)
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Mes produits</h1>
                    <p className="text-sm text-gray-400">
                        {products.length} produit{products.length > 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl text-sm transition-colors"
                >
                    <Plus size={16} />
                    Nouveau produit
                </button>
            </div>

            {/* Liste */}
            {productsQuery.isLoading ? (
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <EmptyState
                    icon={Package}
                    title="Aucun produit"
                    description="Ajoutez votre premier produit pour le rendre visible sur la plateforme."
                    action={{ label: 'Ajouter un produit', onClick: openCreate }}
                />
            ) : (
                <div className="space-y-3">
                    {products.map((product) => {
                        const { label, color } = statusConfig[product.status]
                        const image = product.images?.[0]?.image ?? null

                        return (
                            <div
                                key={product.id}
                                className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4"
                            >
                                {/* Image */}
                                <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                                    {image ? (
                                        <img src={image} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package size={20} className="text-gray-300" />
                                        </div>
                                    )}
                                </div>

                                {/* Infos */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-800 text-sm line-clamp-1">{product.name}</p>
                                    <p className="text-green-700 font-bold text-sm">
                                        {parseFloat(product.indicative_price).toLocaleString('fr-FR')} FCFA
                                        <span className="text-gray-400 font-normal"> / {product.unit}</span>
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge label={label} color={color} />
                                        {product.category_name && (
                                            <span className="text-xs text-gray-400">{product.category_name}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        onClick={() => openEdit(product)}
                                        className="p-2 text-gray-400 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product)}
                                        disabled={deleteProduct.isPending}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <ProductFormModal
                    product={editProduct}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </div>
    )
}