export interface User {
    id: number
    first_name: string
    last_name: string
    email: string
    phone: string
    profile_picture: string | null
    bio: string | null
    role: {
        id: number
        name: string
    }
}

export interface AuthTokens {
    access: string
    refresh: string
}

export interface LoginPayload {
    email: string
    password: string
}

export interface RegisterPayload {
    first_name: string
    last_name: string
    email: string
    phone: string
    password: string
}