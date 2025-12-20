"use client"

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
  className?: string
  showClear?: boolean
}

export function ProductCombobox({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  className,
  showClear = true,
}: ProductComboboxProps) {
  const selectedOption = options.find((option) => option.value === value) || null

  return (
    <Combobox
      items={options}
      value={selectedOption}
      onValueChange={(option) => onChange(option?.value || "")}
      itemToStringValue={(option: ComboboxOption | null) => option?.label || ""}
    >
      <ComboboxInput placeholder={placeholder} showClear={showClear} className={className} />

      <ComboboxContent>
        <ComboboxEmpty>No option found.</ComboboxEmpty>

        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
