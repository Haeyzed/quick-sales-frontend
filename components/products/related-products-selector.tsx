"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldLabel } from "@/components/ui/field"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { HugeiconsIcon } from "@hugeicons/react"
import { ViewIcon } from "@hugeicons/core-free-icons"
import { mockProducts } from "@/lib/mock-data/products"

interface RelatedProduct {
  id: string
  name: string
  code: string
  image?: string
}

interface RelatedProductsSelectorProps {
  value: string[]
  onChange: (value: string[]) => void
}

export function RelatedProductsSelector({ value, onChange }: RelatedProductsSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<RelatedProduct[]>([])

  const selectedProducts = mockProducts.filter((p) => value.includes(p.id))

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const results = mockProducts
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) || p.code.toLowerCase().includes(query.toLowerCase()),
        )
        .filter((p) => !value.includes(p.id))
        .slice(0, 5)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const handleAdd = (productId: string) => {
    onChange([...value, productId])
    // Keep the dropdown open for more selections
  }

  const handleRemove = (productId: string) => {
    onChange(value.filter((id) => id !== productId))
  }

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Related Products</FieldLabel>
        <div className="relative">
          <Input
            placeholder="Search products by name or code..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="mt-2"
          />
          {searchResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover p-2 shadow-md">
              <div className="space-y-1">
                {searchResults.map((product) => (
                  <Button
                    key={product.id}
                    variant="ghost"
                    className="w-full justify-start h-auto p-2"
                    onClick={() => handleAdd(product.id)}
                  >
                    <div className="flex items-center gap-2">
                      {product.images?.[0] && (
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          width={32}
                          height={32}
                          className="rounded object-cover"
                        />
                      )}
                      <div className="text-left">
                        <div className="font-medium text-sm">{product.name}</div>
                        <div className="text-xs text-muted-foreground">{product.code}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedProducts.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3">Selected Items</h4>
          <div className="space-y-2">
            {selectedProducts.map((product) => (
              <Item key={product.id} variant="outline">
                <ItemMedia variant="image">
                  <Image
                    src={product.images?.[0] || "/placeholder.svg?height=40&width=40"}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{product.name}</ItemTitle>
                  <ItemDescription>{product.code}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button variant="ghost" size="icon-sm">
                    <HugeiconsIcon icon={ViewIcon} strokeWidth={2} className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleRemove(product.id)}>
                    Remove
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
