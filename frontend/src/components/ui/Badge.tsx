interface BadgeProps {
    label: string
    color?: 'green' | 'yellow' | 'gray'
}

export default function Badge({ label, color = 'gray' }: BadgeProps) {
    const colors = {
        green: 'bg-green-100 text-green-700',
        yellow: 'bg-yellow-100 text-yellow-700',
        gray: 'bg-gray-100 text-gray-600',
    }

    return (
        <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${colors[color]}`}>
            {label}
        </span>
    )
}