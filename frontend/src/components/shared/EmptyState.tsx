import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
    icon: LucideIcon
    title: string
    description: string
    action?: {
        label: string
        onClick: () => void
    }
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Icon size={28} className="text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-700 mb-1">{title}</h3>
            <p className="text-sm text-gray-400 max-w-xs">{description}</p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="mt-4 px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-lg hover:bg-green-800 transition-colors"
                >
                    {action.label}
                </button>
            )}
        </div>
    )
}