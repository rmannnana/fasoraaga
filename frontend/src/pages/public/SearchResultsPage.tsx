import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, Package, Building2 } from 'lucide-react'
import { useSearchProducts, useSearchEnterprises } from '../../features/search/hooks/useSearch'
import ProductCard from '../../components/shared/ProductCard'
import EnterpriseCard from '../../components/shared/EnterpriseCard'
import EmptyState from '../../components/shared/EmptyState'

const REGIONS = [
    'Centre', 'Hauts-Bassins', 'Cascades', 'Centre-Est', 'Centre-Nord',
    'Centre-Ouest', 'Centre-Sud', 'Est', 'Nord', 'Plateau-Central',
    'Sahel', 'Sud-Ouest', 'Boucle du Mouhoun',
]

const SECTORS = [
    'Agriculture', 'Élevage', 'Artisanat', 'Commerce', 'Transformation', 'Export',
]

type Tab = 'products' | 'enterprises'

export default function SearchResultsPage() {
    const [searchParams, setSearchParams] = useSearchParams()

    // État local
    const [tab, setTab] = useState<Tab>(
        searchParams.get('tab') === 'enterprises' ? 'enterprises' : 'products'
    )
    const [query, setQuery] = useState(searchParams.get('q') ?? '')
    const [inputValue, setInputValue] = useState(searchParams.get('q') ?? '')
    const [sector, setSector] = useState(searchParams.get('sector') ?? '')
    const [region, setRegion] = useState(searchParams.get('region') ?? '')
    const [showFilters, setShowFilters] = useState(false)

    // Filtres actifs
    const filters = { q: query, sector, region }

    // Requêtes
    const productsQuery = useSearchProducts(filters, tab === 'products')
    const enterprisesQuery = useSearchEnterprises(filters, tab === 'enterprises')

    // Sync URL
    useEffect(() => {
        const params: Record<string, string> = { tab }
        if (query) params.q = query
        if (sector) params.sector = sector
        if (region) params.region = region
        setSearchParams(params)
    }, [tab, query, sector, region])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setQuery(inputValue.trim())
    }

    const clearFilters = () => {
        setSector('')
        setRegion('')
    }

    const hasActiveFilters = !!sector || !!region
    const activeResults = tab === 'products' ? productsQuery : enterprisesQuery
    const isLoading = activeResults.isLoading
    const totalCount = activeResults.data?.count ?? 0

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">

            {/* Barre de recherche */}
            <form onSubmit={handleSearch} className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3">
                    <Search size={18} className="text-gray-400 shrink-0" />
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Produit, entreprise, secteur..."
                        className="flex-1 text-sm text-gray-800 outline-none placeholder-gray-400"
                    />
                    {inputValue && (
                        <button type="button" onClick={() => { setInputValue(''); setQuery('') }}>
                            <X size={16} className="text-gray-400 hover:text-gray-600" />
                        </button>
                    )}
                </div>
                <button
                    type="submit"
                    className="bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-colors"
                >
                    Rechercher
                </button>
                <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`relative p-3 rounded-xl border transition-colors ${hasActiveFilters
                        ? 'bg-green-50 border-green-300 text-green-700'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                >
                    <SlidersHorizontal size={18} />
                    {hasActiveFilters && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-600 rounded-full" />
                    )}
                </button>
            </form>

            {/* Panneau filtres */}
            {showFilters && (
                <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-700">Filtres</h3>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-xs text-red-500 hover:underline"
                            >
                                Réinitialiser
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Secteur */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-600">Secteur</label>
                            <div className="flex flex-wrap gap-2">
                                {SECTORS.map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setSector(sector === s ? '' : s)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${sector === s
                                            ? 'bg-green-700 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Région */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-600">Région</label>
                            <select
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-600"
                            >
                                <option value="">Toutes les régions</option>
                                {REGIONS.map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Onglets */}
            <div className="flex bg-gray-100 rounded-xl p-1 w-fit">
                {([
                    { key: 'products', label: 'Produits', icon: Package },
                    { key: 'enterprises', label: 'Entreprises', icon: Building2 },
                ] as const).map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === key
                            ? 'bg-white text-green-700 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Icon size={15} />
                        {label}
                    </button>
                ))}
            </div>

            {/* Compteur */}
            {!isLoading && (query || sector || region) && (
                <p className="text-sm text-gray-500">
                    {totalCount} résultat{totalCount > 1 ? 's' : ''} trouvé{totalCount > 1 ? 's' : ''}
                    {query && <span className="font-medium text-gray-700"> pour « {query} »</span>}
                </p>
            )}

            {/* Résultats */}
            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-100 h-64 animate-pulse" />
                    ))}
                </div>
            ) : !query && !sector && !region ? (
                <EmptyState
                    icon={Search}
                    title="Lancez une recherche"
                    description="Tapez un mot-clé ou sélectionnez un filtre pour trouver des produits ou entreprises."
                />
            ) : tab === 'products' ? (
                productsQuery.data?.results.length === 0 ? (
                    <EmptyState
                        icon={Package}
                        title="Aucun produit trouvé"
                        description="Essayez d'autres mots-clés ou modifiez vos filtres."
                        action={{ label: 'Effacer les filtres', onClick: clearFilters }}
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
                                image={product.images?.[0] ?? null}
                                entreprise={product.entreprise_name}
                                localisation={product.entreprise_region}
                                category={product.category_name}
                                status={product.status}
                            />
                        ))}
                    </div>
                )
            ) : (
                enterprisesQuery.data?.results.length === 0 ? (
                    <EmptyState
                        icon={Building2}
                        title="Aucune entreprise trouvée"
                        description="Essayez d'autres mots-clés ou modifiez vos filtres."
                        action={{ label: 'Effacer les filtres', onClick: clearFilters }}
                    />
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
                )
            )}

        </div>
    )
}