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
import { UnitForm } from "@/components/units/unit-form"
import { UnitDataTable } from "@/components/units/unit-data-table"
import { mockUnits } from "@/lib/mock-data/units"
import type { Unit } from "@/lib/types/unit"
import type { UnitFormValues } from "@/lib/schemas/unit"

export default function UnitsPage() {
  const [units, setUnits] = React.useState(mockUnits)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [editingUnit, setEditingUnit] = React.useState<Unit | undefined>()
  const [unitToDelete, setUnitToDelete] = React.useState<Unit | undefined>()

  const handleCreate = async (data: UnitFormValues) => {
    const newUnit: Unit = {
      id: `unit-${Date.now()}`,
      ...data,
    }
    setUnits([...units, newUnit])
    setIsCreateDialogOpen(false)
  }

  const handleEdit = async (data: UnitFormValues) => {
    if (!editingUnit) return
    setUnits(units.map((u) => (u.id === editingUnit.id ? { ...u, ...data } : u)))
    setEditingUnit(undefined)
  }

  const handleDelete = () => {
    if (!unitToDelete) return
    setUnits(units.filter((u) => u.id !== unitToDelete.id))
    setUnitToDelete(undefined)
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Units</h1>
          <p className="text-muted-foreground">Manage your units of measurement</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="mr-2 h-4 w-4" />
          Add Unit
        </Button>
      </div>

      <UnitDataTable units={units} onEdit={setEditingUnit} onDelete={(unit) => setUnitToDelete(unit)} />

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Unit</DialogTitle>
            <DialogDescription>Create a new unit of measurement</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto px-1">
            <UnitForm onSubmit={handleCreate} onCancel={() => setIsCreateDialogOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingUnit} onOpenChange={() => setEditingUnit(undefined)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Unit</DialogTitle>
            <DialogDescription>Update unit information</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto px-1">
            {editingUnit && (
              <UnitForm unit={editingUnit} onSubmit={handleEdit} onCancel={() => setEditingUnit(undefined)} />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!unitToDelete} onOpenChange={() => setUnitToDelete(undefined)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete unit?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this unit. This action cannot be undone.
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


