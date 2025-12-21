"use client"

import Image from "next/image"
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete01Icon } from "@hugeicons/core-free-icons"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ComboProduct } from "@/lib/types/product"
import { mockProducts } from "@/lib/mock-data/products"
import { mockUnits } from "@/lib/mock-data/units"
import type { Unit } from "@/lib/types/unit"
import { ProductCombobox } from "./product-combobox"

interface ComboProductTableProps {
  products: ComboProduct[]
  onChange: (products: ComboProduct[]) => void
}

export function ComboProductTable({ products, onChange }: ComboProductTableProps) {
  const handleDelete = (index: number) => {
    onChange(products.filter((_, i) => i !== index))
  }

  // Change 'value: number' to 'value: string | number'
const handleUpdate = (index: number, field: keyof ComboProduct, value: string | number) => {
  const updated = [...products]
  updated[index] = { ...updated[index], [field]: value }

  // Recalculate subtotal
  const product = updated[index]
  
  // Ensure we are calculating with numbers
  const qty = typeof product.quantity === 'string' ? parseFloat(product.quantity) : product.quantity
  const price = typeof product.unit_price === 'string' ? parseFloat(product.unit_price) : product.unit_price
  const wastage = typeof product.wastage_percent === 'string' ? parseFloat(product.wastage_percent) : product.wastage_percent

  product.subtotal = qty * price * (1 + wastage / 100)

  onChange(updated)
}

  return (
    <div className="border rounded-lg mt-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Wastage %</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit Cost</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Subtotal</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => {
            const fullProduct = mockProducts.find((p) => p.id === product.product_id)
            const productImage = fullProduct?.images?.[0]
            return (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {productImage && (
                      <ImageZoom
                        zoomMargin={100}
                        backdropClassName={cn('[&_[data-rmiz-modal-overlay="visible"]]:bg-black/80')}
                      >
                        <Image
                          src={productImage}
                          alt={product.product_name}
                          width={40}
                          height={40}
                          className="rounded object-cover"
                        />
                      </ImageZoom>
                    )}
                    <div>
                      <div className="font-medium">{product.product_name}</div>
                      <div className="text-sm text-muted-foreground">[{product.product_code}]</div>
                    </div>
                  </div>
                </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={product.wastage_percent}
                  onChange={(e) => handleUpdate(index, "wastage_percent", Number.parseFloat(e.target.value))}
                  className="w-20"
                  min="0"
                  step="0.01"
                />
              </TableCell>
              <TableCell>
                <div className="flex">
                  <Input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => handleUpdate(index, "quantity", Number.parseFloat(e.target.value))}
                    min="1"
                    step="0.01"
                    className="-me-px rounded-r-none shadow-none focus-visible:z-10 w-24"
                  />
                  <ProductCombobox
                    value={product.unit_id.toString()}
                    onChange={(value: string) => handleUpdate(index, "unit_id", value)}
                    options={mockUnits.map((u: Unit) => ({ value: u.id.toString(), label: u.name }))}
                    placeholder="Select unit"
                    className="w-32 rounded-l-none shadow-none"
                  />
                </div>
              </TableCell>
              <TableCell>{product.unit_cost.toFixed(2)}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={product.unit_price}
                  onChange={(e) => handleUpdate(index, "unit_price", Number.parseFloat(e.target.value))}
                  className="w-24"
                  min="0"
                  step="0.01"
                />
              </TableCell>
              <TableCell>{product.subtotal.toFixed(2)}</TableCell>
              <TableCell>
                <Button type="button" variant="destructive" size="icon" onClick={() => handleDelete(index)}>
                  <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
