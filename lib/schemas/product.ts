import { z } from "zod"

export const generalSettingsSchema = z.object({
  modules: z.array(z.string()),
})

export const productSchema = z
  .object({
    id: z.string().optional(),
    type: z.enum(["standard", "combo", "digital", "service"]),
    name: z.string().min(1, "Product name is required").default(""),
    code: z.string().min(1, "Product code is required").default(""),
    barcode_symbology: z.enum(["C128", "C39", "UPCA", "UPCE", "EAN8", "EAN13"]).default("C128"),
    file: z.string().optional().default(""),
    brand_id: z.string().optional().default(""),
    category_id: z.string().min(1, "Category is required").default(""),
    unit_id: z.string().optional().default(""),
    sale_unit_id: z.string().optional().default(""),
    purchase_unit_id: z.string().optional().default(""),
    cost: z.number().min(0, "Cost must be greater than or equal to 0").default(0),
    profit_margin: z.number().optional().default(0),
    price: z.number().min(0, "Price must be greater than or equal to 0").default(0),
    wholesale_price: z.number().optional().default(0),
    daily_sale_objective: z.number().optional().default(0),
    alert_quantity: z.number().optional().default(0),
    tax_id: z.string().optional().default(""),
    tax_method: z.enum(["exclusive", "inclusive"]).default("exclusive"),
    warranty: z.number().optional().default(0),
    warranty_type: z.enum(["days", "months", "years"]).optional().default("months"),
    guarantee: z.number().optional().default(0),
    guarantee_type: z.enum(["days", "months", "years"]).optional().default("months"),
    product_details: z.string().optional().default(""),
    qty: z.number().default(0),
    images: z.array(z.string()).optional().default([]),
    is_variant: z.boolean().default(false),
    variants: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          item_code: z.string(),
          additional_price: z.number(),
        }),
      )
      .optional()
      .default([]),
    is_batch: z.boolean().default(false),
    is_imei: z.boolean().default(false),
    is_embeded: z.boolean().optional().default(false),
    is_initial_stock: z.boolean().optional().default(false),
    initial_stock: z
      .array(
        z.object({
          warehouse_id: z.string(),
          quantity: z.number().min(0),
        }),
      )
      .optional()
      .default([]),
    is_diffPrice: z.boolean().optional().default(false),
    diff_prices: z
      .array(
        z.object({
          warehouse_id: z.string(),
          price: z.number().min(0),
        }),
      )
      .optional()
      .default([]),
    is_sync_disable: z.boolean().optional().default(false),
    is_online: z.boolean().optional().default(true),
    is_addon: z.boolean().optional().default(false),
    in_stock: z.boolean().optional().default(true),
    product_tags: z.array(z.string()).optional().default([]),
    starting_date: z.date().optional(),
    last_date: z.date().optional(),
    meta_title: z.string().optional().default(""),
    meta_description: z.string().optional().default(""),
    variant_option: z.array(z.string()).optional().default([]),
    variant_value: z.array(z.string()).optional().default([]),
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
      .optional()
      .default([]),
    warehouse_stocks: z
      .array(
        z.object({
          warehouse_id: z.string(),
          warehouse_name: z.string(),
          quantity: z.number(),
          price: z.number().optional(),
        }),
      )
      .optional()
      .default([]),
    featured: z.boolean().default(false),
    promotion: z.boolean().default(false),
    promotion_price: z.number().optional().default(0),
    related_products: z.array(z.string()).optional().default([]),
    is_active: z.boolean().default(true),
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

export type ProductFormValues = z.infer<typeof productSchema>
export type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>
