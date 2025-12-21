"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ProductForm } from "@/components/products/product-form"
import { SubmittedData } from "@/components/products/submitted-data"
import type { ProductFormValues } from "@/lib/schemas/product"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockProducts } from "@/lib/mock-data/products"

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const product = mockProducts.find((p) => p.id === id)

  const handleSubmit = (data: ProductFormValues) => {
    console.log("Update product:", data)
    // Here you would normally send the data to your API
    
    // Show toast with submitted data
    toast.success("Product updated successfully!", {
      description: <SubmittedData data={data} />,
      duration: 10000,
    })
    
    // router.push("/products")
  }

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Update Product</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm initialData={product} onSubmit={handleSubmit} isEdit />
        </CardContent>
      </Card>
    </div>
  )
}
