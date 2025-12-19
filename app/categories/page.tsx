"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CategoryForm } from "@/components/categories/category-form"
import { CategoryDataTable } from "@/components/categories/category-data-table"
import { mockCategories } from "@/lib/mock-data/categories"
import type { Category } from "@/lib/types/category"
import type { CategoryFormValues } from "@/lib/schemas/category"

export default function CategoriesPage() {
  const [categories, setCategories] = React.useState(mockCategories)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [editingCategory, setEditingCategory] = React.useState<Category | undefined>()

  const handleCreate = async (data: CategoryFormValues) => {
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      ...data,
    }
    setCategories([...categories, newCategory])
    setIsCreateDialogOpen(false)
  }

  const handleEdit = async (data: CategoryFormValues) => {
    if (!editingCategory) return
    setCategories(categories.map((c) => (c.id === editingCategory.id ? { ...c, ...data } : c)))
    setEditingCategory(undefined)
  }

  const handleDelete = async (id: string) => {
    setCategories(categories.filter((c) => c.id !== id))
  }

  const generalSettings = { modules: ["ecommerce", "woocommerce", "restaurant"] }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage your product categories</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <CategoryDataTable categories={categories} onEdit={setEditingCategory} onDelete={handleDelete} />

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>Create a new product category</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto px-1">
            <CategoryForm
              onSubmit={handleCreate}
              onCancel={() => setIsCreateDialogOpen(false)}
              generalSettings={generalSettings}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(undefined)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category information</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto px-1">
            <CategoryForm
              category={editingCategory}
              onSubmit={handleEdit}
              onCancel={() => setEditingCategory(undefined)}
              generalSettings={generalSettings}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
