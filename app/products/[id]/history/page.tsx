"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProductCombobox } from "@/components/products/product-combobox"
import { mockProducts, mockWarehouses } from "@/lib/mock-data/products"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ProductHistoryPage({ params }: { params: { id: string } }) {
  const product = mockProducts.find((p) => p.id === params.id)
  const [dateRange, setDateRange] = useState("2025-01-01 To 2025-01-18")
  const [warehouseId, setWarehouseId] = useState("0")

  if (!product) {
    return <div>Product not found</div>
  }

  // Mock history data
  const mockHistory = {
    sales: [
      {
        id: "1",
        date: "2025-01-15",
        reference_no: "SR-0001",
        warehouse: "Main Warehouse",
        customer: "John Doe",
        quantity: 2,
        unit_price: 780,
        subtotal: 1560,
      },
    ],
    purchases: [
      {
        id: "1",
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

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-1">
              <h4 className="font-semibold text-lg">
                {product.name} [{product.code}]
              </h4>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Date</label>
              <Input
                type="text"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                placeholder="Select date range"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Warehouse</label>
              <ProductCombobox
                value={warehouseId}
                onChange={setWarehouseId}
                options={[
                  { value: "0", label: "All Warehouse" },
                  ...mockWarehouses.map((w) => ({ value: w.id, label: w.name })),
                ]}
                placeholder="Select warehouse..."
                searchable
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
                    {mockHistory.sales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>{sale.date}</TableCell>
                        <TableCell>{sale.reference_no}</TableCell>
                        <TableCell>{sale.warehouse}</TableCell>
                        <TableCell>{sale.customer}</TableCell>
                        <TableCell>{sale.quantity}</TableCell>
                        <TableCell>${sale.unit_price.toFixed(2)}</TableCell>
                        <TableCell>${sale.subtotal.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="purchase" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
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
                    {mockHistory.purchases.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell>{purchase.date}</TableCell>
                        <TableCell>{purchase.reference_no}</TableCell>
                        <TableCell>{purchase.warehouse}</TableCell>
                        <TableCell>{purchase.supplier}</TableCell>
                        <TableCell>{purchase.quantity}</TableCell>
                        <TableCell>${purchase.unit_price.toFixed(2)}</TableCell>
                        <TableCell>${purchase.subtotal.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
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
