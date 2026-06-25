import { Search, Wheat, Beef, Hammer, ShoppingBag, RefreshCw, Plane } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchApi } from '../../api/search.api'
import ProductCard from '../../components/shared/ProductCard'
import EnterpriseCard from '../../components/shared/EnterpriseCard'

const sectors = [
    { label: 'Agriculture', icon: Wheat, color: 'bg-green-50 text-green-700' },
    { label: 'Élevage', icon: Beef, color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Artisanat', icon: Hammer, color: 'bg-orange-50 text-orange-700' },
    { label: 'Commerce', icon: ShoppingBag, color: 'bg-blue-50 text-blue-700' },
    { label: 'Transformation', icon: RefreshCw, color: 'bg-purple-50 text-purple-700' },
    { label: 'Export', icon: Plane, color: 'bg-red-50 text-red-700' },
]

export default function HomePage() {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')

    const productsQuery = useQuery({
        queryKey: ['home', 'products'],
        queryFn: searchApi.getRecentProducts,
    })

    const enterprisesQuery = useQuery({
        queryKey: ['home', 'enterprises'],
        queryFn: searchApi.getRecentEnterprises,
    })

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (search.trim()) {
            navigate(`/search?q=${encodeURIComponent(search.trim())}`)
        }
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-10">

            {/* Hero */}
            <section className="bg-green-700 rounded-2xl px-6 py-10 text-white text-center space-y-4">
                <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                    Le salon professionnel numérique du Burkina Faso
                </h1>
                <p className="text-green-100 text-sm md:text-base max-w-xl mx-auto">
                    Découvrez des producteurs locaux, explorez leurs catalogues et établissez des partenariats durables.
                </p>
                <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto mt-2">
                    <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4 py-3">
                        <Search size={18} className="text-gray-400 shrink-0" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Produit, entreprise, secteur..."
                            className="flex-1 text-gray-800 text-sm outline-none placeholder-gray-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-yellow-500 hover:bg-yellow-400 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-colors"
                    >
                        Rechercher
                    </button>
                </form>
            </section>

            {/* Secteurs */}
            <section className="space-y-4">
                <h2 className="text-lg font-bold text-gray-800">Secteurs</h2>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {sectors.map(({ label, icon: Icon, color }) => (
                        <button
                            key={label}
                            onClick={() => navigate(`/search?sector=${encodeURIComponent(label)}`)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-xl ${color} hover:opacity-80 transition-opacity`}
                        >
                            <Icon size={22} />
                            <span className="text-xs font-medium text-center leading-tight">{label}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Produits récents */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800">Produits récents</h2>
                    <button
                        onClick={() => navigate('/search?tab=products')}
                        className="text-sm text-green-700 font-medium hover:underline"
                    >
                        Voir tout
                    </button>
                </div>

                {productsQuery.isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : productsQuery.data?.results.length === 0 ? (
                    <p className="text-sm text-gray-400">Aucun produit pour le moment.</p>
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
            </section>

            {/* Entreprises à découvrir */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800">Entreprises à découvrir</h2>
                    <button
                        onClick={() => navigate('/search?tab=enterprises')}
                        className="text-sm text-green-700 font-medium hover:underline"
                    >
                        Voir tout
                    </button>
                </div>

                {enterprisesQuery.isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : enterprisesQuery.data?.results.length === 0 ? (
                    <p className="text-sm text-gray-400">Aucune entreprise pour le moment.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {enterprisesQuery.data?.results.map((entreprise) => (
                            <EnterpriseCard
                                key={entreprise.id}
                                id={entreprise.id}
                                name={entreprise.name}
                                description={entreprise.description}
                                logo={entreprise.logo}
                                region={entreprise.region}
                            />
                        ))}
                    </div>
                )}
            </section>

        </div>
    )
}