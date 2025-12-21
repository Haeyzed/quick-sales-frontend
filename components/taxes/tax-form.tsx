"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { taxSchema, type TaxFormValues } from "@/lib/schemas/tax"
import type { Tax } from "@/lib/types/tax"

interface TaxFormProps {
  tax?: Tax
  onSubmit: (data: TaxFormValues) => Promise<void>
  onCancel?: () => void
}

export function TaxForm({ tax, onSubmit, onCancel }: TaxFormProps) {

  const form = useForm<TaxFormValues>({
    resolver: zodResolver(taxSchema),
    defaultValues: {
      name: tax?.name || "",
      rate: tax?.rate || 0,
    },
  })

  const handleSubmit = async (data: TaxFormValues) => {
    await onSubmit(data)
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <p className="text-sm text-muted-foreground italic">The field labels marked with * are required input fields.</p>

      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field data-invalid={!!fieldState.error}>
            <FieldLabel htmlFor="name">Tax Name *</FieldLabel>
            <Input id="name" {...field} placeholder="Enter tax name" />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="rate"
        render={({ field, fieldState }) => (
          <Field data-invalid={!!fieldState.error}>
            <FieldLabel htmlFor="rate">Rate (%) *</FieldLabel>
            <Input
              id="rate"
              {...field}
              type="number"
              step="any"
              placeholder="Enter tax rate"
              onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Spinner data-icon="inline-start" />}
          {tax ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  )
}
