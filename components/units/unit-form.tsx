"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { ProductCombobox } from "@/components/products/product-combobox"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { unitSchema, type UnitFormValues } from "@/lib/schemas/unit"
import type { Unit } from "@/lib/types/unit"
import { mockUnits } from "@/lib/mock-data/units"

interface UnitFormProps {
  unit?: Unit
  onSubmit: (data: UnitFormValues) => Promise<void>
  onCancel?: () => void
}

export function UnitForm({ unit, onSubmit, onCancel }: UnitFormProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      code: unit?.code || "",
      name: unit?.name || "",
      base_unit: unit?.base_unit || "",
      operator: unit?.operator || null,
      operation_value: unit?.operation_value || null,
    },
  })

  const handleSubmit = async (data: UnitFormValues) => {
    setIsLoading(true)
    try {
      await onSubmit(data)
    } finally {
      setIsLoading(false)
    }
  }

  const baseUnits = mockUnits.filter((u) => !u.base_unit && u.id !== unit?.id)

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <p className="text-sm text-muted-foreground italic">The field labels marked with * are required input fields.</p>

      <Controller
        control={form.control}
        name="code"
        render={({ field, fieldState }) => (
          <Field data-invalid={!!fieldState.error}>
            <FieldLabel htmlFor="code">Code *</FieldLabel>
            <Input id="code" {...field} placeholder="Enter unit code" />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field data-invalid={!!fieldState.error}>
            <FieldLabel htmlFor="name">Name *</FieldLabel>
            <Input id="name" {...field} placeholder="Enter unit name" />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="base_unit"
        render={({ field, fieldState }) => (
          <Field data-invalid={!!fieldState.error}>
            <FieldLabel htmlFor="base_unit">Base Unit</FieldLabel>
            <ProductCombobox
              value={field.value ?? ""}
              onChange={field.onChange}
              options={[...baseUnits.map((u) => ({ value: u.id, label: u.name }))]}
              placeholder="Select base unit..."
              showClear
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="operator"
        render={({ field, fieldState }) => (
          <Field data-invalid={!!fieldState.error}>
            <FieldLabel htmlFor="operator">Operator</FieldLabel>
            <ProductCombobox
              value={field.value ?? ""}
              onChange={field.onChange}
              options={[
                { value: "*", label: "*" },
                { value: "/", label: "/" },
              ]}
              placeholder="Select operator..."
              showClear
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="operation_value"
        render={({ field, fieldState }) => (
          <Field data-invalid={!!fieldState.error}>
            <FieldLabel htmlFor="operation_value">Operation Value</FieldLabel>
            <Input
              id="operation_value"
              {...field}
              type="number"
              step="any"
              placeholder="Enter operation value"
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : null)}
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
        <strong>Example conversions:</strong>
        <br />1 Dozen = 1<strong>*</strong>12 Piece
        <br />1 Gram = 1<strong>/</strong>1000 KG
      </div>

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Spinner data-icon="inline-start" />}
          {unit ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  )
}
