import { useNavigate } from 'react-router-dom'
import { Bell, MessageCircle, UserCheck, Info, CheckCheck } from 'lucide-react'
import {
    useNotifications,
    useMarkNotificationRead,
    useMarkAllNotificationsRead,
} from '../../features/notifications/hooks/useNotifications'
import EmptyState from '../../components/shared/EmptyState'
import type { Notification } from '../../../src/api/notifications.api'

const typeConfig = {
    contact_request: {
        icon: UserCheck,
        color: 'bg-yellow-50 text-yellow-600',
        route: '/contacts',
    },
    contact_accepted: {
        icon: UserCheck,
        color: 'bg-green-50 text-green-600',
        route: '/contacts',
    },
    new_message: {
        icon: MessageCircle,
        color: 'bg-blue-50 text-blue-600',
        route: '/messages',
    },
    system: {
        icon: Info,
        color: 'bg-gray-50 text-gray-600',
        route: null,
    },
}

export default function NotificationsPage() {
    const navigate = useNavigate()
    const notificationsQuery = useNotifications()
    const markRead = useMarkNotificationRead()
    const markAllRead = useMarkAllNotificationsRead()

    const notifications = notificationsQuery.data?.results ?? []
    const unreadCount = notifications.filter((n) => !n.is_read).length

    const handleClick = (notification: Notification) => {
        if (!notification.is_read) {
            markRead.mutate(notification.id)
        }
        const route = typeConfig[notification.type]?.route
        if (route) navigate(route)
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
                    {unreadCount > 0 && (
                        <p className="text-sm text-gray-400 mt-0.5">
                            {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                        </p>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={() => markAllRead.mutate()}
                        disabled={markAllRead.isPending}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-green-700 hover:bg-green-50 rounded-xl transition-colors font-medium"
                    >
                        <CheckCheck size={16} />
                        Tout marquer lu
                    </button>
                )}
            </div>

            {/* Liste */}
            {notificationsQuery.isLoading ? (
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : notifications.length === 0 ? (
                <EmptyState
                    icon={Bell}
                    title="Aucune notification"
                    description="Vos notifications apparaîtront ici."
                />
            ) : (
                <div className="space-y-2">
                    {notifications.map((notification) => {
                        const { icon: Icon, color, route } = typeConfig[notification.type]

                        return (
                            <div
                                key={notification.id}
                                onClick={() => handleClick(notification)}
                                className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${notification.is_read
                                        ? 'bg-white border-gray-100 hover:bg-gray-50'
                                        : 'bg-green-50 border-green-100 hover:bg-green-100'
                                    }`}
                            >
                                {/* Icône */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${color}`}>
                                    <Icon size={18} />
                                </div>

                                {/* Contenu */}
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-semibold ${notification.is_read ? 'text-gray-700' : 'text-gray-900'}`}>
                                        {notification.title}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                        {notification.content}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(notification.created_at).toLocaleDateString('fr-FR', {
                                            day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </p>
                                </div>

                                {/* Point non lu */}
                                {!notification.is_read && (
                                    <div className="w-2.5 h-2.5 bg-green-600 rounded-full shrink-0 mt-1" />
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}