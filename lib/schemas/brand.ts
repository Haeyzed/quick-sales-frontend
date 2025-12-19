import { z } from "zod"

export const brandSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Brand name is required"),
  image: z.string().optional(),
  page_title: z.string().optional(),
  short_description: z.string().optional(),
})

export type BrandFormValues = z.infer<typeof brandSchema>
