export interface Entreprise {
    id: number
    owner: number
    name: string
    description: string
    logo: string | null
    email: string | null
    phone: string | null
    website: string | null
    region: string
    province: string
    commune: string
    address: string | null
    created_at: string
    updated_at: string
}

export interface EntreprisePayload {
    name?: string
    description?: string
    email?: string
    phone?: string
    website?: string
    region?: string
    province?: string
    commune?: string
    address?: string
}