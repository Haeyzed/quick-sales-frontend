"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ProductCombobox } from "@/components/products/product-combobox"
import { ComboProductSelector } from "@/components/products/combo-product-selector"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete01Icon, PrinterIcon, PackageIcon } from "@hugeicons/core-free-icons"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { mockProducts } from "@/lib/mock-data/products"
import { mockWarehouses } from "@/lib/mock-data/warehouses"
import type { Product } from "@/lib/types/product"
import type { Brand } from "@/lib/types/brand"
import Image from "next/image"
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom"
import { cn } from "@/lib/utils"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty"

interface BarcodeProduct {
  id: string
  name: string
  code: string
  images?: string[]
  qty: number
  warehouse_id?: string
  price?: number
  brand?: Brand
}

export default function PrintBarcodePage() {
  const [products, setProducts] = useState<BarcodeProduct[]>([])
  const [showModal, setShowModal] = useState(false)
  const [printSettings, setPrintSettings] = useState({
    name: true,
    price: true,
    promo_price: false,
    business_name: true,
    brand_name: true,
    name_size: 15,
    price_size: 15,
    promo_price_size: 15,
    business_name_size: 15,
    brand_name_size: 15,
  })
  const [barcodeSettings, setBarcodeSettings] = useState("default")

  const handleAddProduct = (product: Product) => {
    const fullProduct = mockProducts.find((p) => p.id === product.id)
    if (!fullProduct) return

    setProducts([
      ...products,
      {
        id: fullProduct.id,
        name: fullProduct.name,
        code: fullProduct.code,
        images: fullProduct.images,
        qty: 1,
        price: fullProduct.price,
        brand: fullProduct.brand,
      },
    ])
  }

  const updateQuantity = (index: number, quantity: number) => {
    const updated = [...products]
    updated[index].qty = quantity
    setProducts(updated)
  }

  const updateWarehouse = (index: number, warehouseId: string) => {
    const updated = [...products]
    updated[index].warehouse_id = warehouseId
    setProducts(updated)
  }

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index))
  }

  const handlePrint = () => {
    setShowModal(true)
  }

  const handlePrintBarcode = () => {
    window.print()
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Print Barcode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground italic">
            The field labels marked with * are required input fields.
          </p>

          <div>
            <Label>Add Product *</Label>
            <ComboProductSelector onAddProduct={handleAddProduct} existingProductIds={products.map((p) => p.id)} />
          </div>

          {products.length === 0 ? (
            <Empty className="border rounded-lg py-12 bg-muted/20">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <HugeiconsIcon 
                    icon={PackageIcon} 
                    strokeWidth={2} 
                    className="size-8 text-muted-foreground" 
                  />
                </EmptyMedia>
                <EmptyTitle className="text-base">No products selected</EmptyTitle>
                <EmptyDescription>
                  Search for products in the input above to add them to your printing list.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Warehouse/Price</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product, index) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product.images?.[0] && (
                            <ImageZoom
                              zoomMargin={100}
                              backdropClassName={cn('[&_[data-rmiz-modal-overlay="visible"]]:bg-black/80')}
                            >
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                width={40}
                                height={40}
                                className="rounded object-cover"
                                unoptimized
                              />
                            </ImageZoom>
                          )}
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-muted-foreground">[{product.code}]</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={product.qty}
                          onChange={(e) => updateQuantity(index, Number.parseInt(e.target.value) || 0)}
                          className="w-24"
                          min="1"
                        />
                      </TableCell>
                      <TableCell>
                        <ProductCombobox
                          value={product.warehouse_id || ""}
                          onChange={(value: string) => updateWarehouse(index, value)}
                          options={mockWarehouses.map((w) => ({ value: w.id, label: w.name }))}
                          placeholder="Choose Warehouse"
                        />
                      </TableCell>
                      <TableCell>
                        <Button type="button" variant="destructive" size="icon" onClick={() => removeProduct(index)}>
                          <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}


          {/* Print Settings */}
          <div className="space-y-4 border-t pt-6">
            <Label className="text-base font-semibold">Information on Label *</Label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="print-name"
                    checked={printSettings.name}
                    onCheckedChange={(checked) => setPrintSettings({ ...printSettings, name: checked as boolean })}
                  />
                  <Label htmlFor="print-name" className="font-medium">
                    Product Name
                  </Label>
                </div>
                <div className="flex items-center gap-2 ml-6">
                  <span className="text-sm">Size:</span>
                  <Input
                    type="number"
                    value={printSettings.name_size}
                    onChange={(e) => setPrintSettings({ ...printSettings, name_size: Number.parseInt(e.target.value) })}
                    className="w-20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="print-price"
                    checked={printSettings.price}
                    onCheckedChange={(checked) => setPrintSettings({ ...printSettings, price: checked as boolean })}
                  />
                  <Label htmlFor="print-price" className="font-medium">
                    Price
                  </Label>
                </div>
                <div className="flex items-center gap-2 ml-6">
                  <span className="text-sm">Size:</span>
                  <Input
                    type="number"
                    value={printSettings.price_size}
                    onChange={(e) =>
                      setPrintSettings({ ...printSettings, price_size: Number.parseInt(e.target.value) })
                    }
                    className="w-20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="print-promo"
                    checked={printSettings.promo_price}
                    onCheckedChange={(checked) =>
                      setPrintSettings({ ...printSettings, promo_price: checked as boolean })
                    }
                  />
                  <Label htmlFor="print-promo" className="font-medium">
                    Promotional Price
                  </Label>
                </div>
                <div className="flex items-center gap-2 ml-6">
                  <span className="text-sm">Size:</span>
                  <Input
                    type="number"
                    value={printSettings.promo_price_size}
                    onChange={(e) =>
                      setPrintSettings({ ...printSettings, promo_price_size: Number.parseInt(e.target.value) })
                    }
                    className="w-20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="print-business"
                    checked={printSettings.business_name}
                    onCheckedChange={(checked) =>
                      setPrintSettings({ ...printSettings, business_name: checked as boolean })
                    }
                  />
                  <Label htmlFor="print-business" className="font-medium">
                    Business Name
                  </Label>
                </div>
                <div className="flex items-center gap-2 ml-6">
                  <span className="text-sm">Size:</span>
                  <Input
                    type="number"
                    value={printSettings.business_name_size}
                    onChange={(e) =>
                      setPrintSettings({ ...printSettings, business_name_size: Number.parseInt(e.target.value) })
                    }
                    className="w-20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="print-brand"
                    checked={printSettings.brand_name}
                    onCheckedChange={(checked) =>
                      setPrintSettings({ ...printSettings, brand_name: checked as boolean })
                    }
                  />
                  <Label htmlFor="print-brand" className="font-medium">
                    Brand
                  </Label>
                </div>
                <div className="flex items-center gap-2 ml-6">
                  <span className="text-sm">Size:</span>
                  <Input
                    type="number"
                    value={printSettings.brand_name_size}
                    onChange={(e) =>
                      setPrintSettings({ ...printSettings, brand_name_size: Number.parseInt(e.target.value) })
                    }
                    className="w-20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Paper Size */}
          <div className="border-t pt-6">
            <div className="max-w-md space-y-2">
              <Label className="font-semibold">Paper Size *</Label>
              <ProductCombobox
                value={barcodeSettings}
                onChange={setBarcodeSettings}
                options={[
                  { value: "default", label: "Default (40mm x 30mm)" },
                  { value: "36mm", label: "36 mm (1.4 inch)" },
                  { value: "24mm", label: "24 mm (0.94 inch)" },
                  { value: "18mm", label: "18 mm (0.7 inch)" },
                ]}
                placeholder="Select paper size..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 border-t pt-6">
            <Button onClick={handlePrint} size="lg" disabled={products.length === 0}>
              <HugeiconsIcon icon={PrinterIcon} strokeWidth={2} className="mr-2 h-4 w-4" />
              Preview & Print
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Print Preview Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Barcode Preview</DialogTitle>
              <Button onClick={handlePrintBarcode} variant="outline" size="sm">
                <HugeiconsIcon icon={PrinterIcon} strokeWidth={2} className="mr-2 h-4 w-4" />
                Print
              </Button>
            </div>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 max-h-[500px] overflow-y-auto p-4">
            {products.flatMap((product) =>
              Array.from({ length: product.qty }, (_, i) => (
                <div
                  key={`${product.id}-${i}`}
                  className="border rounded p-4 text-center flex flex-col items-center justify-center gap-2"
                >
                  {product.images && product.images.length > 0 && (
                    <div className="relative w-20 h-20 mb-2">
                      <ImageZoom
                        zoomMargin={100}
                        backdropClassName={cn('[&_[data-rmiz-modal-overlay="visible"]]:bg-black/80')}
                      >
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="rounded object-cover"
                          sizes="48px"
                          unoptimized
                        />
                      </ImageZoom>
                    </div>
                  )}
                  {printSettings.name && (
                    <div className="font-medium text-sm" style={{ fontSize: `${printSettings.name_size}px` }}>
                      {product.name}
                    </div>
                  )}
                  <div className="h-12 bg-stripes w-full flex items-center justify-center text-xs font-mono">
                    BARCODE
                  </div>
                  <div className="font-mono text-xs">{product.code}</div>
                  {printSettings.price && product.price && (
                    <div className="text-sm font-semibold" style={{ fontSize: `${printSettings.price_size}px` }}>
                      ${product.price.toFixed(2)}
                    </div>
                  )}
                  {printSettings.brand_name && product.brand?.name && (
                    <div
                      className="text-xs text-muted-foreground"
                      style={{ fontSize: `${printSettings.brand_name_size}px` }}
                    >
                      {product.brand?.name}
                    </div>
                  )}
                  {printSettings.business_name && (
                    <div
                      className="text-xs text-muted-foreground"
                      style={{ fontSize: `${printSettings.business_name_size}px` }}
                    >
                      My Business
                    </div>
                  )}
                </div>
              )),
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
