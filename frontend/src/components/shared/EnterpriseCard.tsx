import { MapPin, Heart, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../ui/Badge'

interface EnterpriseCardProps {
    id: number
    name: string
    description: string
    logo?: string | null
    sector?: string
    region: string
}

export default function EnterpriseCard({
    id, name, description, logo, sector, region
}: EnterpriseCardProps) {
    return (
        <Link to={`/entreprises/${id}`} className="block group">
            <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow space-y-3">
                {/* En-tête */}
                <div className="flex items-start gap-3">
                    {/* Logo */}
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                        {logo ? (
                            <img src={logo} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xl font-bold text-gray-300">
                                {name.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>

                    {/* Nom + localisation */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-green-700 transition-colors line-clamp-1">
                            {name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                            <MapPin size={11} />
                            <span>{region}</span>
                        </div>
                    </div>

                    {/* Favori */}
                    <button
                        onClick={(e) => e.preventDefault()}
                        className="p-1.5 hover:text-red-500 transition-colors"
                    >
                        <Heart size={16} className="text-gray-300" />
                    </button>
                </div>

                {/* Secteur */}
                {sector && <Badge label={sector} color="green" />}

                {/* Description */}
                <p className="text-xs text-gray-500 line-clamp-2">{description}</p>

                {/* CTA */}
                <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-medium text-green-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                        Voir le profil <ArrowRight size={12} />
                    </span>
                </div>
            </div>
        </Link>
    )
}