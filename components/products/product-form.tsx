"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type ProductFormValues, productSchema, type GeneralSettingsValues } from "@/lib/schemas/product"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
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
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { HugeiconsIcon } from "@hugeicons/react"
import { RefreshIcon, Add01Icon, ImageUploadIcon, Cancel01Icon, Upload01Icon } from "@hugeicons/core-free-icons"
import { mockBrands, mockCategories, mockUnits, mockTaxes, mockWarehouses, mockProducts } from "@/lib/mock-data/products"
import { ProductCombobox } from "./product-combobox"
import { ComboProductTable } from "./combo-product-table"
import { ComboProductSelector } from "./combo-product-selector"
import { DateTimePicker } from "@/components/shared/date-time-picker"
import { RelatedProductsSelector } from "./related-products-selector"
import { TagInput } from "@/components/ui/tag-input"
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Editor } from "@/components/blocks/editor-00/editor"
import type { SerializedEditorState } from "lexical"
import type { ComboProduct, Product } from "@/lib/types/products"
import Image from "next/image"
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom"
import { cn } from "@/lib/utils"

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
    
    if (typeof initialData.product_details !== 'string' || initialData.product_details.trim() === '') {
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

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
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
      is_diffPrice: false,
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
  const isDiffPrice = form.watch("is_diffPrice")
  const isOnline = form.watch("is_online")

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <p className="text-sm text-muted-foreground italic">
          The field labels marked with * are required input fields.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Product Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Type *</FormLabel>
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
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Product Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Code *</FormLabel>
                <InputGroup>
                  <InputGroupInput placeholder="Enter product code" {...field} />
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
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Barcode Symbology */}
          <FormField
            control={form.control}
            name="barcode_symbology"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Barcode Symbology *</FormLabel>
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
                <FormMessage />
              </FormItem>
            )}
          />

          {productType === "digital" && (
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attach File *</FormLabel>
                  <FormControl>
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
                  </FormControl>
                  <FormDescription>
                    Upload a file up to 50MB.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="brand_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <div className="flex gap-2">
                  <ProductCombobox
                    value={field.value}
                    onChange={field.onChange}
                    options={mockBrands.map((b) => ({ value: b.id, label: b.title }))}
                    placeholder="Select brand..."
                    searchable
                  />
                  <Button type="button" variant="secondary" size="icon">
                    <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="h-4 w-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <div className="flex gap-2">
                  <ProductCombobox
                    value={field.value}
                    onChange={field.onChange}
                    options={mockCategories.map((c) => ({ value: c.id, label: c.name }))}
                    placeholder="Select category..."
                    searchable
                  />
                  <Button type="button" variant="secondary" size="icon">
                    <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="h-4 w-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {productType === "combo" && (
          <div className="space-y-4">
            <div>
              <FormLabel>Add Product</FormLabel>
              <ComboProductSelector
                onAddProduct={(product) => {
                  const existingIndex = comboProducts.findIndex(
                    (p) => p.product_id === product.id,
                  )
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
              <FormLabel>Combo Products</FormLabel>
              <ComboProductTable products={comboProducts} onChange={setComboProducts} />
            </div>
          </div>
        )}

        {productType !== "service" && productType !== "digital" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="unit_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Unit *</FormLabel>
                  <ProductCombobox
                    value={field.value}
                    onChange={field.onChange}
                    options={mockUnits.map((u) => ({ value: u.id, label: u.unit_name }))}
                    placeholder="Select unit..."
                    searchable
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sale_unit_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sale Unit</FormLabel>
                  <ProductCombobox
                    value={field.value}
                    onChange={field.onChange}
                    options={mockUnits.map((u) => ({ value: u.id, label: u.unit_name }))}
                    placeholder="Select sale unit..."
                    searchable
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purchase_unit_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Unit</FormLabel>
                  <ProductCombobox
                    value={field.value}
                    onChange={field.onChange}
                    options={mockUnits.map((u) => ({ value: u.id, label: u.unit_name }))}
                    placeholder="Select purchase unit..."
                    searchable
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {productType !== "combo" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Cost *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profit_margin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profit Margin (%)</FormLabel>
                  <InputGroup>
                    <InputGroupInput
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : 0)}
                    />
                    <InputGroupAddon>
                      <span className="text-muted-foreground">%</span>
                    </InputGroupAddon>
                  </InputGroup>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Price *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="wholesale_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wholesale Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Additional Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Daily Sale Objective */}
          <FormField
            control={form.control}
            name="daily_sale_objective"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Daily Sale Objective</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Alert Quantity */}
          {productType !== "service" && (
            <FormField
              control={form.control}
              name="alert_quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alert Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Product Tax - standalone field without input group */}
          <FormField
            control={form.control}
            name="tax_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Tax</FormLabel>
                <div className="flex gap-2">
                  <ProductCombobox
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      { value: "", label: "No Tax" },
                      ...mockTaxes.map((t) => ({ value: t.id, label: t.name })),
                    ]}
                    placeholder="Select tax..."
                    searchable
                  />
                  <Button type="button" variant="secondary" size="icon">
                    <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="h-4 w-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tax Method */}
          <FormField
            control={form.control}
            name="tax_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Method</FormLabel>
                <ProductCombobox
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { value: "exclusive", label: "Exclusive" },
                    { value: "inclusive", label: "Inclusive" },
                  ]}
                  placeholder="Select method..."
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="warranty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warranty</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="1"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? Number.parseInt(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="warranty_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <ProductCombobox
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      { value: "days", label: "Days" },
                      { value: "months", label: "Months" },
                      { value: "years", label: "Years" },
                    ]}
                    placeholder="Select type..."
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="guarantee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guarantee</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="1"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? Number.parseInt(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guarantee_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <ProductCombobox
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      { value: "days", label: "Days" },
                      { value: "months", label: "Months" },
                      { value: "years", label: "Years" },
                    ]}
                    placeholder="Select type..."
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isBatch || isImei} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Featured</FormLabel>
                  <p className="text-sm text-muted-foreground italic">Featured product will be displayed in POS</p>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_embeded"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Embedded Barcode</FormLabel>
                  <p className="text-sm text-muted-foreground italic">
                    Check if this product will be used in weight scale machine
                  </p>
                </div>
              </FormItem>
            )}
          />

          {!isVariant && !isBatch && !isImei && (
            <FormField
              control={form.control}
              name="is_initial_stock"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Initial Stock</FormLabel>
                    <p className="text-sm text-muted-foreground italic">
                      This feature will not work for product with variants and batches
                    </p>
                  </div>
                </FormItem>
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
        </div>

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Image</FormLabel>
              <FormControl>
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
              </FormControl>
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
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                        </ImageZoom>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <FormDescription>
                Upload up to 10 images up to 5MB each. Only jpeg, jpg, png, gif files can be uploaded. First image will be base image.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="product_details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Details</FormLabel>
              <FormControl>
                <Editor
                  editorSerializedState={productDetailsEditorState || undefined}
                  onSerializedChange={(value) => {
                    setProductDetailsEditorState(value)
                    // Convert editor state to JSON string for form
                    field.onChange(JSON.stringify(value))
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isBatch && (
          <FormField
            control={form.control}
            name="is_variant"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>This product has variant</FormLabel>
                </div>
              </FormItem>
            )}
          />
        )}

        {isVariant && (
          <>
              {variantOptions.map((variant, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4">
                    <FormLabel>Option *</FormLabel>
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
                    <FormLabel>Value *</FormLabel>
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

        {mockWarehouses.length > 0 && (
          <FormField
            control={form.control}
            name="is_diffPrice"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>This product has different price for different warehouse</FormLabel>
                </div>
              </FormItem>
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

        <FormField
          control={form.control}
          name="is_batch"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>This product has batch and expired date</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_imei"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>This product has IMEI or Serial numbers</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="promotion"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Add Promotional Price</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {isPromotionEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-7">
              <FormField
                control={form.control}
                name="promotion_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Promotional Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="starting_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Promotion Starts</FormLabel>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      showTime={true}
                      placeholder="Select start date"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Promotion Ends</FormLabel>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      showTime={true}
                      placeholder="Select end date"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        {hasModule("woocommerce") && (
          <FormField
            control={form.control}
            name="is_sync_disable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Disable Woocommerce Sync</FormLabel>
                </div>
              </FormItem>
            )}
          />
        )}

        {(hasModule("ecommerce") || hasModule("restaurant")) && (
          <FormField
            control={form.control}
            name="is_online"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Sell Online</FormLabel>
                </div>
              </FormItem>
            )}
          />
        )}

        {hasModule("ecommerce") && (
          <FormField
            control={form.control}
            name="in_stock"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>In Stock</FormLabel>
                </div>
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="product_tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Tags</FormLabel>
              <TagInput value={field.value || []} onChange={field.onChange} placeholder="Type tag and press Enter" />
              <FormMessage />
            </FormItem>
          )}
        />

        {(hasModule("ecommerce") || hasModule("restaurant")) && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">For SEO</h3>
              <p className="text-sm text-muted-foreground">Optimize your product for search engines</p>
            </div>

            <FormField
              control={form.control}
              name="meta_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Title {isOnline && "*"}</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter meta title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="meta_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Description {isOnline && "*"}</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter meta description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div>
          <RelatedProductsSelector
            value={relatedProducts}
            onChange={setRelatedProducts}
            // Related products selector should stay open during selection
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">{isEdit ? "Update Product" : "Create Product"}</Button>
        </div>
      </form>
    </Form>
  )
}
