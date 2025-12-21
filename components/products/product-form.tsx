"use client"

import { Editor } from "@/components/blocks/editor-00/editor"
import { BrandForm } from "@/components/brands/brand-form"
import { CategoryForm } from "@/components/categories/category-form"
import { DateTimePicker } from "@/components/shared/date-time-picker"
import { TaxForm } from "@/components/taxes/tax-form"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
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
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom"
import { Spinner } from "@/components/ui/spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TagInput } from "@/components/ui/tag-input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { UnitForm } from "@/components/units/unit-form"
import { mockBrands } from "@/lib/mock-data/brands"
import { mockCategories } from "@/lib/mock-data/categories"
import { mockTaxes } from "@/lib/mock-data/taxes"
import { mockUnits } from "@/lib/mock-data/units"
import { mockWarehouses } from "@/lib/mock-data/warehouses"
import type { BrandFormValues } from "@/lib/schemas/brand"
import type { CategoryFormValues } from "@/lib/schemas/category"
import { productFormSchema, type GeneralSettingsValues, type ProductFormValues } from "@/lib/schemas/product"
import type { TaxFormValues } from "@/lib/schemas/tax"
import type { UnitFormValues } from "@/lib/schemas/unit"
import type { ComboProduct } from "@/lib/types/product"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Add01Icon, Cancel01Icon, InformationCircleIcon, RefreshIcon, Upload01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { SerializedEditorState } from "lexical"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { ComboProductSelector } from "./combo-product-selector"
import { ComboProductTable } from "./combo-product-table"
import { ProductCombobox } from "./product-combobox"
import { RelatedProductsSelector } from "./related-products-selector"

interface ProductFormProps {
  initialData?: Partial<ProductFormValues>
  onSubmit: (data: ProductFormValues) => void
  isEdit?: boolean
  generalSettings?: GeneralSettingsValues
}

