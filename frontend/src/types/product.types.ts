export type ProductStatus = 'disponible' | 'sur_commande' | 'indisponible'
export type ProductUnit = 'kg' | 'tonne' | 'litre' | 'pièce' | 'tête' | 'sac' | 'autre'

export interface ProductImage {
    id: number
    image: string
    alt_text: string
    created_at: string
}

export interface Product {
    id: number
    name: string
    description: string
    indicative_price: string
    unit: ProductUnit
    quantity_available: string | null
    images: ProductImage[]
    status: ProductStatus
    created_at: string
    updated_at: string
    enterprise: number
    enterprise_name: string
    region: string
    province: string
    category: number
    category_name: string
    sub_sector: string
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