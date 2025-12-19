"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { ProductCombobox } from "@/components/products/product-combobox"
import { unitSchema, type UnitFormValues } from "@/lib/schemas/unit"
import type { Unit } from "@/lib/types/unit"
import { mockUnits } from "@/lib/mock-data/units"

interface UnitFormProps {
  unit?: Unit
  onSubmit: (data: UnitFormValues) => Promise<void>
  onCancel?: () => void
}

export function UnitForm({ unit, onSubmit, onCancel }: UnitFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      unit_code: unit?.unit_code || "",
      unit_name: unit?.unit_name || "",
      base_unit: unit?.base_unit || "",
      operator: unit?.operator || "",
      operation_value: unit?.operation_value || "",
    },
  })

  const handleSubmit = async (data: UnitFormValues) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  const baseUnits = mockUnits.filter((u) => !u.base_unit && u.id !== unit?.id)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <p className="text-sm text-muted-foreground italic">
          The field labels marked with * are required input fields.
        </p>

        <FormField
          control={form.control}
          name="unit_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter unit code" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unit_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter unit name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="base_unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Unit</FormLabel>
              <ProductCombobox
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "", label: "No Base Unit" },
                  ...baseUnits.map((u) => ({ value: u.id, label: u.unit_name })),
                ]}
                placeholder="Select base unit..."
                showClear
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="operator"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Operator</FormLabel>
              <ProductCombobox
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "", label: "Select an operator" },
                  { value: "*", label: "*" },
                  { value: "/", label: "/" },
                ]}
                placeholder="Select operator..."
                showClear
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="operation_value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Operation Value</FormLabel>
              <FormControl>
                <Input {...field} type="number" step="any" placeholder="Enter operation value" />
              </FormControl>
              <FormMessage />
            </FormItem>
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner data-icon="inline-start" />}
            {unit ? "Update" : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
