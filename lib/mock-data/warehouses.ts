import type { Warehouse } from "@/lib/types/warehouse"

export const mockWarehouses: Warehouse[] = [
  { id: "1", name: "Main Warehouse", phone: "+1234567890", email: "main@warehouse.com", address: "123 Main St" },
  {
    id: "2",
    name: "Branch Warehouse 1",
    phone: "+1234567891",
    email: "branch1@warehouse.com",
    address: "456 Branch Ave",
  },
  {
    id: "3",
    name: "Branch Warehouse 2",
    phone: "+1234567892",
    email: "branch2@warehouse.com",
    address: "789 Branch Blvd",
  },
]
