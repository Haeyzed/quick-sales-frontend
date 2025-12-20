import { Brand } from "./brand"
import { Category } from "./category"
import { Unit } from "./unit"
import { Tax } from "./tax"

export type ProductType = "standard" | "combo" | "digital" | "service"

export type BarcodeSymbology = "C128" | "C39" | "UPCA" | "UPCE" | "EAN8" | "EAN13"

export type TaxMethod = "exclusive" | "inclusive"

export type WarrantyType = "days" | "months" | "years"

export interface ProductVariant {
  id: string
  name: string
  item_code: string
  additional_price: number
}

export interface ComboProduct {
  product_id: string
  variant_id?: string
  product_name: string
  product_code: string
  wastage_percent: number
  quantity: number
  unit_id: string
  unit_cost: number
  unit_price: number
  subtotal: number
}

export interface WarehouseStock {
  warehouse_id: string
  warehouse_name: string
  quantity: number
  price?: number
}

export interface GeneralSettings {
  modules: string[] // Array of enabled modules like 'ecommerce', 'restaurant', 'woocommerce'
}

export interface Product {
  id: string
  type: ProductType
  name: string
  code: string
  barcode_symbology: BarcodeSymbology
  file?: string
  brand_id?: string
  category_id: string
  unit_id: string
  sale_unit_id?: string
  purchase_unit_id?: string
  cost: number
  profit_margin?: number
  price: number
  wholesale_price?: number
  daily_sale_objective?: number
  alert_quantity?: number
  tax_id?: string
  tax_method: TaxMethod
  warranty?: number
  warranty_type?: WarrantyType
  guarantee?: number
  guarantee_type?: WarrantyType
  product_details?: string
  qty: number
  images?: string[]
  is_variant: boolean
  variants?: ProductVariant[]
  is_batch: boolean
  is_imei: boolean
  is_embeded?: boolean // Added is_embeded field
  is_initial_stock?: boolean
  initial_stock?: Array<{
    warehouse_id: string
    quantity: number
  }>
  is_diffPrice?: boolean
  diff_prices?: Array<{
    warehouse_id: string
    price: number
  }>
  is_sync_disable?: boolean
  is_online?: boolean
  is_addon?: boolean
  in_stock?: boolean
  product_tags?: string[]
  starting_date?: Date
  last_date?: Date
  meta_title?: string
  meta_description?: string
  variant_option?: string[]
  variant_value?: string[]
  combo_products?: ComboProduct[]
  warehouse_stocks?: WarehouseStock[]
  featured: boolean
  promotion: boolean
  promotion_price?: number
  promotion_dates?: {
    from?: Date
    to?: Date
    startTime?: string
    endTime?: string
  }
  related_products?: string[] // Added related_products
  is_active: boolean
  created_at: string
  updated_at: string
  brand?: Brand
  category?: Category
  unit?: Unit
  tax?: Tax
}

export interface ProductFormData
  extends Omit<
    Product,
    "id" | "created_at" | "updated_at" | "brand" | "category" | "unit" | "tax"
  > {
  id?: string
}

export interface ProductHistory {
  id: string
  type: "sale" | "purchase" | "sale_return" | "purchase_return"
  date: string
  reference_no: string
  warehouse_id: string
  warehouse_name: string
  customer_name?: string
  supplier_name?: string
  quantity: number
  unit_price: number
  subtotal: number
}
