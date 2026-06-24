import { NavLink } from 'react-router-dom'
import { Home, Search, MessageCircle, Heart, User } from 'lucide-react'

const links = [
    { to: '/', icon: Home, label: 'Accueil' },
    { to: '/search', icon: Search, label: 'Recherche' },
    { to: '/messages', icon: MessageCircle, label: 'Messages' },
    { to: '/favorites', icon: Heart, label: 'Favoris' },
    { to: '/profile', icon: User, label: 'Profil' },
]

export default function BottomNav() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex md:hidden">
            {links.map(({ to, icon: Icon, label }) => (
                <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                        `flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs transition-colors ${isActive ? 'text-green-700' : 'text-gray-400'
                        }`
                    }
                >
                    <Icon size={22} />
                    <span>{label}</span>
                </NavLink>
            ))}
        </nav>
    )
}