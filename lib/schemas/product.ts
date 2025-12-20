import { z } from "zod"

export const generalSettingsSchema = z.object({
  modules: z.array(z.string()),
})

// Form schema - all fields are properly typed for react-hook-form (no defaults)
export const productFormSchema = z
  .object({
    id: z.string().optional(),
    type: z.enum(["standard", "combo", "digital", "service"]),
    name: z.string().min(1, "Product name is required"),
    code: z.string().min(1, "Product code is required"),
    barcode_symbology: z.enum(["C128", "C39", "UPCA", "UPCE", "EAN8", "EAN13"]),
    file: z.string().optional(),
    brand_id: z.string().optional(),
    category_id: z.string().min(1, "Category is required"),
    unit_id: z.string().optional(),
    sale_unit_id: z.string().optional(),
    purchase_unit_id: z.string().optional(),
    cost: z.number().min(0, "Cost must be greater than or equal to 0"),
    profit_margin: z.number().optional(),
    price: z.number().min(0, "Price must be greater than or equal to 0"),
    wholesale_price: z.number().optional(),
    daily_sale_objective: z.number().optional(),
    alert_quantity: z.number().optional(),
    tax_id: z.string().optional(),
    tax_method: z.enum(["exclusive", "inclusive"]),
    warranty: z.number().optional(),
    warranty_type: z.enum(["days", "months", "years"]).optional(),
    guarantee: z.number().optional(),
    guarantee_type: z.enum(["days", "months", "years"]).optional(),
    product_details: z.string().optional(),
    qty: z.number(),
    images: z.array(z.string()).optional(),
    is_variant: z.boolean(),
    variants: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          item_code: z.string(),
          additional_price: z.number(),
        }),
      )
      .optional(),
    is_batch: z.boolean(),
    is_imei: z.boolean(),
    is_embeded: z.boolean().optional(),
    is_initial_stock: z.boolean().optional(),
    initial_stock: z
      .array(
        z.object({
          warehouse_id: z.string(),
          quantity: z.number().min(0),
        }),
      )
      .optional(),
    is_diffPrice: z.boolean().optional(),
    diff_prices: z
      .array(
        z.object({
          warehouse_id: z.string(),
          price: z.number().min(0),
        }),
      )
      .optional(),
    is_sync_disable: z.boolean().optional(),
    is_online: z.boolean().optional(),
    is_addon: z.boolean().optional(),
    in_stock: z.boolean().optional(),
    product_tags: z.array(z.string()).optional(),
    starting_date: z.date().optional(),
    last_date: z.date().optional(),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    variant_option: z.array(z.string()).optional(),
    variant_value: z.array(z.string()).optional(),
    combo_products: z
      .array(
        z.object({
          product_id: z.string(),
          variant_id: z.string().optional(),
          product_name: z.string(),
          product_code: z.string(),
          wastage_percent: z.number(),
          quantity: z.number(),
          unit_id: z.string(),
          unit_cost: z.number(),
          unit_price: z.number(),
          subtotal: z.number(),
        }),
      )
      .optional(),
    warehouse_stocks: z
      .array(
        z.object({
          warehouse_id: z.string(),
          warehouse_name: z.string(),
          quantity: z.number(),
          price: z.number().optional(),
        }),
      )
      .optional(),
    featured: z.boolean(),
    promotion: z.boolean(),
    promotion_price: z.number().optional(),
    related_products: z.array(z.string()).optional(),
    is_active: z.boolean(),
    brand: z
      .object({
        id: z.string(),
        name: z.string(),
      })
      .optional(),
    category: z
      .object({
        id: z.string(),
        name: z.string(),
      })
      .optional(),
    unit: z
      .object({
        id: z.string(),
        name: z.string(),
      })
      .optional(),
    tax: z
      .object({
        id: z.string(),
        name: z.string(),
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.type === "digital" && !data.file) {
        return false
      }
      return true
    },
    {
      message: "File is required for digital products",
      path: ["file"],
    },
  )
  .refine(
    (data) => {
      if (data.promotion && !data.promotion_price) {
        return false
      }
      return true
    },
    {
      message: "Promotion price is required when promotion is enabled",
      path: ["promotion_price"],
    },
  )
  .refine(
    (data) => {
      if (data.promotion && (!data.starting_date || !data.last_date)) {
        return false
      }
      return true
    },
    {
      message: "Start and end dates are required when promotion is enabled",
      path: ["starting_date"],
    },
  )
  .refine(
    (data) => {
      if (data.is_online && !data.meta_title) {
        return false
      }
      return true
    },
    {
      message: "Meta title is required for online products",
      path: ["meta_title"],
    },
  )
  .refine(
    (data) => {
      if (data.is_online && !data.meta_description) {
        return false
      }
      return true
    },
    {
      message: "Meta description is required for online products",
      path: ["meta_description"],
    },
  )

// Main product schema for validation (keeps defaults for API/DB)
export const productSchema = productFormSchema

export type ProductFormValues = z.infer<typeof productFormSchema>
export type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>
