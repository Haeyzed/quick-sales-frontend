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
  return (
    <Combobox
      items={options}
      value={value}
      onValueChange={(value) => onChange(value || "")}
    >
      <ComboboxInput
        placeholder={placeholder}
        showClear={showClear}
        className={className}
      />

      <ComboboxContent>
        <ComboboxEmpty>No option found.</ComboboxEmpty>

        <ComboboxList>
          {options.map((item) => (
            <ComboboxItem key={item.value} value={item.value}>
              {item.label}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
