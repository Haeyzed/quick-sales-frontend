import type { Unit } from "@/lib/types/unit"

export const mockUnits: Unit[] = [
  { id: "1", code: "PC", name: "Piece", base_unit: null },
  { id: "2", code: "BOX", name: "Box", base_unit: "1", operation_value: 12, operator: "*" },
  { id: "3", code: "CTN", name: "Carton", base_unit: "1", operation_value: 144, operator: "*" },
  { id: "4", code: "KG", name: "Kilogram", base_unit: null },
  { id: "5", code: "L", name: "Liter", base_unit: null },
  { id: "6", code: "G", name: "Gram", base_unit: "4", operation_value: 1000, operator: "/" },
]
