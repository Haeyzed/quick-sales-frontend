import type { Tax } from "@/lib/types/tax"

export const mockTaxes: Tax[] = [
  { id: "1", name: "VAT 15%", rate: 15 },
  { id: "2", name: "VAT 5%", rate: 5 },
  { id: "3", name: "GST 18%", rate: 18 },
  { id: "4", name: "Sales Tax 10%", rate: 10 },
]
