export interface Category {
    id: string
    name: string
    parent_id?: string
    image?: string
    icon?: string
    featured?: boolean
    is_sync_disable?: boolean
    page_title?: string
    short_description?: string
    number_of_products?: number
    stock_qty?: number
    stock_worth?: { price: number; cost: number }
    created_at?: string
    updated_at?: string
  }
  