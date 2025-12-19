"use client"
import Image from "next/image"
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/types/product"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { PrinterIcon } from "@hugeicons/core-free-icons"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

interface ProductDetailsDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductDetailsDialog({ product, open, onOpenChange }: ProductDetailsDialogProps) {
  if (!product) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Product Details</DialogTitle>
            <Button onClick={handlePrint} variant="outline" size="sm">
              <HugeiconsIcon icon={PrinterIcon} strokeWidth={2} className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </DialogHeader>
        <div className="style-nova:-mx-4 style-nova:px-4 no-scrollbar style-vega:px-6 style-mira:px-4 style-maia:px-6 style-vega:-mx-6 style-maia:-mx-6 style-mira:-mx-4 style-lyra:-mx-4 style-lyra:px-4 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {product.images && product.images.length > 0 ? (
              <Carousel className="w-full" opts={{ loop: true }}>
                <CarouselContent>
                  {product.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <ImageZoom
                        zoomMargin={100}
                        backdropClassName={cn('[&_[data-rmiz-modal-overlay="visible"]]:bg-black/80')}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${product.name} - Image ${index + 1}`}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </ImageZoom>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {product.images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </>
                )}
              </Carousel>
            ) : (
              <div className="aspect-square rounded-lg border bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No image available</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
              <div className="flex gap-2">
                <Badge>{product.type}</Badge>
                {product.featured && <Badge variant="secondary">Featured</Badge>}
                {product.promotion && <Badge variant="destructive">On Sale</Badge>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Code:</span>
                <p className="font-mono">{product.code}</p>
              </div>
              <div>
                <span className="font-medium">Brand:</span>
                <p>{product.brand_name || "-"}</p>
              </div>
              <div>
                <span className="font-medium">Category:</span>
                <p>{product.category_name}</p>
              </div>
              <div>
                <span className="font-medium">Unit:</span>
                <p>{product.unit_name}</p>
              </div>
              <div>
                <span className="font-medium">Quantity:</span>
                <p
                  className={
                    product.alert_quantity && product.qty <= product.alert_quantity
                      ? "text-destructive font-semibold"
                      : ""
                  }
                >
                  {product.qty}
                </p>
              </div>
              <div>
                <span className="font-medium">Alert Qty:</span>
                <p>{product.alert_quantity || "-"}</p>
              </div>
              <div>
                <span className="font-medium">Cost:</span>
                <p className="font-semibold">${product.cost.toFixed(2)}</p>
              </div>
              <div>
                <span className="font-medium">Price:</span>
                <p className="font-semibold text-primary">${product.price.toFixed(2)}</p>
              </div>
              {product.promotion_price && (
                <div className="col-span-2">
                  <span className="font-medium">Promotion Price:</span>
                  <p className="font-semibold text-destructive">${product.promotion_price.toFixed(2)}</p>
                </div>
              )}
              {product.tax_name && (
                <div>
                  <span className="font-medium">Tax:</span>
                  <p>{product.tax_name}</p>
                </div>
              )}
              <div>
                <span className="font-medium">Tax Method:</span>
                <p className="capitalize">{product.tax_method}</p>
              </div>
            </div>

            {product.product_details && (
              <div>
                <span className="font-medium">Product Details:</span>
                <p className="text-sm text-muted-foreground mt-1">{product.product_details}</p>
              </div>
            )}
          </div>
        </div>

        {/* Warehouse Stock */}
        {product.warehouse_stocks && product.warehouse_stocks.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Warehouse Quantity</h4>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Quantity</TableHead>
                    {product.warehouse_stocks[0].price && <TableHead>Price</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.warehouse_stocks.map((stock) => (
                    <TableRow key={stock.warehouse_id}>
                      <TableCell>{stock.warehouse_name}</TableCell>
                      <TableCell>{stock.quantity}</TableCell>
                      {stock.price && <TableCell>${stock.price.toFixed(2)}</TableCell>}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Product Variants */}
        {product.variants && product.variants.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Product Variants</h4>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Variant Name</TableHead>
                    <TableHead>Item Code</TableHead>
                    <TableHead>Additional Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.variants.map((variant) => (
                    <TableRow key={variant.id}>
                      <TableCell>{variant.name}</TableCell>
                      <TableCell className="font-mono text-sm">{variant.item_code}</TableCell>
                      <TableCell>${variant.additional_price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Combo Products */}
        {product.combo_products && product.combo_products.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Combo Products</h4>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.combo_products.map((combo, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {combo.product_name} [{combo.product_code}]
                      </TableCell>
                      <TableCell>{combo.quantity}</TableCell>
                      <TableCell>${combo.unit_cost.toFixed(2)}</TableCell>
                      <TableCell>${combo.unit_price.toFixed(2)}</TableCell>
                      <TableCell>${combo.subtotal.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
