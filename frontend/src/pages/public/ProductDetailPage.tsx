import { useParams, useNavigate } from 'react-router-dom'
import {
    ArrowLeft, Heart, MessageCircle, Package,
    MapPin, Tag, Layers, CheckCircle, Clock, XCircle
} from 'lucide-react'
import { useProduct } from '../../features/products/hooks/useProduct'
import EmptyState from '../../components/shared/EmptyState'
import Badge from '../../components/ui/Badge'
import { useAuthStore } from '../../features/auth/store/authStore'
import { useAddFavorite } from '../../features/favorites/hooks/useFavorites'

const statusConfig = {
    disponible: { label: 'Disponible', color: 'green' as const, icon: CheckCircle },
    sur_commande: { label: 'Sur commande', color: 'yellow' as const, icon: Clock },
    indisponible: { label: 'Indisponible', color: 'gray' as const, icon: XCircle },
}

export default function ProductDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { isAuthenticated } = useAuthStore()

    const productQuery = useProduct(Number(id))
    const addFavorite = useAddFavorite()

    if (productQuery.isLoading) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-4 animate-pulse">
                <div className="h-64 bg-gray-100 rounded-2xl" />
                <div className="h-6 bg-gray-100 rounded w-1/2" />
                <div className="h-4 bg-gray-100 rounded w-1/3" />
            </div>
        )
    }

    if (productQuery.isError || !productQuery.data) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-6">
                <EmptyState
                    icon={Package}
                    title="Produit introuvable"
                    description="Ce produit n'existe pas ou a été supprimé."
                    action={{ label: 'Retour à la recherche', onClick: () => navigate('/search') }}
                />
            </div>
        )
    }

    const p = productQuery.data
    const { label, color } = statusConfig[p.status]
    const price = parseFloat(p.indicative_price)
    const firstImage = p.images?.[0]?.image ?? null

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">

            {/* Retour */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
                <ArrowLeft size={16} /> Retour
            </button>

            {/* Image principale */}
            <div className="bg-gray-100 rounded-2xl overflow-hidden h-64 md:h-80 flex items-center justify-center">
                {firstImage ? (
                    <img src={firstImage} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-300">
                        <Package size={48} />
                        <span className="text-sm">Pas d'image</span>
                    </div>
                )}
            </div>
            {/* Infos principales */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                        <h1 className="text-xl font-bold text-gray-900">{p.name}</h1>
                        <p className="text-2xl font-bold text-green-700">
                            {price.toLocaleString('fr-FR')} FCFA
                            <span className="text-sm font-normal text-gray-400"> / {p.unit}</span>
                        </p>
                    </div>
                    <button
                        onClick={() => isAuthenticated
                            ? addFavorite.mutate({ type: 'product', id: Number(id) })
                            : navigate('/auth')
                        }
                        className="p-2 hover:text-red-500 transition-colors shrink-0"
                    >
                        <Heart size={20} className="text-gray-300" />
                    </button>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                    <Badge label={label} color={color} />
                    {p.category_name && <Badge label={p.category_name} color="gray" />}
                </div>

                {/* Détails */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                    {p.quantity_available !== null && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Layers size={15} className="text-gray-400" />
                            <span>Quantité : <strong>{p.quantity_available} {p.unit}</strong></span>
                        </div>
                    )}
                    {p.category_name && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Tag size={15} className="text-gray-400" />
                            <span>{p.category_name}</span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <button
                        onClick={() => navigate(isAuthenticated ? `/enterprises/${p.enterprise}` : '/auth')}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl text-sm transition-colors"
                    >
                        <MessageCircle size={16} />
                        Contacter l'entreprise
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 hover:bg-gray-50 rounded-xl text-sm text-gray-600 transition-colors">
                        <Heart size={16} />
                    </button>
                </div>
            </div>

            {/* Description */}
            {p.description && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-2">
                    <h2 className="text-base font-bold text-gray-800">Description</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">{p.description}</p>
                </div>
            )}

            {/* Entreprise propriétaire */}
            <div
                onClick={() => navigate(`/enterprises/${p.enterprise}`)}
                className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
            >
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                    <span className="text-xl font-bold text-gray-300">
                        {p.enterprise_name?.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-0.5">Proposé par</p>
                    <p className="font-semibold text-gray-800 text-sm">{p.enterprise_name}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <MapPin size={11} />
                        <span>{p.region}</span>
                    </div>
                </div>
                <ArrowLeft size={16} className="text-gray-300 rotate-180" />
            </div>

        </div>
    )
}