"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { HugeiconsIcon } from "@hugeicons/react"
import { Upload01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload"
import { brandSchema, type BrandFormValues } from "@/lib/schemas/brand"
import type { Brand } from "@/lib/types/brand"

interface BrandFormProps {
  brand?: Brand
  onSubmit: (data: BrandFormValues) => Promise<void>
  onCancel?: () => void
  generalSettings?: {
    modules?: string[]
  }
}

export function BrandForm({ brand, onSubmit, onCancel, generalSettings = { modules: [] } }: BrandFormProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [imageUpload, setImageUpload] = React.useState<File[]>([])

  const hasEcommerce = generalSettings.modules?.includes("ecommerce") || false

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: brand?.name || "",
      image: brand?.image || "",
      page_title: brand?.page_title || "",
      short_description: brand?.short_description || "",
    },
  })

  const handleSubmit = async (data: BrandFormValues) => {
    setIsLoading(true)
    try {
      if (imageUpload.length > 0) {
        data.image = imageUpload[0].name
      }
      await onSubmit(data)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <p className="text-sm text-muted-foreground italic">The field labels marked with * are required input fields.</p>

      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field data-invalid={!!fieldState.error}>
            <FieldLabel htmlFor="name">Brand Name *</FieldLabel>
            <Input id="name" {...field} placeholder="Enter brand name" />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="image"
        render={({ field, fieldState }) => (
          <Field data-invalid={!!fieldState.error}>
            <FieldLabel htmlFor="image">Brand Image</FieldLabel>
            <FileUpload
              value={imageUpload}
              onValueChange={(files) => {
                setImageUpload(files)
                field.onChange(files[0]?.name || "")
              }}
              accept="image/*"
              maxFiles={1}
              maxSize={5 * 1024 * 1024}
              onFileReject={(_, message) => {
                form.setError("image", {
                  message,
                })
              }}
            >
              <FileUploadDropzone className="flex-row flex-wrap border-dotted text-center">
                <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} className="size-4" />
                Drag and drop or
                <FileUploadTrigger asChild>
                  <Button variant="link" size="sm" className="p-0">
                    choose file
                  </Button>
                </FileUploadTrigger>
                to upload
              </FileUploadDropzone>
              <FileUploadList>
                {imageUpload.map((file, index) => (
                  <FileUploadItem key={index} value={file}>
                    <FileUploadItemPreview />
                    <FileUploadItemMetadata />
                    <FileUploadItemDelete asChild>
                      <Button variant="ghost" size="icon" className="size-7">
                        <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </FileUploadItemDelete>
                  </FileUploadItem>
                ))}
              </FileUploadList>
            </FileUpload>
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      {hasEcommerce && (
        <>
          <div className="pt-4">
            <h6 className="font-semibold mb-2">For SEO</h6>
            <hr className="mb-4" />
          </div>

          <Controller
            control={form.control}
            name="page_title"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="page_title">Meta Title</FieldLabel>
                <Input id="page_title" {...field} placeholder="Meta Title" />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="short_description"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="short_description">Meta Description</FieldLabel>
                <Input id="short_description" {...field} placeholder="Meta Description" />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />
        </>
      )}

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Spinner data-icon="inline-start" />}
          {brand ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  )
}
