"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { BrandDataTable } from "@/components/brands/brand-data-table"
import { BrandForm } from "@/components/brands/brand-form"
import { mockBrands } from "@/lib/mock-data/brands"
import type { Brand } from "@/lib/types/brand"
import type { BrandFormValues } from "@/lib/schemas/brand"

export default function BrandsPage() {
  const [brands, setBrands] = React.useState<Brand[]>(mockBrands)
  const [selectedBrand, setSelectedBrand] = React.useState<Brand | undefined>()
  const [brandToDelete, setBrandToDelete] = React.useState<Brand | undefined>()
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)

  const handleCreate = async (data: BrandFormValues) => {
    const newBrand: Brand = {
      id: String(brands.length + 1),
      ...data,
    }
    setBrands([...brands, newBrand])
    setIsCreateOpen(false)
  }

  const handleEdit = async (data: BrandFormValues) => {
    if (!selectedBrand) return
    setBrands(brands.map((b) => (b.id === selectedBrand.id ? { ...b, ...data } : b)))
    setIsEditOpen(false)
    setSelectedBrand(undefined)
  }

  const handleDelete = () => {
    if (!brandToDelete) return
    setBrands(brands.filter((b) => b.id !== brandToDelete.id))
    setBrandToDelete(undefined)
  }

  const openEditDialog = (brand: Brand) => {
    setSelectedBrand(brand)
    setIsEditOpen(true)
  }

  const generalSettings = { modules: ["ecommerce"] }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brands</h1>
          <p className="text-muted-foreground">Manage your product brands</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger
            render={(props) => (
              <Button {...props}>
                <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
                Add Brand
              </Button>
            )}
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Brand</DialogTitle>
              <DialogDescription>Create a new brand for your products.</DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto px-1">
              <BrandForm
                onSubmit={handleCreate}
                onCancel={() => setIsCreateOpen(false)}
                generalSettings={generalSettings}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <BrandDataTable data={brands} onEdit={openEditDialog} onDelete={(brand) => setBrandToDelete(brand)} />

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
            <DialogDescription>Update the brand information.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto px-1">
            {selectedBrand && (
              <BrandForm
                brand={selectedBrand}
                onSubmit={handleEdit}
                onCancel={() => {
                  setIsEditOpen(false)
                  setSelectedBrand(undefined)
                }}
                generalSettings={generalSettings}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!brandToDelete} onOpenChange={() => setBrandToDelete(undefined)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete brand?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this brand. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="ghost">Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
