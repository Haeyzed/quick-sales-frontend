"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { HugeiconsIcon } from "@hugeicons/react"
import { Upload01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { ProductCombobox } from "@/components/products/product-combobox"
import { categorySchema, type CategoryFormValues } from "@/lib/schemas/category"
import type { Category } from "@/lib/types/category"
import { mockCategories } from "@/lib/mock-data/categories"

interface CategoryFormProps {
  category?: Category
  onSubmit: (data: CategoryFormValues) => Promise<void>
  onCancel?: () => void
  generalSettings?: {
    modules?: string[]
  }
}

export function CategoryForm({ category, onSubmit, onCancel, generalSettings = { modules: [] } }: CategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [imageUpload, setImageUpload] = React.useState<File[]>([])
  const [iconUpload, setIconUpload] = React.useState<File[]>([])

  const hasModule = (module: string) => generalSettings.modules?.includes(module) || false
  const hasWoocommerce = hasModule("woocommerce")
  const hasEcommerce = hasModule("ecommerce")
  const hasRestaurant = hasModule("restaurant")

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      parent_id: category?.parent_id || "",
      image: category?.image || "",
      icon: category?.icon || "",
      featured: category?.featured || false,
      is_sync_disable: category?.is_sync_disable || false,
      page_title: category?.page_title || "",
      short_description: category?.short_description || "",
    },
  })

  const handleSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true)
    try {
      // Convert File objects to strings (file names)
      if (imageUpload.length > 0) {
        data.image = imageUpload[0].name
      }
      if (iconUpload.length > 0) {
        data.icon = iconUpload[0].name
      }
      await onSubmit(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  const parentCategories = mockCategories.filter((c) => !c.parent_id && c.id !== category?.id)

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
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter category name" />
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
                <FormLabel>Image</FormLabel>
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

          <FormField
            control={form.control}
            name="parent_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Category</FormLabel>
                <ProductCombobox
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { value: "", label: "No parent" },
                    ...parentCategories.map((c) => ({ value: c.id, label: c.name })),
                  ]}
                  placeholder="Select parent category..."
                  showClear
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {hasWoocommerce && (
            <FormField
              control={form.control}
              name="is_sync_disable"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0 pt-8">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="font-normal">Disable WooCommerce Sync</FormLabel>
                </FormItem>
              )}
            />
          )}

        {(hasRestaurant || hasEcommerce) && (
          <>
            <div className="pt-4">
              <h6 className="font-semibold mb-2">For Website</h6>
              <hr className="mb-4" />
            </div>

            {hasEcommerce && (
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={iconUpload}
                        onValueChange={(files) => {
                          setIconUpload(files)
                          field.onChange(files[0]?.name || "")
                        }}
                        accept="image/*"
                        maxFiles={1}
                        maxSize={5 * 1024 * 1024}
                        onFileReject={(_, message) => {
                          form.setError("icon", {
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
                          {iconUpload.map((file, index) => (
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
            )}

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {hasEcommerce ? "List on category dropdown" : "List on website"}
                  </FormLabel>
                </FormItem>
              )}
            />
          </>
        )}

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
            {category ? "Update" : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
