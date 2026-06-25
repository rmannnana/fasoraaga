import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Building2, Package, Trash2, MapPin, ArrowRight } from 'lucide-react'
import { useFavorites, useRemoveFavorite } from '../../features/favorites/hooks/useFavorites'
import EmptyState from '../../components/shared/EmptyState'
import Badge from '../../components/ui/Badge'

const statusConfig = {
    disponible: { label: 'Disponible', color: 'green' as const },
    sur_commande: { label: 'Sur commande', color: 'yellow' as const },
    indisponible: { label: 'Indisponible', color: 'gray' as const },
}

type Tab = 'enterprises' | 'products'

export default function FavoritesPage() {
    const [tab, setTab] = useState<Tab>('enterprises')
    const navigate = useNavigate()

    const favoritesQuery = useFavorites()
    const removeFavorite = useRemoveFavorite()

    const favorites = favoritesQuery.data?.results ?? []
    const enterpriseFavorites = favorites.filter((f) => f.enterprise !== null && f.enterprise !== undefined)
    const productFavorites = favorites.filter((f) => f.product !== null && f.product !== undefined)

    const activeList = tab === 'enterprises' ? enterpriseFavorites : productFavorites

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

            {/* En-tête */}
            <div className="space-y-1">
                <h1 className="text-xl font-bold text-gray-900">Mes favoris</h1>
                <p className="text-sm text-gray-400">
                    {enterpriseFavorites.length} entreprise{enterpriseFavorites.length > 1 ? 's' : ''} ·{' '}
                    {productFavorites.length} produit{productFavorites.length > 1 ? 's' : ''}
                </p>
            </div>

            {/* Onglets */}
            <div className="flex bg-gray-100 rounded-xl p-1">
                {([
                    { key: 'enterprises', label: 'Entreprises', icon: Building2, count: enterpriseFavorites.length },
                    { key: 'products', label: 'Produits', icon: Package, count: productFavorites.length },
                ] as const).map(({ key, label, icon: Icon, count }) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${tab === key
                                ? 'bg-white text-green-700 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Icon size={15} />
                        {label}
                        {count > 0 && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === key ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                                }`}>
                                {count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Contenu */}
            {favoritesQuery.isLoading ? (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : activeList.length === 0 ? (
                <EmptyState
                    icon={Heart}
                    title={tab === 'enterprises' ? 'Aucune entreprise favorite' : 'Aucun produit favori'}
                    description={
                        tab === 'enterprises'
                            ? 'Explorez les entreprises et ajoutez-les à vos favoris.'
                            : 'Explorez les produits et ajoutez-les à vos favoris.'
                    }
                    action={{
                        label: 'Explorer',
                        onClick: () => navigate('/search'),
                    }}
                />
            ) : tab === 'enterprises' ? (
                <div className="space-y-3">
                    {enterpriseFavorites.map((fav) => {
                        const e = fav.enterprise!
                        return (
                            <div
                                key={fav.id}
                                className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow"
                            >
                                {/* Logo */}
                                <div
                                    onClick={() => navigate(`/enterprises/${e.id}`)}
                                    className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center shrink-0 cursor-pointer"
                                >
                                    {e.logo ? (
                                        <img src={e.logo} alt={e.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xl font-bold text-gray-300">
                                            {e.name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>

                                {/* Infos */}
                                <div
                                    className="flex-1 min-w-0 cursor-pointer"
                                    onClick={() => navigate(`/enterprises/${e.id}`)}
                                >
                                    <p className="font-semibold text-gray-800 text-sm line-clamp-1">{e.name}</p>
                                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                                        <MapPin size={11} />
                                        <span>{e.region}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 line-clamp-1 mt-1">{e.description}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => navigate(`/enterprises/${e.id}`)}
                                        className="p-2 text-gray-400 hover:text-green-700 transition-colors"
                                    >
                                        <ArrowRight size={16} />
                                    </button>
                                    <button
                                        onClick={() => removeFavorite.mutate(fav.id)}
                                        disabled={removeFavorite.isPending}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="space-y-3">
                    {productFavorites.map((fav) => {
                        const p = fav.product!
                        const { label, color } = statusConfig[p.status]
                        const image = p.images?.[0]?.image ?? null

                        return (
                            <div
                                key={fav.id}
                                className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow"
                            >
                                {/* Image */}
                                <div
                                    onClick={() => navigate(`/products/${p.id}`)}
                                    className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0 cursor-pointer"
                                >
                                    {image ? (
                                        <img src={image} alt={p.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package size={20} className="text-gray-300" />
                                        </div>
                                    )}
                                </div>

                                {/* Infos */}
                                <div
                                    className="flex-1 min-w-0 cursor-pointer"
                                    onClick={() => navigate(`/products/${p.id}`)}
                                >
                                    <p className="font-semibold text-gray-800 text-sm line-clamp-1">{p.name}</p>
                                    <p className="text-green-700 font-bold text-sm">
                                        {parseFloat(p.indicative_price).toLocaleString('fr-FR')} FCFA
                                        <span className="text-gray-400 font-normal text-xs"> / {p.unit}</span>
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge label={label} color={color} />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => navigate(`/products/${p.id}`)}
                                        className="p-2 text-gray-400 hover:text-green-700 transition-colors"
                                    >
                                        <ArrowRight size={16} />
                                    </button>
                                    <button
                                        onClick={() => removeFavorite.mutate(fav.id)}
                                        disabled={removeFavorite.isPending}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}