import { Heart, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../ui/Badge'

interface ProductCardProps {
    id: number
    name: string
    indicative_price: number
    unit: string
    image?: string | null
    entreprise: string
    localisation: string
    category?: string
    status: 'disponible' | 'sur_commande' | 'indisponible'
}

const statusConfig = {
    disponible: { label: 'Disponible', color: 'green' as const },
    sur_commande: { label: 'Sur commande', color: 'yellow' as const },
    indisponible: { label: 'Indisponible', color: 'gray' as const },
}

export default function ProductCard({
    id, name, indicative_price, unit,
    image, entreprise, localisation, category, status
}: ProductCardProps) {
    const { label, color } = statusConfig[status]

    return (
        <Link to={`/products/${id}`} className="block group">
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                {/* Image */}
                <div className="relative h-44 bg-gray-100">
                    {image ? (
                        <img src={image} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                            Pas d'image
                        </div>
                    )}
                    {/* Bouton favori */}
                    <button
                        onClick={(e) => e.preventDefault()}
                        className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow hover:text-red-500 transition-colors"
                    >
                        <Heart size={16} className="text-gray-400" />
                    </button>
                </div>

                {/* Contenu */}
                <div className="p-3 space-y-1.5">
                    {category && <Badge label={category} color="gray" />}
                    <h3 className="font-semibold text-gray-900 text-sm group-hover:text-green-700 transition-colors line-clamp-1">
                        {name}
                    </h3>
                    <p className="text-green-700 font-bold text-sm">
                        {indicative_price.toLocaleString('fr-FR')} FCFA
                        <span className="text-gray-400 font-normal"> / {unit}</span>
                    </p>
                    <div className="flex items-center justify-between pt-1">
                        <p className="text-xs text-gray-500 truncate">{entreprise}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                            <MapPin size={12} />
                            <span className="truncate max-w-[80px]">{localisation}</span>
                        </div>
                    </div>
                    <Badge label={label} color={color} />
                </div>
            </div>
        </Link>
    )
}