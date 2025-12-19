"use client"

import { useRouter } from "next/navigation"
import { ProductForm } from "@/components/products/product-form"
import type { ProductFormValues } from "@/lib/schemas/product"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockProducts } from "@/lib/mock-data/products"

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const product = mockProducts.find((p) => p.id === params.id)

  const handleSubmit = (data: ProductFormValues) => {
    console.log("Update product:", data)
    // Here you would normally send the data to your API
    router.push("/products")
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
