"use client"
import { useState } from "react"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

interface ComboboxOption {
  value: string
  label: string
  image?: string
}

interface ProductComboboxProps {
  options: ComboboxOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  searchable?: boolean
  className?: string
  showClear?: boolean
  keepOpenOnSelect?: boolean
}

export function ProductCombobox({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  searchable = false,
  className,
  showClear = true,
  keepOpenOnSelect = false,
}: ProductComboboxProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredOptions = searchable
    ? options.filter((option) => option.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : options

  return (
    <Combobox
      items={filteredOptions}
      value={value}
      onValueChange={onChange}
      keepOpenOnSelect={keepOpenOnSelect}
      onInputValueChange={searchable ? setSearchQuery : undefined}
    >
      <ComboboxInput placeholder={placeholder} showClear={showClear} className={className} />
      <ComboboxContent>
        <ComboboxEmpty>No option found.</ComboboxEmpty>
        <ComboboxList>
          {filteredOptions.map((item) => (
            <ComboboxItem key={item.value} value={item.value}>
              {item.label}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
