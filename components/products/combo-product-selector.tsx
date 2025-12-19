"use client"

import { useState } from "react"
import Image from "next/image"
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { BarCode01Icon } from "@hugeicons/core-free-icons"
import { mockProducts } from "@/lib/mock-data/products"
import type { Product } from "@/lib/types/product"

interface ComboProductSelectorProps {
  onAddProduct: (product: Product) => void
  existingProductIds: string[]
}

export function ComboProductSelector({ onAddProduct, existingProductIds }: ComboProductSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const results = mockProducts
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.code.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 5)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const handleSelect = (product: Product) => {
    onAddProduct(product)
    // setSearchQuery("")
    // setSearchResults([])
  }

  return (
    <div className="relative mt-2">
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="icon">
          <HugeiconsIcon icon={BarCode01Icon} strokeWidth={2} className="h-4 w-4" />
        </Button>
        <div className="relative flex-1">
          <Input
            placeholder="Please type product code and select"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1"
          />
          {searchResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover p-2 shadow-md">
              <div className="space-y-1">
                {searchResults.map((product) => {
                  const isDisabled = existingProductIds.includes(product.id)
                  return (
                    <Button
                      key={product.id}
                      type="button"
                      variant="ghost"
                      className={cn(
                        "w-full justify-start h-auto p-2",
                        isDisabled && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => !isDisabled && handleSelect(product)}
                      disabled={isDisabled}
                    >
                      <div className="flex items-center gap-2 w-full">
                        {product.images?.[0] && (
                          <ImageZoom
                            zoomMargin={100}
                            backdropClassName={cn('[&_[data-rmiz-modal-overlay="visible"]]:bg-black/80')}
                          >
                            <Image
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.name}
                              width={32}
                              height={32}
                              className="rounded object-cover"
                            />
                          </ImageZoom>
                        )}
                        <div className="text-left flex-1">
                          <div className="font-medium text-sm">{product.name}</div>
                          <div className="text-xs text-muted-foreground">{product.code}</div>
                        </div>
                        {isDisabled && (
                          <span className="text-xs text-muted-foreground">(Already selected)</span>
                        )}
                      </div>
                    </Button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

