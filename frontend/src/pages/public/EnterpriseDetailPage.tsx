import { useParams, useNavigate } from 'react-router-dom'
import {
    MapPin, Phone, Mail, Globe, Heart,
    ArrowLeft, MessageCircle, Package
} from 'lucide-react'
import { useEntreprise, useEntrepriseProducts } from '../../features/enterprises/hooks/useEntreprise'
import ProductCard from '../../components/shared/ProductCard'
import EmptyState from '../../components/shared/EmptyState'
import { useAuthStore } from '../../features/auth/store/authStore'
import { useAddFavorite } from '../../features/favorites/hooks/useFavorites'

export default function EnterpriseDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { isAuthenticated } = useAuthStore()

    const entrepriseQuery = useEntreprise(Number(id))
    const productsQuery = useEntrepriseProducts(Number(id))
    const addFavorite = useAddFavorite()

    if (entrepriseQuery.isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-4 animate-pulse">
                <div className="h-40 bg-gray-100 rounded-2xl" />
                <div className="h-6 bg-gray-100 rounded w-1/3" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
            </div>
        )
    }

    if (entrepriseQuery.isError || !entrepriseQuery.data) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-6">
                <EmptyState
                    icon={Package}
                    title="Entreprise introuvable"
                    description="Cette entreprise n'existe pas ou a été supprimée."
                    action={{ label: 'Retour à la recherche', onClick: () => navigate('/search') }}
                />
            </div>
        )
    }

    const e = entrepriseQuery.data
    const products = productsQuery.data?.results ?? []
    return (
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

            {/* Retour */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
                <ArrowLeft size={16} /> Retour
            </button>

            {/* En-tête */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-start gap-4">
                    {/* Logo */}
                    <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                        {e.logo ? (
                            <img src={e.logo} alt={e.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl font-bold text-gray-300">
                                {e.name.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>

                    {/* Infos principales */}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-bold text-gray-900">{e.name}</h1>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                            <MapPin size={14} />
                            <span>{e.region}{e.province ? ` · ${e.province}` : ''}</span>
                        </div>
                    </div>

                    {/* Bouton favori */}
                    <button
                        onClick={() => isAuthenticated
                            ? addFavorite.mutate({ type: 'enterprise', id: Number(id) })
                            : navigate('/auth')
                        }
                        className="p-2 hover:text-red-500 transition-colors"
                    >
                        <Heart size={20} className="text-gray-300" />
                    </button>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-5">
                    <button
                        onClick={() => isAuthenticated ? null : navigate('/auth')}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl text-sm transition-colors"
                    >
                        <MessageCircle size={16} />
                        Demander un contact
                    </button>
                    <button
                        onClick={() => isAuthenticated
                            ? addFavorite.mutate({ type: 'enterprise', id: Number(id) })
                            : navigate('/auth')
                        }
                        className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 hover:bg-gray-50 rounded-xl text-sm text-gray-600 transition-colors"
                    >
                        <Heart size={16} />
                        Favori
                    </button>
                </div>
            </div>

            {/* À propos */}
            {e.description && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-2">
                    <h2 className="text-base font-bold text-gray-800">À propos</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">{e.description}</p>
                </div>
            )}

            {/* Coordonnées */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
                <h2 className="text-base font-bold text-gray-800">Informations de contact</h2>
                <div className="space-y-2">
                    {e.phone && (
                        <a href={`tel:${e.phone}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-green-700">
                            <Phone size={15} className="text-gray-400" />
                            {e.phone}
                        </a>
                    )}
                    {e.email && (
                        <a href={`mailto:${e.email}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-green-700">
                            <Mail size={15} className="text-gray-400" />
                            {e.email}
                        </a>
                    )}
                    {e.website && (
                        <a href={e.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-gray-600 hover:text-green-700">
                            <Globe size={15} className="text-gray-400" />
                            {e.website}
                        </a>
                    )}
                    {e.address && (
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <MapPin size={15} className="text-gray-400" />
                            {e.address}
                        </div>
                    )}
                </div>
            </div>

            {/* Catalogue */}
            <div className="space-y-4">
                <h2 className="text-base font-bold text-gray-800">
                    Catalogue
                    {products.length > 0 && (
                        <span className="ml-2 text-sm font-normal text-gray-400">
                            ({products.length} produit{products.length > 1 ? 's' : ''})
                        </span>
                    )}
                </h2>

                {productsQuery.isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <EmptyState
                        icon={Package}
                        title="Aucun produit"
                        description="Cette entreprise n'a pas encore ajouté de produits."
                    />
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {productsQuery.data?.results.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                indicative_price={product.indicative_price}
                                unit={product.unit}
                                image={product.images?.[0]?.image ?? null}
                                entreprise={product.enterprise_name}
                                localisation={product.region}
                                category={product.category_name}
                                status={product.status}
                            />
                        ))}
                    </div>
                )}
            </div>

        </div>
    )
}