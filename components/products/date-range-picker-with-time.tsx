"use client"

import * as React from "react"
import { format } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar01Icon } from "@hugeicons/core-free-icons"
import type { DateRange } from "react-day-picker"
import { Clock03Icon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateRangePickerWithTimeProps {
  value?: {
    from?: Date
    to?: Date
    startTime?: string
    endTime?: string
  }
  onChange: (value: {
    from?: Date
    to?: Date
    startTime?: string
    endTime?: string
  }) => void
  label?: string
  showTime?: boolean
}

export function DateRangePickerWithTime({
  value,
  onChange,
  label = "Select Date Range",
  showTime = true,
}: DateRangePickerWithTimeProps) {
  const [open, setOpen] = React.useState(false)
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: value?.from,
    to: value?.to,
  })
  const [startTime, setStartTime] = React.useState(value?.startTime || "09:00:00")
  const [endTime, setEndTime] = React.useState(value?.endTime || "17:00:00")

  const handleApply = () => {
    onChange({
      from: dateRange?.from,
      to: dateRange?.to,
      startTime: showTime ? startTime : undefined,
      endTime: showTime ? endTime : undefined,
    })
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("justify-start text-left font-normal w-full", !dateRange && "text-muted-foreground")}
        >
          <HugeiconsIcon icon={Calendar01Icon} strokeWidth={2} className="mr-2 h-4 w-4" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
              </>
            ) : (
              format(dateRange.from, "LLL dd, y")
            )
          ) : (
            <span>{label}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Card size="sm" className="border-0 shadow-none">
          <CardContent className="p-0">
            <Calendar
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </CardContent>
          {showTime && (
            <CardFooter className="bg-card border-t">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="time-from">Start Time</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="time-from"
                      type="time"
                      step="1"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                    <InputGroupAddon>
                      <HugeiconsIcon icon={Clock03Icon} strokeWidth={2} className="text-muted-foreground" />
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
                <Field>
                  <FieldLabel htmlFor="time-to">End Time</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="time-to"
                      type="time"
                      step="1"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                    <InputGroupAddon>
                      <HugeiconsIcon icon={Clock03Icon} strokeWidth={2} className="text-muted-foreground" />
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
              </FieldGroup>
            </CardFooter>
          )}
          <div className="flex gap-2 border-t p-2">
            <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="w-full" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
