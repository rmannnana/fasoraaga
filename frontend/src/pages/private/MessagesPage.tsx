import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, MessageCircle, Loader2 } from 'lucide-react'
import {
    useConversations,
    useConversation,
    useSendMessage,
    useMarkRead,
} from '../../features/contacts/hooks/useContacts'
import { useAuthStore } from '../../features/auth/store/authStore'
import { useMyEnterprise } from '../../features/enterprises/hooks/useEntreprise'
import EmptyState from '../../components/shared/EmptyState'

export default function MessagesPage() {
    const { conversationId } = useParams()
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const { data: myEnterprise } = useMyEnterprise()
    const [message, setMessage] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const conversationsQuery = useConversations()
    const activeConversationQuery = useConversation(Number(conversationId))
    const sendMessage = useSendMessage()
    const markRead = useMarkRead()

    const conversations = conversationsQuery.data?.results ?? []
    const activeConversation = activeConversationQuery.data

    // Scroll vers le bas à chaque nouveau message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [activeConversation?.messages])

    // Marquer comme lu à l'ouverture
    useEffect(() => {
        if (conversationId && activeConversation && (activeConversation.unread_count ?? 0) > 0) {
            markRead.mutate(Number(conversationId))
        }
    }, [conversationId, activeConversation?.unread_count])

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault()
        if (!message.trim() || !conversationId) return
        sendMessage.mutate(
            { conversationId: Number(conversationId), content: message.trim() },
            { onSuccess: () => setMessage('') }
        )
    }

    const getOtherEnterprise = (conv: typeof activeConversation) => {
        if (!conv || !myEnterprise) return null
        const req = conv.contact_request
        return req.sender.id === myEnterprise.id ? req.receiver : req.sender
    }

    return (
        <div className="flex h-screen md:h-[calc(100vh-0px)] overflow-hidden">

            {/* Liste conversations — cachée sur mobile si une conv est ouverte */}
            <div className={`${conversationId ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-72 border-r border-gray-200 bg-white`}>
                <div className="px-4 py-4 border-b border-gray-100">
                    <h1 className="font-bold text-gray-800">Messages</h1>
                </div>

                {conversationsQuery.isLoading ? (
                    <div className="p-4 space-y-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : conversations.length === 0 ? (
                    <EmptyState
                        icon={MessageCircle}
                        title="Aucun message"
                        description="Vos conversations apparaîtront ici après avoir accepté des demandes de contact."
                    />
                ) : (
                    <div className="flex-1 overflow-y-auto">
                        {conversations.map((conv) => {
                            const other = myEnterprise
                                ? conv.contact_request.sender.id === myEnterprise.id
                                    ? conv.contact_request.receiver
                                    : conv.contact_request.sender
                                : null
                            const lastMessage = conv.messages?.[conv.messages.length - 1]
                            const isActive = String(conv.id) === conversationId

                            return (
                                <button
                                    key={conv.id}
                                    onClick={() => navigate(`/messages/${conv.id}`)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left ${isActive ? 'bg-green-50 border-r-2 border-green-700' : ''
                                        }`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                        {other?.logo ? (
                                            <img src={other.logo} alt={other.name} className="w-full h-full object-cover rounded-full" />
                                        ) : (
                                            <span className="font-bold text-gray-300 text-sm">
                                                {other?.name.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold text-gray-800 text-sm truncate">{other?.name}</p>
                                            {conv.unread_count > 0 && (
                                                <span className="w-5 h-5 bg-green-700 text-white text-xs rounded-full flex items-center justify-center shrink-0">
                                                    {conv.unread_count}
                                                </span>
                                            )}
                                        </div>
                                        {lastMessage && (
                                            <p className="text-xs text-gray-400 truncate">{lastMessage.content}</p>
                                        )}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Zone de discussion */}
            <div className={`${conversationId ? 'flex' : 'hidden md:flex'} flex-col flex-1 bg-gray-50`}>
                {!conversationId ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center space-y-2">
                            <MessageCircle size={40} className="text-gray-300 mx-auto" />
                            <p className="text-sm text-gray-400">Sélectionnez une conversation</p>
                        </div>
                    </div>
                ) : activeConversationQuery.isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 size={24} className="animate-spin text-gray-400" />
                    </div>
                ) : activeConversation ? (
                    <>
                        {/* Header conversation */}
                        <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200">
                            <button
                                onClick={() => navigate('/messages')}
                                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <ArrowLeft size={18} />
                            </button>
                            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                                <span className="font-bold text-gray-300 text-sm">
                                    {getOtherEnterprise(activeConversation)?.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800 text-sm">
                                    {getOtherEnterprise(activeConversation)?.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {getOtherEnterprise(activeConversation)?.region}
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                            {activeConversation.messages?.map((msg) => {
                                const isMe = msg.sender === user?.id
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${isMe
                                                ? 'bg-green-700 text-white rounded-br-sm'
                                                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                                            }`}>
                                            <p>{msg.content}</p>
                                            <p className={`text-xs mt-1 ${isMe ? 'text-green-200' : 'text-gray-400'}`}>
                                                {new Date(msg.created_at).toLocaleTimeString('fr-FR', {
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input message */}
                        <form
                            onSubmit={handleSend}
                            className="flex items-center gap-3 px-4 py-3 bg-white border-t border-gray-200"
                        >
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Écrire un message..."
                                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm outline-none"
                            />
                            <button
                                type="submit"
                                disabled={!message.trim() || sendMessage.isPending}
                                className="w-10 h-10 bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-colors"
                            >
                                {sendMessage.isPending
                                    ? <Loader2 size={16} className="animate-spin" />
                                    : <Send size={16} />
                                }
                            </button>
                        </form>
                    </>
                ) : null}
            </div>
        </div>
    )
}