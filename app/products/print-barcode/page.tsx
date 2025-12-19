"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ProductCombobox } from "@/components/products/product-combobox"
import { HugeiconsIcon } from "@hugeicons/react"
import { BarCode01Icon, Delete01Icon, PrinterIcon } from "@hugeicons/core-free-icons"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { mockProducts } from "@/lib/mock-data/products"
import { mockWarehouses } from "@/lib/mock-data/warehouses"

interface BarcodeProduct {
  id: string
  name: string
  code: string
  quantity: number
  warehouse_id?: string
  price?: number
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

  const addProduct = (productCode: string) => {
    const product = mockProducts.find((p) => p.code === productCode)
    if (!product) return

    const exists = products.find((p) => p.code === product.code)
    if (exists) {
      alert("Duplicate input is not allowed!")
      return
    }

    setProducts([
      ...products,
      {
        id: product.id,
        name: product.name,
        code: product.code,
        quantity: 1,
      },
    ])
  }

  const updateQuantity = (index: number, quantity: number) => {
    const updated = [...products]
    updated[index].quantity = quantity
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

          {/* Add Product Section */}
          <div>
            <Label>Add Product *</Label>
            <div className="flex gap-2 mt-2">
              <Button type="button" variant="outline" size="icon">
                <HugeiconsIcon icon={BarCode01Icon} strokeWidth={2} className="h-4 w-4" />
              </Button>
              <Input placeholder="Please type product code and select" className="flex-1" />
            </div>
          </div>

          {/* Products Table */}
          <div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Warehouse/Price</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                        No products added yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell className="font-mono text-sm">{product.code}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={product.quantity}
                            onChange={(e) => updateQuantity(index, Number.parseInt(e.target.value))}
                            className="w-24"
                            min="1"
                          />
                        </TableCell>
                        <TableCell>
                          <ProductCombobox
                            value={product.warehouse_id || ""}
                            onChange={(value) => {
                              const updated = [...products]
                              updated[index].warehouse_id = value
                              setProducts(updated)
                            }}
                            options={mockWarehouses.map((w) => ({ value: w.id, label: w.name }))}
                            placeholder="Choose Warehouse"
                            searchable
                          />
                        </TableCell>
                        <TableCell>
                          <Button type="button" variant="destructive" size="icon" onClick={() => removeProduct(index)}>
                            <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

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
              Array.from({ length: product.quantity }, (_, i) => (
                <div
                  key={`${product.id}-${i}`}
                  className="border rounded p-4 text-center flex flex-col items-center justify-center gap-2"
                >
                  {printSettings.name && (
                    <div className="font-medium text-sm" style={{ fontSize: `${printSettings.name_size}px` }}>
                      {product.name}
                    </div>
                  )}
                  <div className="h-12 bg-stripes w-full flex items-center justify-center text-xs font-mono">
                    BARCODE
                  </div>
                  <div className="font-mono text-xs">{product.code}</div>
                  {printSettings.price && <div className="text-sm font-semibold">$780.00</div>}
                  {printSettings.brand_name && <div className="text-xs text-muted-foreground">Samsung</div>}
                </div>
              )),
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
