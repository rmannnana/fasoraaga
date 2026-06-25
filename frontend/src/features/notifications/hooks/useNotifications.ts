import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsApi } from '../../../api/notifications.api'
import { useAuthStore } from '../../auth/store/authStore'

export const notificationKeys = {
    all: ['notifications'] as const,
}

export function useNotifications() {
    const { isAuthenticated } = useAuthStore()
    return useQuery({
        queryKey: notificationKeys.all,
        queryFn: notificationsApi.getAll,
        enabled: isAuthenticated,
        refetchInterval: 30000,
    })
}

export function useUnreadCount() {
    const notificationsQuery = useNotifications()
    const notifications = notificationsQuery.data?.results ?? []
    return notifications.filter((n) => !n.is_read).length
}

export function useMarkNotificationRead() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => notificationsApi.markRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.all })
        },
    })
}

export function useMarkAllNotificationsRead() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: notificationsApi.markAllRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.all })
        },
    })
}