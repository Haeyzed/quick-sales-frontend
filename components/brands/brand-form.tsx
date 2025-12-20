"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { HugeiconsIcon } from "@hugeicons/react"
import { Upload01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
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
  const [isSubmitting, setIsSubmitting] = React.useState(false)
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
    setIsSubmitting(true)
    try {
      // Convert File objects to strings (file names)
      if (imageUpload.length > 0) {
        data.image = imageUpload[0].name
      }
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
              <FormLabel>Brand Name *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter brand name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand Image</FormLabel>
              <FormControl>
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {hasEcommerce && (
          <>
            <div className="pt-4">
              <h6 className="font-semibold mb-2">For SEO</h6>
              <hr className="mb-4" />
            </div>

            <FormField
              control={form.control}
              name="page_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Meta Title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="short_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Description</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Meta Description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner data-icon="inline-start" />}
            {brand ? "Update" : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
