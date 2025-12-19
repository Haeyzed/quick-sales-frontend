"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HugeiconsIcon } from "@hugeicons/react"
import { Upload01Icon, Cancel01Icon, DragDrop01Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

interface UploadedFile {
  id: string
  file: File
  preview: string
}

export default function GalleryImagePage() {
  const [name, setName] = useState("")
  const [mobile, setMobile] = useState("")
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      const droppedFiles = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))

      if (droppedFiles.length === 0) {
        toast.error("Invalid files", {
            description: "Please upload only image files"
          }
        )
        return
      }

      const newFiles: UploadedFile[] = droppedFiles.map((file) => ({
        id: Math.random().toString(36).substring(7),
        file,
        preview: URL.createObjectURL(file),
      }))

      setFiles([...files, ...newFiles])
    },
    [files, toast],
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter((file) => file.type.startsWith("image/"))

    if (selectedFiles.length === 0) return

    const newFiles: UploadedFile[] = selectedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
    }))

    setFiles([...files, ...newFiles])
  }

  const removeFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !mobile) {
      toast.error("Validation Error", {
          description: "Please fill in all required fields"
        }
      )
      return
    }

    if (mobile.length < 7) {
      toast.error("Invalid Mobile", {
          description: "Mobile number must be at least 7 digits"
        }
      )
      return
    }

    console.log("Uploading:", { name, mobile, files })

    toast.success("Success", {
        description: "Images uploaded successfully"
      }
    )

    // Reset form
    setName("")
    setMobile("")
    setFiles([])
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Upload Gallery Images</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile *</Label>
              <Input
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter mobile number"
                required
                minLength={7}
              />
            </div>

            <div className="space-y-2">
              <Label>Upload Images</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
              >
                <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Drop your images here, or{" "}
                  <label htmlFor="file-upload" className="text-primary cursor-pointer hover:underline">
                    browse
                  </label>
                </p>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handleFileInput}
                />
                <p className="text-xs text-muted-foreground">Supports: JPG, PNG, GIF (max 12MB each)</p>
              </div>
            </div>

            {/* Preview uploaded images */}
            {files.length > 0 && (
              <div className="space-y-2">
                <Label>Uploaded Images ({files.length})</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {files.map((file) => (
                    <div key={file.id} className="relative group border rounded-lg overflow-hidden">
                      <img
                        src={file.preview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeFile(file.id)}
                        >
                          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="h-4 w-4" />
                        </Button>
                        <div className="cursor-move">
                          <HugeiconsIcon icon={DragDrop01Icon} strokeWidth={2} className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="p-2 bg-background">
                        <p className="text-xs truncate">{file.file.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Drag images to reorder</p>
              </div>
            )}

            <Button type="submit" size="lg">
              Save
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
