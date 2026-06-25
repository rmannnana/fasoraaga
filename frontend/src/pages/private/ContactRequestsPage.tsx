import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, X, Clock, Building2, ArrowRight } from 'lucide-react'
import {
    useContactRequests,
    useAcceptRequest,
    useDeclineRequest,
} from '../../features/contacts/hooks/useContacts'
import EmptyState from '../../components/shared/EmptyState'
import Badge from '../../components/ui/Badge'
import { useMyEnterprise } from '../../features/enterprises/hooks/useEntreprise'

const statusConfig = {
    pending: { label: 'En attente', color: 'yellow' as const },
    accepted: { label: 'Acceptée', color: 'green' as const },
    declined: { label: 'Refusée', color: 'gray' as const },
}

type Tab = 'received' | 'sent' | 'history'

export default function ContactRequestsPage() {
    const [tab, setTab] = useState<Tab>('received')
    const navigate = useNavigate()

    const requestsQuery = useContactRequests()
    const acceptRequest = useAcceptRequest()
    const declineRequest = useDeclineRequest()
    const { data: myEnterprise } = useMyEnterprise()

    const requests = requestsQuery.data?.results ?? []

    const received = requests.filter(
        (r) => r.receiver.id === myEnterprise?.id && r.status === 'pending'
    )
    const sent = requests.filter(
        (r) => r.sender.id === myEnterprise?.id && r.status === 'pending'
    )
    const history = requests.filter((r) => r.status !== 'pending')

    const activeList = tab === 'received' ? received : tab === 'sent' ? sent : history

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

            {/* En-tête */}
            <div>
                <h1 className="text-xl font-bold text-gray-900">Demandes de contact</h1>
                <p className="text-sm text-gray-400 mt-0.5">
                    {received.length} reçue{received.length > 1 ? 's' : ''} en attente
                </p>
            </div>

            {/* Onglets */}
            <div className="flex bg-gray-100 rounded-xl p-1">
                {([
                    { key: 'received', label: 'Reçues', count: received.length },
                    { key: 'sent', label: 'Envoyées', count: sent.length },
                    { key: 'history', label: 'Historique', count: history.length },
                ] as const).map(({ key, label, count }) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === key
                                ? 'bg-white text-green-700 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {label}
                        {count > 0 && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === key ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                                }`}>
                                {count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Liste */}
            {requestsQuery.isLoading ? (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : activeList.length === 0 ? (
                <EmptyState
                    icon={Building2}
                    title="Aucune demande"
                    description={
                        tab === 'received'
                            ? 'Vous n\'avez pas de demandes de contact en attente.'
                            : tab === 'sent'
                                ? 'Vous n\'avez pas envoyé de demandes en attente.'
                                : 'Aucun historique de demandes.'
                    }
                />
            ) : (
                <div className="space-y-3">
                    {activeList.map((req) => {
                        const isReceived = req.receiver.id === myEnterprise?.id
                        const other = isReceived ? req.sender : req.receiver
                        const { label, color } = statusConfig[req.status]

                        return (
                            <div
                                key={req.id}
                                className="bg-white rounded-xl border border-gray-100 p-4 space-y-3"
                            >
                                {/* En-tête carte */}
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                                        {other.logo ? (
                                            <img src={other.logo} alt={other.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xl font-bold text-gray-300">
                                                {other.name.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-800 text-sm">{other.name}</p>
                                        <p className="text-xs text-gray-400">{other.region}</p>
                                        <div className="mt-1">
                                            <Badge label={label} color={color} />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/entreprises/${other.id}`)}
                                        className="p-2 text-gray-400 hover:text-green-700 transition-colors"
                                    >
                                        <ArrowRight size={16} />
                                    </button>
                                </div>

                                {/* Message */}
                                {req.message && (
                                    <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                                        "{req.message}"
                                    </p>
                                )}

                                {/* Date */}
                                <p className="text-xs text-gray-400">
                                    {new Date(req.created_at).toLocaleDateString('fr-FR', {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </p>

                                {/* Actions — uniquement pour les reçues en attente */}
                                {tab === 'received' && req.status === 'pending' && (
                                    <div className="flex gap-2 pt-1">
                                        <button
                                            onClick={() => acceptRequest.mutate(req.id)}
                                            disabled={acceptRequest.isPending}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl text-sm transition-colors"
                                        >
                                            <Check size={15} />
                                            Accepter
                                        </button>
                                        <button
                                            onClick={() => declineRequest.mutate(req.id)}
                                            disabled={declineRequest.isPending}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold rounded-xl text-sm transition-colors"
                                        >
                                            <X size={15} />
                                            Refuser
                                        </button>
                                    </div>
                                )}

                                {/* Lien conversation si acceptée */}
                                {req.status === 'accepted' && (
                                    <button
                                        onClick={() => navigate('/messages')}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-50 text-green-700 font-semibold rounded-xl text-sm hover:bg-green-100 transition-colors"
                                    >
                                        Voir la conversation
                                        <ArrowRight size={15} />
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}