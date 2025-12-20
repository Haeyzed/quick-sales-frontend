"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProductCombobox } from "@/components/products/product-combobox"
import { mockProducts } from "@/lib/mock-data/products"
import { mockWarehouses } from "@/lib/mock-data/warehouses"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ProductHistoryListPage() {
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [dateRange, setDateRange] = useState("2025-01-01 To 2025-01-18")
  const [warehouseId, setWarehouseId] = useState("0")

  // Mock history data for all products
  const mockHistoryData = {
    sales: [
      {
        id: "1",
        product_name: "Samsung Galaxy S23",
        date: "2025-01-15",
        reference_no: "SR-0001",
        warehouse: "Main Warehouse",
        customer: "John Doe",
        quantity: 2,
        unit_price: 780,
        subtotal: 1560,
      },
      {
        id: "2",
        product_name: 'Apple MacBook Pro 14"',
        date: "2025-01-14",
        reference_no: "SR-0002",
        warehouse: "Branch Warehouse 1",
        customer: "Jane Smith",
        quantity: 1,
        unit_price: 2070,
        subtotal: 2070,
      },
    ],
    purchases: [
      {
        id: "1",
        product_name: "Samsung Galaxy S23",
        date: "2025-01-10",
        reference_no: "PR-0001",
        warehouse: "Main Warehouse",
        supplier: "Tech Supplies Inc",
        quantity: 50,
        unit_price: 650,
        subtotal: 32500,
      },
    ],
    saleReturns: [],
    purchaseReturns: [],
  }

  const filteredHistory = selectedProduct
    ? {
        sales: mockHistoryData.sales.filter((s) => {
          const product = mockProducts.find((p) => p.name === s.product_name)
          return product?.id === selectedProduct
        }),
        purchases: mockHistoryData.purchases.filter((p) => {
          const product = mockProducts.find((pr) => pr.name === p.product_name)
          return product?.id === selectedProduct
        }),
        saleReturns: [],
        purchaseReturns: [],
      }
    : mockHistoryData

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <Label>Product</Label>
              <ProductCombobox 
                value={selectedProduct}
                onChange={setSelectedProduct}
                options={[
                  { value: "", label: "All Products" },
                  ...mockProducts.map((p) => ({ value: p.id, label: `${p.name} [${p.code}]` })),
                ]}
                placeholder="Select product..."
              />
            </div>

            <div>
              <Label>Date Range</Label>
              <Input
                type="text"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                placeholder="Select date range"
              />
            </div>

            <div>
              <Label>Warehouse</Label>
              <ProductCombobox 
                value={warehouseId}
                onChange={setWarehouseId}
                options={[
                  { value: "0", label: "All Warehouse" },
                  ...mockWarehouses.map((w) => ({ value: w.id, label: w.name })),
                ]}
                placeholder="Select warehouse..."
              />
            </div>

            <div className="flex items-end">
              <Button>Submit</Button>
            </div>
          </div>

          <Tabs defaultValue="sale" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="sale">Sale</TabsTrigger>
              <TabsTrigger value="purchase">Purchase</TabsTrigger>
              <TabsTrigger value="sale-return">Sale Return</TabsTrigger>
              <TabsTrigger value="purchase-return">Purchase Return</TabsTrigger>
            </TabsList>

            <TabsContent value="sale" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Warehouse</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.sales.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground h-24">
                          No sales found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredHistory.sales.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell className="font-medium">{sale.product_name}</TableCell>
                          <TableCell>{sale.date}</TableCell>
                          <TableCell>{sale.reference_no}</TableCell>
                          <TableCell>{sale.warehouse}</TableCell>
                          <TableCell>{sale.customer}</TableCell>
                          <TableCell>{sale.quantity}</TableCell>
                          <TableCell>${sale.unit_price.toFixed(2)}</TableCell>
                          <TableCell>${sale.subtotal.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="purchase" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Warehouse</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.purchases.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground h-24">
                          No purchases found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredHistory.purchases.map((purchase) => (
                        <TableRow key={purchase.id}>
                          <TableCell className="font-medium">{purchase.product_name}</TableCell>
                          <TableCell>{purchase.date}</TableCell>
                          <TableCell>{purchase.reference_no}</TableCell>
                          <TableCell>{purchase.warehouse}</TableCell>
                          <TableCell>{purchase.supplier}</TableCell>
                          <TableCell>{purchase.quantity}</TableCell>
                          <TableCell>${purchase.unit_price.toFixed(2)}</TableCell>
                          <TableCell>${purchase.subtotal.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="sale-return" className="space-y-4">
              <div className="rounded-md border p-8 text-center text-muted-foreground">No sale returns found</div>
            </TabsContent>

            <TabsContent value="purchase-return" className="space-y-4">
              <div className="rounded-md border p-8 text-center text-muted-foreground">No purchase returns found</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
