import { NavLink } from 'react-router-dom'
import {
    Home, Search, MessageCircle, Heart,
    Building2, User, Bell, LogOut, Package
} from 'lucide-react'
import { useAuthStore } from '../../features/auth/store/authStore'
import { useUnreadCount } from '../../features/notifications/hooks/useNotifications'

const navLinks = [
    { to: '/', icon: Home, label: 'Accueil' },
    { to: '/search', icon: Search, label: 'Recherche' },
    { to: '/messages', icon: MessageCircle, label: 'Messages' },
    { to: '/favorites', icon: Heart, label: 'Favoris' },
    { to: '/business', icon: Building2, label: 'Mon entreprise' },
    { to: '/business/products', icon: Package, label: 'Mes produits' }, // ← ajouter
    { to: '/notifications', icon: Bell, label: 'Notifications' },
    { to: '/profile', icon: User, label: 'Profil' },
]

export default function Sidebar() {
    const { isAuthenticated, logout, user } = useAuthStore()

    const unreadCount = useUnreadCount()

    return (
        <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-60 bg-white border-r border-gray-200 z-50">
            {/* Logo */}
            <div className="px-6 py-5 border-b border-gray-100">
                <span className="text-xl font-bold text-green-700">FasoRaaga</span>
                <p className="text-xs text-gray-400 mt-0.5">Salon professionnel numérique</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navLinks.map(({ to, icon: Icon, label }) => {
                    const privateLinks = ['/messages', '/favorites', '/business', '/notifications', '/profile', '/business/products']
                    if (!isAuthenticated && privateLinks.includes(to)) return null

                    return (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-green-50 text-green-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`
                            }
                        >
                            <Icon size={18} />
                            {label}
                            {to === '/notifications' && unreadCount > 0 && (
                                <span className="ml-auto w-5 h-5 bg-green-600 text-white text-xs rounded-full flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </NavLink>
                    )
                })}
            </nav>

            {/* Footer sidebar */}
            <div className="px-3 py-4 border-t border-gray-100">
                {isAuthenticated ? (
                    <div className="space-y-1">
                        <div className="px-3 py-2">
                            <p className="text-sm font-medium text-gray-800">
                                {user?.first_name} {user?.last_name}
                            </p>
                            <p className="text-xs text-gray-400">{user?.role?.name}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <LogOut size={18} />
                            Déconnexion
                        </button>
                    </div>
                ) : (
                    <NavLink
                        to="/auth"
                        className="flex items-center justify-center w-full px-3 py-2.5 rounded-lg text-sm font-medium bg-green-700 text-white hover:bg-green-800 transition-colors"
                    >
                        Se connecter
                    </NavLink>
                )}
            </div>
        </aside>
    )
}