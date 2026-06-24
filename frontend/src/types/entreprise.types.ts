export interface Entreprise {
    id: number
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
    owner: number
    created_at: string
    updated_at: string
}