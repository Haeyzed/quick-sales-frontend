"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { TaxForm } from "@/components/taxes/tax-form"
import { TaxDataTable } from "@/components/taxes/tax-data-table"
import { mockTaxes } from "@/lib/mock-data/taxes"
import type { Tax } from "@/lib/types/tax"
import type { TaxFormValues } from "@/lib/schemas/tax"

export default function TaxesPage() {
  const [taxes, setTaxes] = React.useState(mockTaxes)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [editingTax, setEditingTax] = React.useState<Tax | undefined>()
  const [taxToDelete, setTaxToDelete] = React.useState<Tax | undefined>()

  const handleCreate = async (data: TaxFormValues) => {
    const newTax: Tax = {
      id: `tax-${Date.now()}`,
      ...data,
    }
    setTaxes([...taxes, newTax])
    setIsCreateDialogOpen(false)
  }

  const handleEdit = async (data: TaxFormValues) => {
    if (!editingTax) return
    setTaxes(taxes.map((t) => (t.id === editingTax.id ? { ...t, ...data } : t)))
    setEditingTax(undefined)
  }

  const handleDelete = () => {
    if (!taxToDelete) return
    setTaxes(taxes.filter((t) => t.id !== taxToDelete.id))
    setTaxToDelete(undefined)
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Taxes</h1>
          <p className="text-muted-foreground">Manage your tax rates</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="mr-2 h-4 w-4" />
          Add Tax
        </Button>
      </div>

      <TaxDataTable taxes={taxes} onEdit={setEditingTax} onDelete={(tax) => setTaxToDelete(tax)} />

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Tax</DialogTitle>
            <DialogDescription>Create a new tax rate</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto px-1">
            <TaxForm onSubmit={handleCreate} onCancel={() => setIsCreateDialogOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingTax} onOpenChange={() => setEditingTax(undefined)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Tax</DialogTitle>
            <DialogDescription>Update tax information</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto px-1">
            {editingTax && (
              <TaxForm tax={editingTax} onSubmit={handleEdit} onCancel={() => setEditingTax(undefined)} />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!taxToDelete} onOpenChange={() => setTaxToDelete(undefined)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete tax?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this tax. This action cannot be undone.
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



