import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { contactsApi } from '../../../api/contacts.api'
import { useAuthStore } from '../../auth/store/authStore'

export const contactKeys = {
    requests: ['contact-requests'] as const,
    conversations: ['conversations'] as const,
    conversation: (id: number) => ['conversations', id] as const,
}

export function useContactRequests() {
    const { isAuthenticated } = useAuthStore()
    return useQuery({
        queryKey: contactKeys.requests,
        queryFn: contactsApi.getRequests,
        enabled: isAuthenticated,
    })
}

export function useSendContactRequest() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: { receiver: number; message: string }) =>
            contactsApi.sendRequest(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: contactKeys.requests })
            toast.success('Demande de contact envoyée.')
        },
        onError: () => {
            toast.error('Erreur lors de l\'envoi.')
        },
    })
}

export function useAcceptRequest() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => contactsApi.accept(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: contactKeys.requests })
            queryClient.invalidateQueries({ queryKey: contactKeys.conversations })
            toast.success('Demande acceptée.')
        },
        onError: () => {
            toast.error('Erreur lors de l\'acceptation.')
        },
    })
}

export function useDeclineRequest() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => contactsApi.decline(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: contactKeys.requests })
            toast.success('Demande refusée.')
        },
        onError: () => {
            toast.error('Erreur lors du refus.')
        },
    })
}

export function useConversations() {
    const { isAuthenticated } = useAuthStore()
    return useQuery({
        queryKey: contactKeys.conversations,
        queryFn: contactsApi.getConversations,
        enabled: isAuthenticated,
        refetchInterval: 15000, // refresh toutes les 15s
    })
}

export function useConversation(id: number) {
    return useQuery({
        queryKey: contactKeys.conversation(id),
        queryFn: () => contactsApi.getConversation(id),
        enabled: !!id,
        refetchInterval: 5000, // refresh toutes les 5s
    })
}

export function useSendMessage() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ conversationId, content }: { conversationId: number; content: string }) =>
            contactsApi.sendMessage(conversationId, content),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: contactKeys.conversation(variables.conversationId),
            })
            queryClient.invalidateQueries({ queryKey: contactKeys.conversations })
        },
        onError: () => {
            toast.error('Erreur lors de l\'envoi.')
        },
    })
}

export function useMarkRead() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (conversationId: number) => contactsApi.markRead(conversationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: contactKeys.conversations })
        },
    })
}