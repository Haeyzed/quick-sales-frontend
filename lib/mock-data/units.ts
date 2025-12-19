import type { Unit } from "@/lib/types/unit"

export const mockUnits: Unit[] = [
  { id: "1", unit_code: "PC", unit_name: "Piece", base_unit: null },
  { id: "2", unit_code: "BOX", unit_name: "Box", base_unit: "1", operation_value: 12, operator: "*" },
  { id: "3", unit_code: "CTN", unit_name: "Carton", base_unit: "1", operation_value: 144, operator: "*" },
  { id: "4", unit_code: "KG", unit_name: "Kilogram", base_unit: null },
  { id: "5", unit_code: "L", unit_name: "Liter", base_unit: null },
  { id: "6", unit_code: "G", unit_name: "Gram", base_unit: "4", operation_value: 1000, operator: "/" },
]
