"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, FileDown, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductDataTable } from "@/components/products/product-data-table"
import { ProductDetailsDialog } from "@/components/products/product-details-dialog"
import {
  mockProducts,
  mockBrands,
  mockCategories,
  mockUnits,
  mockTaxes,
  mockWarehouses,
} from "@/lib/mock-data/products"
import type { Product } from "@/lib/types/product"
import { Card, CardContent } from "@/components/ui/card"
import { ProductCombobox } from "@/components/products/product-combobox"

export default function ProductsPage() {
  const [products] = useState<Product[]>(mockProducts)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [filters, setFilters] = useState({
    warehouse: "0",
    type: "all",
    brand: "0",
    category: "0",
    unit: "0",
    tax: "0",
    imeiOrVariant: "0",
    stock: "all",
  })

  const handleView = (product: Product) => {
    setSelectedProduct(product)
    setShowDetailsDialog(true)
  }

  const handleEdit = (product: Product) => {
    console.log("Edit product:", product)
  }

  const handleDelete = (product: Product) => {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      console.log("Delete product:", product)
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/products/create">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
          <Button variant="secondary">
            <FileDown className="mr-2 h-4 w-4" />
            Import Product
          </Button>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="mr-2 h-4 w-4" />
            Filter Products
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Warehouse</label>
                <ProductCombobox
                  value={filters.warehouse}
                  onChange={(value) => setFilters({ ...filters, warehouse: value })}
                  options={[
                    { value: "0", label: "All Warehouse" },
                    ...mockWarehouses.map((w) => ({ value: w.id, label: w.name })),
                  ]}
                  placeholder="Select warehouse..."
                  searchable
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Product Type</label>
                <ProductCombobox
                  value={filters.type}
                  onChange={(value) => setFilters({ ...filters, type: value })}
                  options={[
                    { value: "all", label: "All Types" },
                    { value: "standard", label: "Standard" },
                    { value: "combo", label: "Combo" },
                    { value: "digital", label: "Digital" },
                    { value: "service", label: "Service" },
                  ]}
                  placeholder="Select type..."
                  searchable
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Brand</label>
                <ProductCombobox
                  value={filters.brand}
                  onChange={(value) => setFilters({ ...filters, brand: value })}
                  options={[
                    { value: "0", label: "All Brands" },
                    ...mockBrands.map((b) => ({ value: b.id, label: b.title })),
                  ]}
                  placeholder="Select brand..."
                  searchable
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <ProductCombobox
                  value={filters.category}
                  onChange={(value) => setFilters({ ...filters, category: value })}
                  options={[
                    { value: "0", label: "All Categories" },
                    ...mockCategories.map((c) => ({ value: c.id, label: c.name })),
                  ]}
                  placeholder="Select category..."
                  searchable
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Unit</label>
                <ProductCombobox
                  value={filters.unit}
                  onChange={(value) => setFilters({ ...filters, unit: value })}
                  options={[
                    { value: "0", label: "All Unit" },
                    ...mockUnits.map((u) => ({ value: u.id, label: u.unit_name })),
                  ]}
                  placeholder="Select unit..."
                  searchable
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tax</label>
                <ProductCombobox
                  value={filters.tax}
                  onChange={(value) => setFilters({ ...filters, tax: value })}
                  options={[
                    { value: "0", label: "All Tax" },
                    ...mockTaxes.map((t) => ({ value: t.id, label: t.name })),
                  ]}
                  placeholder="Select tax..."
                  searchable
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Product with</label>
                <ProductCombobox
                  value={filters.imeiOrVariant}
                  onChange={(value) => setFilters({ ...filters, imeiOrVariant: value })}
                  options={[
                    { value: "0", label: "Select IMEI/Variant" },
                    { value: "imei", label: "IMEI" },
                    { value: "variant", label: "Variant" },
                  ]}
                  placeholder="Select..."
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Stock</label>
                <ProductCombobox
                  value={filters.stock}
                  onChange={(value) => setFilters({ ...filters, stock: value })}
                  options={[
                    { value: "all", label: "All" },
                    { value: "with", label: "With Stock" },
                    { value: "without", label: "Without Stock" },
                  ]}
                  placeholder="Select..."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <ProductDataTable data={products} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />

      <ProductDetailsDialog product={selectedProduct} open={showDetailsDialog} onOpenChange={setShowDetailsDialog} />
    </div>
  )
}
