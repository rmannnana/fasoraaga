import { Search, Wheat, Beef, Hammer, ShoppingBag, RefreshCw, Plane } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
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

// Données fictives — remplacées par l'API plus tard
const mockProducts = [
    {
        id: 1, name: 'Mil local de qualité supérieure', indicative_price: 15000,
        unit: 'sac', image: null, entreprise: 'Agri Burkina',
        localisation: 'Ouagadougou', category: 'Céréales', status: 'disponible' as const,
    },
    {
        id: 2, name: 'Karité brut première pression', indicative_price: 8500,
        unit: 'kg', image: null, entreprise: 'Coop Noix',
        localisation: 'Bobo-Dioulasso', category: 'Oléagineux', status: 'sur_commande' as const,
    },
    {
        id: 3, name: 'Sésame blanc décortiqué', indicative_price: 12000,
        unit: 'tonne', image: null, entreprise: 'SahelExport',
        localisation: 'Koudougou', category: 'Oléagineux', status: 'disponible' as const,
    },
    {
        id: 4, name: 'Haricot niébé sec', indicative_price: 22000,
        unit: 'sac', image: null, entreprise: 'Ferme du Plateau',
        localisation: 'Dori', category: 'Légumineuses', status: 'disponible' as const,
    },
]

const mockEnterprises = [
    {
        id: 1, name: 'Agri Burkina SARL', description: 'Producteur de céréales et légumineuses pour le marché local et sous-régional.',
        logo: null, sector: 'Agriculture', region: 'Centre',
    },
    {
        id: 2, name: 'Coop Noix du Sahel', description: 'Coopérative spécialisée dans la collecte et la transformation du karité.',
        logo: null, sector: 'Transformation', region: 'Hauts-Bassins',
    },
    {
        id: 3, name: 'SahelExport', description: 'Exportateur de produits agricoles bruts vers l\'Europe et l\'Asie.',
        logo: null, sector: 'Export', region: 'Centre-Ouest',
    },
]

export default function HomePage() {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')

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

                {/* Barre de recherche */}
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {mockProducts.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>
            </section>

            {/* Entreprises à découvrir */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800">Entreprises à découvrir</h2>
                    <button
                        onClick={() => navigate('/search?tab=entreprises')}
                        className="text-sm text-green-700 font-medium hover:underline"
                    >
                        Voir tout
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {mockEnterprises.map((entreprise) => (
                        <EnterpriseCard key={entreprise.id} {...entreprise} />
                    ))}
                </div>
            </section>

        </div>
    )
}