export function ProductForm({
  initialData,
  onSubmit,
  isEdit = false,
  generalSettings = { modules: ["ecommerce", "woocommerce"] },
}: ProductFormProps) {
  const [comboProducts, setComboProducts] = useState<ComboProduct[]>(initialData?.combo_products || [])
  const [relatedProducts, setRelatedProducts] = useState<string[]>(initialData?.related_products || [])
  const [variantOptions, setVariantOptions] = useState<Array<{ option: string; value: string }>>([
    { option: "", value: "" },
  ])
  const [fileUpload, setFileUpload] = useState<File[]>([])
  const [imagesUpload, setImagesUpload] = useState<File[]>([])
  const [productDetailsEditorState, setProductDetailsEditorState] = useState<SerializedEditorState | null>(() => {
    if (!initialData?.product_details) return null

    if (typeof initialData.product_details !== "string" || initialData.product_details.trim() === "") {
      return null
    }

    // Try to parse as JSON (for editor state)
    try {
      return JSON.parse(initialData.product_details)
    } catch {
      // If it's not valid JSON, it's likely a plain string from old data
      // Return null to start with empty editor, or you could convert it to editor format
      return null
    }
  })

  const [isBrandDialogOpen, setIsBrandDialogOpen] = React.useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = React.useState(false)
  const [isUnitDialogOpen, setIsUnitDialogOpen] = React.useState(false)
  const [isTaxDialogOpen, setIsTaxDialogOpen] = React.useState(false)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      type: "standard",
      name: "",
      code: "",
      barcode_symbology: "C128",
      tax_method: "exclusive",
      qty: 0,
      cost: 0,
      price: 0,
      profit_margin: 0,
      wholesale_price: 0,
      daily_sale_objective: 0,
      alert_quantity: 0,
      warranty: 0,
      warranty_type: "months",
      guarantee: 0,
      guarantee_type: "months",
      is_variant: false,
      is_batch: false,
      is_imei: false,
      featured: false,
      is_embeded: false,
      is_initial_stock: false,
      is_diff_price: false,
      promotion: false,
      is_active: true,
      is_sync_disable: false,
      is_online: true,
      is_addon: false,
      in_stock: true,
      product_tags: [],
      product_details: "",
      brand_id: "",
      category_id: "",
      unit_id: "",
      sale_unit_id: "",
      purchase_unit_id: "",
      tax_id: "",
      file: "",
      meta_title: "",
      meta_description: "",
      promotion_price: 0,
      ...initialData,
    },
  })

  const productType = form.watch("type")
  const isPromotionEnabled = form.watch("promotion")
  const isVariant = form.watch("is_variant")
  const isBatch = form.watch("is_batch")
  const isImei = form.watch("is_imei")
  const isInitialStock = form.watch("is_initial_stock")
  const isDiffPrice = form.watch("is_diff_price")
  const isOnline = form.watch("is_online")

  const handleCreateBrand = async (data: BrandFormValues) => {
    const newBrand = {
      id: `brand-${Date.now()}`,
      ...data,
    }
    mockBrands.push(newBrand)
    form.setValue("brand_id", newBrand.id)
    setIsBrandDialogOpen(false)
  }

  const handleCreateCategory = async (data: CategoryFormValues) => {
    const newCategory = {
      id: `cat-${Date.now()}`,
      ...data,
    }
    mockCategories.push(newCategory)
    form.setValue("category_id", newCategory.id)
    setIsCategoryDialogOpen(false)
  }

  const handleCreateUnit = async (data: UnitFormValues) => {
    const newUnit = {
      id: `unit-${Date.now()}`,
      ...data,
    }
    mockUnits.push(newUnit)
    form.setValue("unit_id", newUnit.id)
    setIsUnitDialogOpen(false)
  }

  const handleCreateTax = async (data: TaxFormValues) => {
    const newTax = {
      id: `tax-${Date.now()}`,
      ...data,
    }
    mockTaxes.push(newTax)
    form.setValue("tax_id", newTax.id)
    setIsTaxDialogOpen(false)
  }

  useEffect(() => {
    if (productType === "combo") {
      form.setValue("is_variant", false)
      form.setValue("is_diff_price", false)
    }
  }, [productType, form])

  useEffect(() => {
    if (isBatch) {
      form.setValue("is_variant", false)
      form.setValue("is_initial_stock", false)
      form.setValue("featured", false)
    }
  }, [isBatch, form])

  useEffect(() => {
    if (isImei) {
      form.setValue("is_initial_stock", false)
      form.setValue("featured", false)
    }
  }, [isImei, form])

  useEffect(() => {
    if (isVariant) {
      form.setValue("is_initial_stock", false)
    }
  }, [isVariant, form])

  const generateCode = () => {
    const code = "PRD-" + Math.random().toString(36).substring(2, 9).toUpperCase()
    form.setValue("code", code)
  }

  const handleSubmit = (data: ProductFormValues) => {
    if (data.type === "combo") {
      data.combo_products = comboProducts
    }
    data.related_products = relatedProducts

    // Convert File objects to strings (file names)
    if (fileUpload.length > 0) {
      data.file = fileUpload[0].name
    }
    if (imagesUpload.length > 0) {
      data.images = imagesUpload.map((img) => img.name)
    }

    onSubmit(data)
  }

  const hasModule = (module: string) => generalSettings.modules.includes(module)

  return (
    <TooltipProvider>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <p className="text-sm text-muted-foreground italic">
          The field labels marked with * are required input fields.
        </p>

        {/* Section 1: Basic Product Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Product Type */}
          <Controller
            control={form.control}
            name="type"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="type">Product Type *</FieldLabel>
                <ProductCombobox
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { value: "standard", label: "Standard" },
                    { value: "combo", label: "Combo" },
                    { value: "digital", label: "Digital" },
                    { value: "service", label: "Service" },
                  ]}
                  placeholder="Select type..."
                  showClear={false}
                />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          {/* Product Name */}
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="name">Product Name *</FieldLabel>
                <Input id="name" placeholder="Enter product name" {...field} />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="code"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="code">Product Code *</FieldLabel>
                <InputGroup>
                  <InputGroupInput id="code" placeholder="Enter product code" {...field} />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      type="button"
                      variant="secondary"
                      size="icon-xs"
                      onClick={generateCode}
                      title="Generate Code"
                    >
                      <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} className="h-4 w-4" />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          {/* Barcode Symbology */}
          <Controller
            control={form.control}
            name="barcode_symbology"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="barcode_symbology">Barcode Symbology *</FieldLabel>
                <ProductCombobox
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { value: "C128", label: "Code 128" },
                    { value: "C39", label: "Code 39" },
                    { value: "UPCA", label: "UPC-A" },
                    { value: "UPCE", label: "UPC-E" },
                    { value: "EAN8", label: "EAN-8" },
                    { value: "EAN13", label: "EAN-13" },
                  ]}
                  placeholder="Select symbology..."
                  showClear={false}
                />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          {(productType === "digital" || productType === "combo") && (
            <Controller
              control={form.control}
              name="file"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="file">Attach File *</FieldLabel>
                  <FileUpload
                    value={fileUpload}
                    onValueChange={(files) => {
                      setFileUpload(files)
                      field.onChange(files[0]?.name || "")
                    }}
                    accept="*/*"
                    maxFiles={1}
                    maxSize={50 * 1024 * 1024}
                    onFileReject={(_, message) => {
                      form.setError("file", {
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
                      {fileUpload.map((file, index) => (
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
                  <FieldDescription>Upload a file up to 50MB.</FieldDescription>
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
          )}

        {/* Section 2: Combo Products (conditional) */}
        {productType === "combo" && (
        <div className="md:col-span-3 space-y-4">
            <div>
              <FieldLabel>Add Product</FieldLabel>
              <ComboProductSelector
                onAddProduct={(product) => {
                  const existingIndex = comboProducts.findIndex((p) => p.product_id === product.id)
                  if (existingIndex === -1) {
                    setComboProducts([
                      ...comboProducts,
                      {
                        product_id: product.id,
                        product_name: product.name,
                        product_code: product.code,
                        wastage_percent: 0,
                        quantity: 1,
                        unit_id: product.unit_id,
                        unit_cost: product.cost || 0,
                        unit_price: product.price || 0,
                        subtotal: product.price || 0,
                      },
                    ])
                  }
                }}
                existingProductIds={comboProducts.map((p) => p.product_id)}
              />
            </div>

            <div>
              <FieldLabel>Combo Products</FieldLabel>
              <ComboProductTable products={comboProducts} onChange={setComboProducts} />
            </div>
          </div>
        )}

          {/* Section 3: Brand & Category */}
          <Controller
            control={form.control}
            name="brand_id"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="brand_id">Brand</FieldLabel>
                <div className="flex">
                  <ProductCombobox
                    value={field.value}
                    onChange={field.onChange}
                    options={mockBrands.map((b) => ({ value: b.id, label: b.name }))}
                    placeholder="Select brand..."
                    className="-me-px rounded-r-none shadow-none focus-visible:z-10 w-full"
                  />
                  <Button type="button" variant="secondary" size="icon" onClick={() => setIsBrandDialogOpen(true)} className="rounded-l-none shadow-none">
                    <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="h-4 w-4" />
                  </Button>
                </div>
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="category_id"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="category_id">Category *</FieldLabel>
                <div className="flex">
                  <ProductCombobox
                    value={field.value}
                    onChange={field.onChange}
                    options={mockCategories.map((c) => ({ value: c.id, label: c.name }))}
                    placeholder="Select category..."
                    className="-me-px rounded-r-none shadow-none focus-visible:z-10 w-full"
                  />
                  <Button type="button" variant="secondary" size="icon" onClick={() => setIsCategoryDialogOpen(true)} className="rounded-l-none shadow-none">
                    <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="h-4 w-4" />
                  </Button>
                </div>
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

        {/* Section 4: Units (conditional - not for service/digital) */}
        {productType !== "service" && productType !== "digital" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Product Unit */}
            <Controller
              control={form.control}
              name="unit_id"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="unit_id">Product Unit *</FieldLabel>
                  <div className="flex">
                    <ProductCombobox
                      value={field.value}
                      onChange={field.onChange}
                      options={mockUnits.map((u) => ({ value: u.id, label: u.name }))}
                      placeholder="Select unit..."
                      className="-me-px rounded-r-none shadow-none focus-visible:z-10 w-full"
                    />
                    <Button type="button" variant="secondary" size="icon" onClick={() => setIsUnitDialogOpen(true)} className="rounded-l-none shadow-none">
                      <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="h-4 w-4" />
                    </Button>
                  </div>
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="sale_unit_id"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="sale_unit_id">Sale Unit</FieldLabel>
                  <ProductCombobox
                    value={field.value}
                    onChange={field.onChange}
                    options={mockUnits.map((u) => ({ value: u.id, label: u.name }))}
                    placeholder="Select sale unit..."
                  />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="purchase_unit_id"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="purchase_unit_id">Purchase Unit</FieldLabel>
                  <ProductCombobox
                    value={field.value}
                    onChange={field.onChange}
                    options={mockUnits.map((u) => ({ value: u.id, label: u.name }))}
                    placeholder="Select purchase unit..."
                  />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
          </div>
        )}

        {/* Section 5: Pricing (Cost hidden for combo) */}
          {productType !== "combo" && (
            <Controller
              control={form.control}
              name="cost"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="cost">Product Cost *</FieldLabel>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : 0)}
                  />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
          )}

          <Controller
            control={form.control}
            name="price"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="price">Product Price *</FieldLabel>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : 0)}
                />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="wholesale_price"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="wholesale_price">Wholesale Price</FieldLabel>
                <Input
                  id="wholesale_price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : 0)}
                />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

        {/* Section 6: Additional Pricing & Tax Information */}
          <Controller
            control={form.control}
            name="daily_sale_objective"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel className="flex items-center gap-1">
                  Daily Sale Objective
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <HugeiconsIcon icon={InformationCircleIcon} className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>
                        Minimum qty which must be sold in a day. If not, you will be notified on dashboard. But you have
                        to set up the cron job properly for that. Follow the documentation in that regard.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </FieldLabel>
                <Input
                  id="daily_sale_objective"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : 0)}
                />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          {productType !== "service" && (
            <Controller
              control={form.control}
              name="alert_quantity"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="alert_quantity">Alert Quantity</FieldLabel>
                  <Input
                    id="alert_quantity"
                    type="number"
                    step="0.01"
                    placeholder="0"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : 0)}
                  />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
          )}

          <Controller
            control={form.control}
            name="tax_id"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="tax_id">Product Tax</FieldLabel>
                <div className="flex">
                  <ProductCombobox
                    value={field.value}
                    onChange={field.onChange}
                    options={[...mockTaxes.map((t) => ({ value: t.id, label: t.name }))]}
                    placeholder="Select tax..."
                    className="-me-px rounded-r-none shadow-none focus-visible:z-10 w-full"
                  />
                  <Button type="button" variant="secondary" size="icon" onClick={() => setIsTaxDialogOpen(true)} className="rounded-l-none shadow-none">
                    <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="h-4 w-4" />
                  </Button>
                </div>  
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="tax_method"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel className="flex items-center gap-1">
                  Tax Method
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <HugeiconsIcon icon={InformationCircleIcon} className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="space-y-1">
                        <strong>Exclusive:</strong> Product price = Actual product price + Tax.
                        <br />
                        <strong>Inclusive:</strong> Actual product price = Product price - Tax.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </FieldLabel>
                <ProductCombobox
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { value: "exclusive", label: "Exclusive" },
                    { value: "inclusive", label: "Inclusive" },
                  ]}
                  placeholder="Select method..."
                  showClear={false}
                />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

        {/* Section 7: Warranty & Guarantee */}
          <Controller
            control={form.control}
            name="warranty"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="warranty">Warranty</FieldLabel>
                <div className="flex">
                  <Input
                    id="warranty"
                    type="number"
                    min="1"
                    placeholder="1"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value ? Number.parseInt(e.target.value) : 0)}
                    className="-me-px rounded-r-none shadow-none focus-visible:z-10"
                  />
                  <Controller
                    control={form.control}
                    name="warranty_type"
                    render={({ field: typeField }) => (
                      <ProductCombobox
                        value={typeField.value}
                        onChange={typeField.onChange}
                        options={[
                          { value: "days", label: "Days" },
                          { value: "months", label: "Months" },
                          { value: "years", label: "Years" },
                        ]}
                        placeholder="Select type..."
                        showClear={false}
                        className="w-32 rounded-l-none shadow-none"
                      />
                    )}
                  />
                </div>
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="guarantee"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="guarantee">Guarantee</FieldLabel>
                <div className="flex">
                  <Input
                    id="guarantee"
                    type="number"
                    min="1"
                    placeholder="1"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value ? Number.parseInt(e.target.value) : 0)}
                    className="-me-px rounded-r-none shadow-none focus-visible:z-10"
                  />
                  <Controller
                    control={form.control}
                    name="guarantee_type"
                    render={({ field: typeField }) => (
                      <ProductCombobox
                        value={typeField.value}
                        onChange={typeField.onChange}
                        options={[
                          { value: "days", label: "Days" },
                          { value: "months", label: "Months" },
                          { value: "years", label: "Years" },
                        ]}
                        placeholder="Select type..."
                        showClear={false}
                        className="w-32 rounded-l-none shadow-none"
                      />
                    )}
                  />
                </div>
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

        {/* Section 8: Featured & Embedded Checkboxes */}
          <Controller
            control={form.control}
            name="featured"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error} orientation="horizontal">
                <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isBatch || isImei} />
                <div className="space-y-1 leading-none">
                  <FieldLabel className="font-normal">Featured</FieldLabel>
                  <FieldDescription>Featured product will be displayed in POS</FieldDescription>
                </div>
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="is_embeded"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error} orientation="horizontal">
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                <div className="space-y-1 leading-none">
                  <FieldLabel className="font-normal">Embedded Barcode</FieldLabel>
                  <FieldDescription>Check if this product will be used in weight scale machine</FieldDescription>
                </div>
              </Field>
            )}
          />
        </div>

        {/* Section 9: Initial Stock (conditional) */}
        {!isVariant && !isBatch && !isImei && (
          <Controller
            control={form.control}
            name="is_initial_stock"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error} orientation="horizontal">
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                <div className="space-y-1 leading-none">
                  <FieldLabel className="font-normal">Initial Stock</FieldLabel>
                  <FieldDescription>This feature will not work for product with variants and batches</FieldDescription>
                </div>
              </Field>
            )}
          />
        )}

        {isInitialStock && !isVariant && !isBatch && !isImei && mockWarehouses.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Warehouse</TableHead>
                <TableHead>Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockWarehouses.map((warehouse) => (
                <TableRow key={warehouse.id}>
                  <TableCell>{warehouse.name}</TableCell>
                  <TableCell>
                    <Input type="number" min="0" placeholder="0" className="w-32" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Section 10: Product Images */}
        <Controller
          control={form.control}
          name="images"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="images">Product Image</FieldLabel>
              <FileUpload
                value={imagesUpload}
                onValueChange={(files) => {
                  setImagesUpload(files)
                  field.onChange(files.map((f) => f.name))
                }}
                accept="image/*"
                maxFiles={10}
                maxSize={5 * 1024 * 1024}
                onFileReject={(_, message) => {
                  form.setError("images", {
                    message,
                  })
                }}
                multiple
              >
                <FileUploadDropzone className="flex-row flex-wrap border-dotted text-center">
                  <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} className="size-4" />
                  Drag and drop or
                  <FileUploadTrigger asChild>
                    <Button variant="link" size="sm" className="p-0">
                      choose files
                    </Button>
                  </FileUploadTrigger>
                  to upload
                </FileUploadDropzone>
                <FileUploadList>
                  {imagesUpload.map((file, index) => (
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
              {/* Existing Images Display */}
              {initialData?.images && initialData.images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Existing Images</p>
                  <div className="grid grid-cols-4 gap-4">
                    {initialData.images.map((imageUrl, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                        <ImageZoom
                          zoomMargin={100}
                          backdropClassName={cn('[&_[data-rmiz-modal-overlay="visible"]]:bg-black/80')}
                        >
                          <Image
                            src={imageUrl || "/placeholder.svg"}
                            alt={`Existing image ${index + 1}`}
                            width={400}
                            height={400}
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            unoptimized
                          />
                        </ImageZoom>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <FieldDescription>
                Upload up to 10 images up to 5MB each. Only jpeg, jpg, png, gif files can be uploaded. First image will
                be base image.
              </FieldDescription>
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        {/* Section 11: Product Details */}
        <Controller
          control={form.control}
          name="product_details"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="product_details">Product Details</FieldLabel>
              <Editor
                editorSerializedState={productDetailsEditorState || undefined}
                onSerializedChange={(value) => {
                  setProductDetailsEditorState(value)
                  // Convert editor state to JSON string for form
                  field.onChange(JSON.stringify(value))
                }}
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        {/* Section 12: Variant Section */}
        {!isBatch && productType !== "combo" && (
          <Controller
            control={form.control}
            name="is_variant"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error} orientation="horizontal">
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                <div className="space-y-1 leading-none">
                  <FieldLabel className="font-normal">This product has variant</FieldLabel>
                </div>
              </Field>
            )}
          />
        )}

        {isVariant && (
          <>
            {variantOptions.map((variant, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4">
                  <FieldLabel>Option *</FieldLabel>
                  <Input
                    placeholder="Size, Color etc"
                    value={variant.option}
                    onChange={(e) => {
                      const newOptions = [...variantOptions]
                      newOptions[index].option = e.target.value
                      setVariantOptions(newOptions)
                    }}
                  />
                </div>
                <div className="md:col-span-7">
                  <FieldLabel>Value *</FieldLabel>
                  <TagInput
                    value={variant.value.split(",").filter(Boolean)}
                    onChange={(tags) => {
                      const newOptions = [...variantOptions]
                      newOptions[index].value = tags.join(",")
                      setVariantOptions(newOptions)
                    }}
                    placeholder="Type value and press Enter"
                  />
                </div>
                <div className="md:col-span-1 flex items-end">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      setVariantOptions(variantOptions.filter((_, i) => i !== index))
                    }}
                  >
                    <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => setVariantOptions([...variantOptions, { option: "", value: "" }])}
            >
              <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="mr-2 h-4 w-4" />
              Add More Variant
            </Button>

            {variantOptions.some((v) => v.option && v.value) && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Generated Variants</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Item Code</TableHead>
                      <TableHead>Additional Cost</TableHead>
                      <TableHead>Additional Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {variantOptions
                      .filter((v) => v.option && v.value)
                      .flatMap((v) =>
                        v.value
                          .split(",")
                          .filter(Boolean)
                          .map((val) => ({
                            option: v.option,
                            value: val.trim(),
                          })),
                      )
                      .map((variant, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            {variant.option}: {variant.value}
                          </TableCell>
                          <TableCell>
                            <Input placeholder="Item code" className="w-32" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" step="0.01" placeholder="0.00" className="w-32" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" step="0.01" placeholder="0.00" className="w-32" />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}

        {/* Section 13: Different Price for Warehouse */}
        {mockWarehouses.length > 0 && productType !== "combo" && (
          <Controller
            control={form.control}
            name="is_diff_price"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error} orientation="horizontal">
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                <div className="space-y-1 leading-none">
                  <FieldLabel className="font-normal">
                    This product has different price for different warehouse
                  </FieldLabel>
                </div>
              </Field>
            )}
          />
        )}

        {isDiffPrice && mockWarehouses.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Warehouse</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockWarehouses.map((warehouse) => (
                <TableRow key={warehouse.id}>
                  <TableCell>{warehouse.name}</TableCell>
                  <TableCell>
                    <Input type="number" step="0.01" min="0" placeholder="0.00" className="w-32" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Section 14: Batch Checkbox */}
        <Controller
          control={form.control}
          name="is_batch"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error} orientation="horizontal">
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              <FieldLabel className="font-normal">This product has batch and expired date</FieldLabel>
            </Field>
          )}
        />

        {/* Section 15: IMEI Checkbox */}
        <Controller
          control={form.control}
          name="is_imei"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error} orientation="horizontal">
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              <FieldLabel className="font-normal">This product has IMEI or Serial numbers</FieldLabel>
            </Field>
          )}
        />

        {/* Section 16: Promotion Section */}
        <div className="space-y-4">
          <Controller
            control={form.control}
            name="promotion"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error} orientation="horizontal">
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                <FieldLabel className="font-normal">Add Promotional Price</FieldLabel>
              </Field>
            )}
          />

          {isPromotionEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-7">
              <Controller
                control={form.control}
                name="promotion_price"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor="promotion_price">Promotional Price</FieldLabel>
                    <Input
                      id="promotion_price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : 0)}
                    />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="starting_date"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor="starting_date">Promotion Starts</FieldLabel>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      showTime={true}
                      placeholder="Select start date"
                    />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="last_date"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor="last_date">Promotion Ends</FieldLabel>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      showTime={true}
                      placeholder="Select end date"
                    />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />
            </div>
          )}
        </div>

        {/* Section 17: Woocommerce Sync */}
        {hasModule("woocommerce") && (
          <Controller
            control={form.control}
            name="is_sync_disable"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error} orientation="horizontal">
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                <FieldLabel className="font-normal">Disable Woocommerce Sync</FieldLabel>
              </Field>
            )}
          />
        )}

        {/* Section 18: Sell Online & In Stock */}
        {(hasModule("ecommerce") || hasModule("restaurant")) && (
          <>
            <Controller
              control={form.control}
              name="is_online"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error} orientation="horizontal">
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  <FieldLabel className="font-normal">Sell Online</FieldLabel>
                </Field>
              )}
            />

            {hasModule("ecommerce") && (
              <Controller
                control={form.control}
                name="in_stock"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error} orientation="horizontal">
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    <FieldLabel className="font-normal">In Stock</FieldLabel>
                  </Field>
                )}
              />
            )}
          </>
        )}

        {/* Section 19: Product Active & Addon */}
        <div className="space-y-4">
          <Controller
            control={form.control}
            name="is_active"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error} orientation="horizontal">
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                <FieldLabel className="font-normal">Product Active</FieldLabel>
              </Field>
            )}
          />

          {hasModule("restaurant") && (
            <Controller
              control={form.control}
              name="is_addon"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error} orientation="horizontal">
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  <div className="space-y-1">
                    <FieldLabel className="font-normal">Addon Item</FieldLabel>
                    <FieldDescription>
                      Addon Items will be displayed only at the Addon section{" "}
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="inline-flex">
                            <HugeiconsIcon
                              icon={InformationCircleIcon}
                              strokeWidth={2}
                              className="h-4 w-4 text-muted-foreground"
                            />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Mark this if the product is an add-on item for other products</p>
                        </TooltipContent>
                      </Tooltip>
                    </FieldDescription>
                  </div>
                </Field>
              )}
            />
          )}
        </div>

        {/* Section 20: Product Tags */}
        <Controller
          control={form.control}
          name="product_tags"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="product_tags">Product Tags</FieldLabel>
              <TagInput value={field.value || []} onChange={field.onChange} placeholder="Type tag and press Enter" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        {/* Section 21: SEO Section */}
        {(hasModule("ecommerce") || hasModule("restaurant")) && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">For SEO</h3>
              <p className="text-sm text-muted-foreground">Optimize your product for search engines</p>
            </div>

            <Controller
              control={form.control}
              name="meta_title"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="meta_title">Meta Title {isOnline && "*"}</FieldLabel>
                  <Input id="meta_title" placeholder="Enter meta title" {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="meta_description"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="meta_description">Meta Description {isOnline && "*"}</FieldLabel>
                  <Input id="meta_description" placeholder="Enter meta description" {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
          </div>
        )}

        {/* Section 22: Related Products */}
        {(hasModule("ecommerce") || hasModule("restaurant")) && (
          <div>
            <RelatedProductsSelector value={relatedProducts} onChange={setRelatedProducts} />
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Spinner data-icon="inline-start" />}
            {isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>

      <Dialog open={isBrandDialogOpen} onOpenChange={setIsBrandDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Brand</DialogTitle>
            <DialogDescription>Create a new brand</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto px-1">
            <BrandForm
              onSubmit={handleCreateBrand}
              onCancel={() => setIsBrandDialogOpen(false)}
              generalSettings={generalSettings}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>Create a new category</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto px-1">
            <CategoryForm
              onSubmit={handleCreateCategory}
              onCancel={() => setIsCategoryDialogOpen(false)}
              generalSettings={generalSettings}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isUnitDialogOpen} onOpenChange={setIsUnitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Unit</DialogTitle>
            <DialogDescription>Create a new unit of measurement</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto px-1">
            <UnitForm onSubmit={handleCreateUnit} onCancel={() => setIsUnitDialogOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isTaxDialogOpen} onOpenChange={setIsTaxDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tax</DialogTitle>
            <DialogDescription>Create a new tax rate</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto px-1">
            <TaxForm onSubmit={handleCreateTax} onCancel={() => setIsTaxDialogOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
