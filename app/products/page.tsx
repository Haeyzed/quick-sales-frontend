"use client"

import { useState } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon, Download01Icon, FilterIcon, Delete02Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ProductDataTable } from "@/components/products/product-data-table"
import { ProductDetailsDialog } from "@/components/products/product-details-dialog"
import {
  mockProducts,
} from "@/lib/mock-data/products"
import { mockBrands } from "@/lib/mock-data/brands"
import { mockCategories } from "@/lib/mock-data/categories"
import { mockUnits } from "@/lib/mock-data/units"
import { mockTaxes } from "@/lib/mock-data/taxes"
import { mockWarehouses } from "@/lib/mock-data/warehouses"
import type { Product } from "@/lib/types/product"
import { Card, CardContent } from "@/components/ui/card"
import { ProductCombobox } from "@/components/products/product-combobox"
import { useRouter } from "next/navigation"

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | undefined>()
  const [filters, setFilters] = useState({
    warehouse: "",
    type: "",
    brand: "",
    category: "",
    unit: "",
    tax: "",
    imeiOrVariant: "",
    stock: "",
  })

  const handleView = (product: Product) => {
    setSelectedProduct(product)
    setShowDetailsDialog(true)
  }

  const handleEdit = (product: Product) => {
    router.push(`/products/${product.id}/edit`)
  }

  const handleDelete = () => {
    if (!productToDelete) return
    setProducts(products.filter((p) => p.id !== productToDelete.id))
    setProductToDelete(undefined)
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="flex gap-2">
          <Button>
            <Link href="/products/create">
              <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
          <Button variant="secondary">
            <HugeiconsIcon icon={Download01Icon} strokeWidth={2} className="mr-2 h-4 w-4" />
            Import Product
          </Button>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <HugeiconsIcon icon={FilterIcon} strokeWidth={2} className="mr-2 h-4 w-4" />
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
                    ...mockWarehouses.map((w) => ({ value: w.id, label: w.name })),
                  ]}
                  placeholder="Select warehouse..."
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Product Type</label>
                <ProductCombobox
                  value={filters.type}
                  onChange={(value) => setFilters({ ...filters, type: value })}
                  options={[
                    { value: "standard", label: "Standard" },
                    { value: "combo", label: "Combo" },
                    { value: "digital", label: "Digital" },
                    { value: "service", label: "Service" },
                  ]}
                  placeholder="Select type..."
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Brand</label>
                <ProductCombobox
                  value={filters.brand}
                  onChange={(value) => setFilters({ ...filters, brand: value })}
                  options={[
                    ...mockBrands.map((b) => ({ value: b.id, label: b.name })),
                  ]}
                  placeholder="Select brand..."
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <ProductCombobox
                  value={filters.category}
                  onChange={(value) => setFilters({ ...filters, category: value })}
                  options={[
                    ...mockCategories.map((c) => ({ value: c.id, label: c.name })),
                  ]}
                  placeholder="Select category..."
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Unit</label>
                <ProductCombobox
                  value={filters.unit}
                  onChange={(value) => setFilters({ ...filters, unit: value })}
                  options={[
                    ...mockUnits.map((u) => ({ value: u.id, label: u.name })),
                  ]}
                  placeholder="Select unit..."
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tax</label>
                <ProductCombobox
                  value={filters.tax}
                  onChange={(value) => setFilters({ ...filters, tax: value })}
                  options={[
                    ...mockTaxes.map((t) => ({ value: t.id, label: t.name })),
                  ]}
                  placeholder="Select tax..." 
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Product with</label>
                <ProductCombobox
                  value={filters.imeiOrVariant}
                  onChange={(value) => setFilters({ ...filters, imeiOrVariant: value })}
                  options={[
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

      <ProductDataTable
        data={products}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={(product) => setProductToDelete(product)}
      />

      <ProductDetailsDialog product={selectedProduct} open={showDetailsDialog} onOpenChange={setShowDetailsDialog} />

      <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(undefined)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this product. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="ghost">Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
