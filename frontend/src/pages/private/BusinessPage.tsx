import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
    Building2, Camera, Loader2, MapPin,
    Phone, Mail, Globe, FileText, Home, Package
} from 'lucide-react'
import {
    useMyEnterprise,
    useUpdateEntreprise,
    useUpdateEntrepriseLogo,
} from '../../features/enterprises/hooks/useEntreprise'
import EmptyState from '../../components/shared/EmptyState'
import { useNavigate } from 'react-router-dom'

const REGIONS = [
    'Centre', 'Hauts-Bassins', 'Cascades', 'Centre-Est', 'Centre-Nord',
    'Centre-Ouest', 'Centre-Sud', 'Est', 'Nord', 'Plateau-Central',
    'Sahel', 'Sud-Ouest', 'Boucle du Mouhoun',
]

const businessSchema = z.object({
    name: z.string().min(2, 'Nom requis'),
    description: z.string().max(500, 'Maximum 500 caractères').optional(),
    email: z.string().email('Email invalide').optional().or(z.literal('')),
    phone: z.string().optional(),
    website: z.string().url('URL invalide').optional().or(z.literal('')),
    region: z.string().optional(),
    province: z.string().optional(),
    commune: z.string().optional(),
    address: z.string().optional(),
})

type BusinessForm = z.infer<typeof businessSchema>

export default function BusinessPage() {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const enterpriseQuery = useMyEnterprise()
    const updateEnterprise = useUpdateEntreprise()
    const updateLogo = useUpdateEntrepriseLogo()

    const enterprise = enterpriseQuery.data

    const { register, handleSubmit, formState: { errors } } = useForm<BusinessForm>({
        resolver: zodResolver(businessSchema),
        values: {
            name: enterprise?.name ?? '',
            description: enterprise?.description ?? '',
            email: enterprise?.email ?? '',
            phone: enterprise?.phone ?? '',
            website: enterprise?.website ?? '',
            region: enterprise?.region ?? '',
            province: enterprise?.province ?? '',
            commune: enterprise?.commune ?? '',
            address: enterprise?.address ?? '',
        },
    })
    const navigate = useNavigate()

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && enterprise) {
            updateLogo.mutate({ id: enterprise.id, file })
        }
    }

    const onSubmit = (data: BusinessForm) => {
        if (!enterprise) return
        updateEnterprise.mutate({ id: enterprise.id, payload: data })
    }

    if (enterpriseQuery.isLoading) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 animate-pulse">
                <div className="h-24 w-24 bg-gray-100 rounded-xl mx-auto" />
                <div className="h-40 bg-gray-100 rounded-2xl" />
                <div className="h-40 bg-gray-100 rounded-2xl" />
            </div>
        )
    }

    if (enterpriseQuery.isError || !enterprise) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-6">
                <EmptyState
                    icon={Building2}
                    title="Aucune entreprise"
                    description="Vous n'avez pas encore d'entreprise associée à votre compte. Contactez l'administrateur."
                />
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

            {/* En-tête */}
            <div className="space-y-1">
                <h1 className="text-xl font-bold text-gray-900">Mon entreprise</h1>
                <p className="text-sm text-gray-400">Gérez les informations de votre entreprise.</p>
            </div>

            {/* Logo */}
            <div className="flex items-center gap-5 bg-white rounded-2xl border border-gray-100 p-5">
                <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
                        {enterprise.logo ? (
                            <img src={enterprise.logo} alt={enterprise.name} className="w-full h-full object-cover" />
                        ) : (
                            <Building2 size={32} className="text-gray-300" />
                        )}
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={updateLogo.isPending}
                        className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-700 rounded-full flex items-center justify-center text-white hover:bg-green-800 transition-colors"
                    >
                        {updateLogo.isPending
                            ? <Loader2 size={12} className="animate-spin" />
                            : <Camera size={12} />
                        }
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoChange}
                    />
                </div>
                <div>
                    <p className="font-semibold text-gray-800">{enterprise.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{enterprise.region}</p>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-green-700 hover:underline mt-1"
                    >
                        Changer le logo
                    </button>
                </div>
            </div>

            {/* Accès rapide */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => navigate('/business/products')}
                    className="flex items-center justify-center gap-2 py-3 bg-green-50 hover:bg-green-100 text-green-700 font-semibold rounded-xl text-sm transition-colors"
                >
                    <Package size={16} />
                    Mes produits
                </button>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* Informations générales */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                    <h2 className="text-sm font-bold text-gray-700">Informations générales</h2>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Nom de l'entreprise
                        </label>
                        <div className="relative">
                            <Building2 size={16} className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                                {...register('name')}
                                placeholder="Nom de l'entreprise"
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-colors
                  ${errors.name ? 'border-red-400' : 'border-gray-200 focus:border-green-600'}`}
                            />
                        </div>
                        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <div className="relative">
                            <FileText size={16} className="absolute left-3 top-3 text-gray-400" />
                            <textarea
                                {...register('description')}
                                rows={4}
                                placeholder="Présentez votre activité..."
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-colors resize-none
                  ${errors.description ? 'border-red-400' : 'border-gray-200 focus:border-green-600'}`}
                            />
                        </div>
                        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                    </div>
                </div>

                {/* Coordonnées */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                    <h2 className="text-sm font-bold text-gray-700">Coordonnées</h2>

                    {[
                        { name: 'email', label: 'Email', icon: Mail, placeholder: 'contact@entreprise.com', type: 'email' },
                        { name: 'phone', label: 'Téléphone', icon: Phone, placeholder: '+226 70 00 00 00' },
                        { name: 'website', label: 'Site web', icon: Globe, placeholder: 'https://monsite.com' },
                    ].map(({ name, label, icon: Icon, placeholder, type }) => (
                        <div key={name} className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">{label}</label>
                            <div className="relative">
                                <Icon size={16} className="absolute left-3 top-3.5 text-gray-400" />
                                <input
                                    {...register(name as keyof BusinessForm)}
                                    type={type ?? 'text'}
                                    placeholder={placeholder}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-600 text-sm outline-none transition-colors"
                                />
                            </div>
                            {errors[name as keyof BusinessForm] && (
                                <p className="text-xs text-red-500">{errors[name as keyof BusinessForm]?.message}</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Localisation */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                    <h2 className="text-sm font-bold text-gray-700">Localisation</h2>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Région</label>
                        <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-3.5 text-gray-400" />
                            <select
                                {...register('region')}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-600 text-sm outline-none transition-colors appearance-none bg-white"
                            >
                                <option value="">Sélectionner une région</option>
                                {REGIONS.map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {[
                        { name: 'province', label: 'Province', placeholder: 'Province' },
                        { name: 'commune', label: 'Commune', placeholder: 'Commune' },
                        { name: 'address', label: 'Adresse', placeholder: 'Adresse complète' },
                    ].map(({ name, label, placeholder }) => (
                        <div key={name} className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">{label}</label>
                            <div className="relative">
                                <Home size={16} className="absolute left-3 top-3.5 text-gray-400" />
                                <input
                                    {...register(name as keyof BusinessForm)}
                                    placeholder={placeholder}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-600 text-sm outline-none transition-colors"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bouton submit */}
                <button
                    type="submit"
                    disabled={updateEnterprise.isPending}
                    className="w-full py-3 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                >
                    {updateEnterprise.isPending && <Loader2 size={16} className="animate-spin" />}
                    {updateEnterprise.isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
            </form>

        </div>
    )
}