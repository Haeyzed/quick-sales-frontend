import { z } from "zod"

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Category name is required"),
  parent_id: z.string().optional(),
  image: z.string().optional(),
  icon: z.string().optional(),
  featured: z.boolean().default(false),
  is_sync_disable: z.boolean().default(false),
  page_title: z.string().optional(),
  short_description: z.string().optional(),
})

export type CategoryFormValues = z.infer<typeof categorySchema>
