import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, Loader2, User, Phone, Mail, FileText, Lock, LogOut } from 'lucide-react'
import { useProfile, useUpdateProfile, useUpdateProfilePicture, useChangePassword } from '../../features/auth/hooks/useProfile'
import { useLogout } from '../../features/auth/hooks/useAuth'

// ── Schémas ───────────────────────────────────────────────────────
const profileSchema = z.object({
    first_name: z.string().min(2, 'Prénom requis'),
    last_name: z.string().min(2, 'Nom requis'),
    phone: z.string().min(8, 'Numéro invalide'),
    bio: z.string().max(300, 'Maximum 300 caractères').optional(),
})

const passwordSchema = z.object({
    old_password: z.string().min(1, 'Requis'),
    new_password: z.string().min(8, 'Minimum 8 caractères'),
    confirm_password: z.string(),
}).refine((d) => d.new_password === d.confirm_password, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirm_password'],
})

type ProfileForm = z.infer<typeof profileSchema>
type PasswordForm = z.infer<typeof passwordSchema>

// ── Composant champ ────────────────────────────────────────────────
function Field({
    label, error, type = 'text', placeholder, registration, icon: Icon, textarea = false
}: {
    label: string
    error?: string
    type?: string
    placeholder?: string
    registration: object
    icon?: React.FC<{ size?: number; className?: string }>
    textarea?: boolean
}) {
    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-3 text-gray-400">
                        <Icon size={16} />
                    </div>
                )}
                {textarea ? (
                    <textarea
                        placeholder={placeholder}
                        rows={3}
                        className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-3 rounded-xl border text-sm outline-none transition-colors resize-none
              ${error ? 'border-red-400' : 'border-gray-200 focus:border-green-600'}`}
                        {...registration}
                    />
                ) : (
                    <input
                        type={type}
                        placeholder={placeholder}
                        className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-3 rounded-xl border text-sm outline-none transition-colors
              ${error ? 'border-red-400' : 'border-gray-200 focus:border-green-600'}`}
                        {...registration}
                    />
                )}
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    )
}

// ── Page principale ────────────────────────────────────────────────
export default function ProfilePage() {
    const [tab, setTab] = useState<'info' | 'password'>('info')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const logout = useLogout()

    const profileQuery = useProfile()
    const updateProfile = useUpdateProfile()
    const updatePicture = useUpdateProfilePicture()
    const changePassword = useChangePassword()

    const user = profileQuery.data

    const profileForm = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
        values: {
            first_name: user?.first_name ?? '',
            last_name: user?.last_name ?? '',
            phone: user?.phone ?? '',
            bio: user?.bio ?? '',
        },
    })

    const passwordForm = useForm<PasswordForm>({
        resolver: zodResolver(passwordSchema),
    })

    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) updatePicture.mutate(file)
    }

    const onSubmitProfile = (data: ProfileForm) => {
        updateProfile.mutate(data)
    }

    const onSubmitPassword = (data: PasswordForm) => {
        changePassword.mutate(
            { old_password: data.old_password, new_password: data.new_password },
            { onSuccess: () => passwordForm.reset() }
        )
    }

    if (profileQuery.isLoading) {
        return (
            <div className="max-w-xl mx-auto px-4 py-6 space-y-4 animate-pulse">
                <div className="h-24 w-24 bg-gray-100 rounded-full mx-auto" />
                <div className="h-6 bg-gray-100 rounded w-1/2 mx-auto" />
                <div className="h-40 bg-gray-100 rounded-2xl" />
            </div>
        )
    }

    return (
        <div className="max-w-xl mx-auto px-4 py-6 space-y-6">

            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                        {user?.profile_picture ? (
                            <img
                                src={user.profile_picture}
                                alt="Photo de profil"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User size={36} className="text-gray-300" />
                        )}
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={updatePicture.isPending}
                        className="absolute bottom-0 right-0 w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white hover:bg-green-800 transition-colors"
                    >
                        {updatePicture.isPending
                            ? <Loader2 size={14} className="animate-spin" />
                            : <Camera size={14} />
                        }
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePictureChange}
                    />
                </div>
                <div className="text-center">
                    <p className="font-semibold text-gray-800">
                        {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-sm text-gray-400">{user?.role?.name}</p>
                </div>
            </div>

            {/* Email (lecture seule) */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail size={16} className="text-gray-400 shrink-0" />
                    <div>
                        <p className="text-xs text-gray-400">Email</p>
                        <p className="font-medium">{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Onglets */}
            <div className="flex bg-gray-100 rounded-xl p-1">
                {([
                    { key: 'info', label: 'Informations' },
                    { key: 'password', label: 'Mot de passe' },
                ] as const).map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${tab === key
                                ? 'bg-white text-green-700 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Formulaire infos */}
            {tab === 'info' && (
                <form
                    onSubmit={profileForm.handleSubmit(onSubmitProfile)}
                    className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
                >
                    <div className="grid grid-cols-2 gap-3">
                        <Field
                            label="Prénom"
                            placeholder="Moussa"
                            icon={User}
                            error={profileForm.formState.errors.first_name?.message}
                            registration={profileForm.register('first_name')}
                        />
                        <Field
                            label="Nom"
                            placeholder="Traoré"
                            error={profileForm.formState.errors.last_name?.message}
                            registration={profileForm.register('last_name')}
                        />
                    </div>
                    <Field
                        label="Téléphone"
                        placeholder="+226 70 00 00 00"
                        icon={Phone}
                        error={profileForm.formState.errors.phone?.message}
                        registration={profileForm.register('phone')}
                    />
                    <Field
                        label="Biographie"
                        placeholder="Présentez-vous en quelques mots..."
                        icon={FileText}
                        textarea
                        error={profileForm.formState.errors.bio?.message}
                        registration={profileForm.register('bio')}
                    />
                    <button
                        type="submit"
                        disabled={updateProfile.isPending}
                        className="w-full py-3 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                    >
                        {updateProfile.isPending && <Loader2 size={16} className="animate-spin" />}
                        {updateProfile.isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                </form>
            )}

            {/* Formulaire mot de passe */}
            {tab === 'password' && (
                <form
                    onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
                    className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
                >
                    <Field
                        label="Mot de passe actuel"
                        type="password"
                        icon={Lock}
                        placeholder="••••••••"
                        error={passwordForm.formState.errors.old_password?.message}
                        registration={passwordForm.register('old_password')}
                    />
                    <Field
                        label="Nouveau mot de passe"
                        type="password"
                        icon={Lock}
                        placeholder="Minimum 8 caractères"
                        error={passwordForm.formState.errors.new_password?.message}
                        registration={passwordForm.register('new_password')}
                    />
                    <Field
                        label="Confirmer le mot de passe"
                        type="password"
                        icon={Lock}
                        placeholder="••••••••"
                        error={passwordForm.formState.errors.confirm_password?.message}
                        registration={passwordForm.register('confirm_password')}
                    />
                    <button
                        type="submit"
                        disabled={changePassword.isPending}
                        className="w-full py-3 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                    >
                        {changePassword.isPending && <Loader2 size={16} className="animate-spin" />}
                        {changePassword.isPending ? 'Modification...' : 'Modifier le mot de passe'}
                    </button>
                </form>
            )}

            {/* Déconnexion */}
            <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-3 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors"
            >
                <LogOut size={16} />
                Se déconnecter
            </button>

        </div>
    )
}