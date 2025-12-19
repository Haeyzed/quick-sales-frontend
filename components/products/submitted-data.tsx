"use client"

import { cn } from "@/lib/utils"

interface SubmittedDataProps {
  data: unknown
  className?: string
}

export function SubmittedData({ data, className }: SubmittedDataProps) {
  return (
    <pre
      className={cn(
        "max-h-[400px] overflow-auto rounded-md bg-muted p-4 text-sm",
        className
      )}
    >
      {JSON.stringify(data, null, 2)}
    </pre>
  )
}

