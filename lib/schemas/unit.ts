import { z } from "zod"

export const unitSchema = z.object({
  id: z.string().optional(),
  unit_code: z.string().min(1, "Unit code is required"),
  unit_name: z.string().min(1, "Unit name is required"),
  base_unit: z.string().optional().nullable(),
  operator: z.enum(["*", "/"]).optional().nullable(),
  operation_value: z.number().optional().nullable(),
})

export type UnitFormValues = z.infer<typeof unitSchema>
