"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { BarCode01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { 
  InputGroup, 
  InputGroupAddon, 
  InputGroupInput 
} from "@/components/ui/input-group"
import { mockProducts } from "@/lib/mock-data/products"
import type { Product } from "@/lib/types/product"

interface ComboProductSelectorProps {
  onAddProduct: (product: Product) => void
  existingProductIds: string[]
  placeholder?: string
}

export function ComboProductSelector({ 
  onAddProduct, 
  existingProductIds, 
  placeholder = "Search by name or code..." 
}: ComboProductSelectorProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [searchResults, setSearchResults] = React.useState<Product[]>([])
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const results = mockProducts
        .filter((p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.code.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 6)
      setSearchResults(results)
      setIsOpen(true)
    } else {
      setSearchResults([])
      setIsOpen(false)
    }
  }

  const handleSelect = (product: Product) => {
    onAddProduct(product)
    setSearchQuery("")
    setIsOpen(false)
  }

  return (
    <div className="relative mt-2 w-full" ref={containerRef}>
      <InputGroup>
        <InputGroupAddon>
          <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="text-muted-foreground size-4" />
        </InputGroupAddon>
        <InputGroupInput
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchQuery.trim() && setIsOpen(true)}
          className="h-11"
        />
        <InputGroupAddon align="inline-end">
          <HugeiconsIcon icon={BarCode01Icon} strokeWidth={2} className="text-muted-foreground size-4" />
        </InputGroupAddon>
      </InputGroup>

      {isOpen && searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-popover border rounded-xl shadow-xl max-h-[300px] overflow-y-auto p-1 animate-in fade-in zoom-in-95">
          {searchResults.map((product) => {
            const isAdded = existingProductIds.includes(product.id)
            return (
              <button
                key={product.id}
                type="button"
                disabled={isAdded}
                onClick={() => handleSelect(product)}
                className={cn(
                  "flex items-center gap-3 w-full p-2 rounded-lg text-left transition-colors",
                  isAdded ? "opacity-50 cursor-not-allowed bg-muted/30" : "hover:bg-accent"
                )}
              >
                <div className="size-9 rounded border overflow-hidden relative flex-shrink-0">
                  <Image src={product.images?.[0] || "/placeholder.svg"} alt="" fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{product.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{product.code}</div>
                </div>
                {isAdded && <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">Added</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}