"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { 
  InputGroup, 
  InputGroupAddon, 
  InputGroupInput 
} from "@/components/ui/input-group"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { mockProducts } from "@/lib/mock-data/products"
import type { Product } from "@/lib/types/product"

interface RelatedProductsSelectorProps {
  value: string[]
  onChange: (value: string[]) => void
}

export function RelatedProductsSelector({ value = [], onChange }: RelatedProductsSelectorProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [searchResults, setSearchResults] = React.useState<Product[]>([])
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const selectedProducts = mockProducts.filter((p) => value.includes(p.id))

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const results = mockProducts.filter(p => 
        (p.name.toLowerCase().includes(query.toLowerCase()) || p.code.toLowerCase().includes(query.toLowerCase())) &&
        !value.includes(p.id)
      ).slice(0, 5)
      setSearchResults(results)
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }

  return (
    <div className="space-y-4" ref={containerRef}>
      <div className="relative">
        <InputGroup>
          <InputGroupAddon>
            <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="size-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search related products..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </InputGroup>

        {isOpen && searchResults.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-popover border rounded-lg shadow-lg overflow-hidden p-1">
            {searchResults.map((product) => (
              <button
                key={product.id}
                type="button"
                className="flex items-center gap-3 w-full p-2 hover:bg-accent rounded-md text-left transition-colors"
                onClick={() => {
                  onChange([...value, product.id])
                  setSearchQuery("")
                  setIsOpen(false)
                }}
              >
                <div className="size-8 relative rounded border overflow-hidden flex-shrink-0">
                  <Image src={product.images?.[0] || "/placeholder.svg"} alt="" fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1 text-sm font-medium truncate">{product.name}</div>
                <div className="text-xs text-muted-foreground font-mono">{product.code}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-2">
        {selectedProducts.map((product) => (
          <Item key={product.id} variant="outline" className="group">
            <ItemMedia>
              <Image src={product.images?.[0] || "/placeholder.svg"} alt="" width={40} height={40} className="rounded object-cover" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="text-sm">{product.name}</ItemTitle>
              <ItemDescription className="text-xs">{product.code}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button 
                variant="ghost" 
                size="icon-xs" 
                className="text-destructive"
                onClick={() => onChange(value.filter(id => id !== product.id))}
              >
                <HugeiconsIcon icon={Delete01Icon} className="size-4" />
              </Button>
            </ItemActions>
          </Item>
        ))}
      </div>
    </div>
  )
}