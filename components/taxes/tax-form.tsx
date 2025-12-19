"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { taxSchema, type TaxFormValues } from "@/lib/schemas/tax"
import type { Tax } from "@/lib/types/tax"

interface TaxFormProps {
  tax?: Tax
  onSubmit: (data: TaxFormValues) => Promise<void>
  onCancel?: () => void
}

export function TaxForm({ tax, onSubmit, onCancel }: TaxFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<TaxFormValues>({
    resolver: zodResolver(taxSchema),
    defaultValues: {
      name: tax?.name || "",
      rate: tax?.rate || 0,
    },
  })

  const handleSubmit = async (data: TaxFormValues) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <p className="text-sm text-muted-foreground italic">
          The field labels marked with * are required input fields.
        </p>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tax Name *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter tax name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rate (%) *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  step="any"
                  placeholder="Enter tax rate"
                  onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner data-icon="inline-start" />}
            {tax ? "Update" : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
