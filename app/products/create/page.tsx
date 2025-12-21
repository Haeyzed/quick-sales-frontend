"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ProductForm } from "@/components/products/product-form"
import { SubmittedData } from "@/components/products/submitted-data"
import type { ProductFormValues } from "@/lib/schemas/product"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreateProductPage() {
  const router = useRouter()

  const handleSubmit = (data: ProductFormValues) => {
    console.log("Create product:", data)
    // Here you would normally send the data to your API
    
    // Show toast with submitted data
    toast.success("Product created successfully!", {
      description: <SubmittedData data={data} />,
      duration: 10000,
    })
    
    // router.push("/products")
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  )
}
