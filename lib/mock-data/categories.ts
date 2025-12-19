import type { Category } from "@/lib/types/category"

export const mockCategories: Category[] = [
  { id: "1", name: "Electronics", number_of_products: 25, stock_qty: 150, stock_worth: { price: 45000, cost: 35000 } },
  { id: "2", name: "Furniture", number_of_products: 15, stock_qty: 80, stock_worth: { price: 32000, cost: 24000 } },
  {
    id: "3",
    name: "Clothing",
    parent_id: "1",
    number_of_products: 40,
    stock_qty: 200,
    stock_worth: { price: 18000, cost: 12000 },
  },
  {
    id: "4",
    name: "Food & Beverages",
    number_of_products: 35,
    stock_qty: 300,
    stock_worth: { price: 15000, cost: 10000 },
  },
  { id: "5", name: "Books", number_of_products: 60, stock_qty: 250, stock_worth: { price: 8000, cost: 5000 } },
]
