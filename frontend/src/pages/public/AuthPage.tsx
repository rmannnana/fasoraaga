import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useLogin, useRegister } from '../../features/auth/hooks/useAuth'

// ── Schémas de validation ──────────────────────────────────────────
const loginSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(1, 'Mot de passe requis'),
})

const registerSchema = z.object({
    first_name: z.string().min(2, 'Prénom requis'),
    last_name: z.string().min(2, 'Nom requis'),
    email: z.string().email('Email invalide'),
    phone: z.string().min(8, 'Numéro invalide'),
    password: z.string().min(8, 'Minimum 8 caractères'),
    confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirm_password'],
})

type LoginForm = z.infer<typeof loginSchema>
type RegisterForm = z.infer<typeof registerSchema>

// ── Composant champ texte ──────────────────────────────────────────
interface FieldProps {
    label: string
    error?: string
    type?: string
    placeholder?: string
    registration: object
}

function Field({ label, error, type = 'text', placeholder, registration }: FieldProps) {
    const [show, setShow] = useState(false)
    const isPassword = type === 'password'

    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="relative">
                <input
                    type={isPassword ? (show ? 'text' : 'password') : type}
                    placeholder={placeholder}
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors
            ${error
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-gray-200 focus:border-green-600'
                        }`}
                    {...registration}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    )
}

// ── Formulaire de connexion ────────────────────────────────────────
function LoginForm() {
    const login = useLogin()
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    })

    return (
        <form onSubmit={handleSubmit((data) => login.mutate(data))} className="space-y-4">
            <Field
                label="Email"
                type="email"
                placeholder="votre@email.com"
                error={errors.email?.message}
                registration={register('email')}
            />
            <Field
                label="Mot de passe"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                registration={register('password')}
            />

            <button
                type="submit"
                disabled={login.isPending}
                className="w-full py-3 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
                {login.isPending && <Loader2 size={16} className="animate-spin" />}
                {login.isPending ? 'Connexion...' : 'Se connecter'}
            </button>
        </form>
    )
}

// ── Formulaire d'inscription ───────────────────────────────────────
function RegisterForm() {
    const register_ = useRegister()
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    })

    return (
        <form
            onSubmit={handleSubmit(({ confirm_password: _, ...data }) => register_.mutate(data))}
            className="space-y-4"
        >
            <div className="grid grid-cols-2 gap-3">
                <Field
                    label="Prénom"
                    placeholder="Moussa"
                    error={errors.first_name?.message}
                    registration={register('first_name')}
                />
                <Field
                    label="Nom"
                    placeholder="Traoré"
                    error={errors.last_name?.message}
                    registration={register('last_name')}
                />
            </div>
            <Field
                label="Email"
                type="email"
                placeholder="votre@email.com"
                error={errors.email?.message}
                registration={register('email')}
            />
            <Field
                label="Téléphone"
                placeholder="+226 70 00 00 00"
                error={errors.phone?.message}
                registration={register('phone')}
            />
            <Field
                label="Mot de passe"
                type="password"
                placeholder="Minimum 8 caractères"
                error={errors.password?.message}
                registration={register('password')}
            />
            <Field
                label="Confirmer le mot de passe"
                type="password"
                placeholder="••••••••"
                error={errors.confirm_password?.message}
                registration={register('confirm_password')}
            />

            <button
                type="submit"
                disabled={register_.isPending}
                className="w-full py-3 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
                {register_.isPending && <Loader2 size={16} className="animate-spin" />}
                {register_.isPending ? 'Création...' : 'Créer mon compte'}
            </button>
        </form>
    )
}

// ── Page principale ────────────────────────────────────────────────
export default function AuthPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [tab, setTab] = useState<'login' | 'register'>(
        searchParams.get('tab') === 'register' ? 'register' : 'login'
    )

    useEffect(() => {
        setSearchParams({ tab })
    }, [tab])

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md space-y-6">

                {/* Logo */}
                <div className="text-center space-y-1">
                    <h1 className="text-2xl font-bold text-green-700">FasoRaaga</h1>
                    <p className="text-sm text-gray-500">Salon professionnel numérique du Burkina Faso</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">

                    {/* Onglets */}
                    <div className="flex bg-gray-100 rounded-xl p-1">
                        {(['login', 'register'] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${tab === t
                                        ? 'bg-white text-green-700 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {t === 'login' ? 'Connexion' : 'Inscription'}
                            </button>
                        ))}
                    </div>

                    {/* Formulaire actif */}
                    {tab === 'login' ? <LoginForm /> : <RegisterForm />}
                </div>

                {/* Lien alternatif */}
                <p className="text-center text-sm text-gray-500">
                    {tab === 'login' ? (
                        <>Pas encore de compte ?{' '}
                            <button onClick={() => setTab('register')} className="text-green-700 font-medium hover:underline">
                                S'inscrire
                            </button>
                        </>
                    ) : (
                        <>Déjà un compte ?{' '}
                            <button onClick={() => setTab('login')} className="text-green-700 font-medium hover:underline">
                                Se connecter
                            </button>
                        </>
                    )}
                </p>

            </div>
        </div>
    )
}