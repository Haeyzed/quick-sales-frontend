import { z } from "zod"

export const taxSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Tax name is required"),
  rate: z.number().min(0, "Rate must be positive").max(100, "Rate cannot exceed 100"),
})

export type TaxFormValues = z.infer<typeof taxSchema>
