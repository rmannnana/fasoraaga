export type ProductStatus = 'disponible' | 'sur_commande' | 'indisponible'
export type ProductUnit = 'kg' | 'tonne' | 'litre' | 'pièce' | 'tête' | 'sac' | 'autre'

export interface Product {
    id: number
    name: string
    description: string
    indicative_price: number
    unit: ProductUnit
    quantity_available: number | null
    images: string[]
    status: ProductStatus
    created_at: string
    updated_at: string
    entreprise: number
    entreprise_name: string
    entreprise_region: string
    category: number
    category_name: string
}

export interface ProductFilters {
    q?: string
    sector?: string
    category?: string
    region?: string
    province?: string
    page?: number
}

export interface EnterpriseFilters {
    q?: string
    sector?: string
    region?: string
    province?: string
    page?: number
}