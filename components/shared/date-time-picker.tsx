"use client"

import * as React from "react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { HugeiconsIcon } from "@hugeicons/react"
import { CalendarIcon, Clock03Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DateTimePickerProps {
  value?: Date
  onChange: (date: Date | undefined) => void
  label?: string
  showTime?: boolean
  placeholder?: string
}

export function DateTimePicker({
  value,
  onChange,
  label,
  showTime = false,
  placeholder = "Pick a date",
}: DateTimePickerProps) {
  const [time, setTime] = React.useState(value ? format(value, "HH:mm:ss") : "00:00:00")

  const handleDateSelect = (date: Date | undefined) => {
    if (date && showTime) {
      const [hours, minutes, seconds] = time.split(":")
      date.setHours(Number.parseInt(hours), Number.parseInt(minutes), Number.parseInt(seconds))
    }
    onChange(date)
  }

  const handleTimeChange = (newTime: string) => {
    setTime(newTime)
    if (value) {
      const [hours, minutes, seconds] = newTime.split(":")
      const newDate = new Date(value)
      newDate.setHours(Number.parseInt(hours), Number.parseInt(minutes), Number.parseInt(seconds))
      onChange(newDate)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("justify-start px-2.5 font-normal w-full", !value && "text-muted-foreground")}
        >
          <HugeiconsIcon icon={CalendarIcon} strokeWidth={2} data-icon="inline-start" />
          {value ? format(value, showTime ? "PPP p" : "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {showTime ? (
          <Card size="sm" className="border-0 shadow-none">
            <CardContent className="p-0">
              <Calendar mode="single" selected={value} onSelect={handleDateSelect} />
            </CardContent>
            <CardFooter className="border-t bg-card">
              <Field className="w-full">
                <FieldLabel htmlFor="time-input">Time</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="time-input"
                    type="time"
                    step="1"
                    value={time}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                  <InputGroupAddon>
                    <HugeiconsIcon icon={Clock03Icon} strokeWidth={2} className="text-muted-foreground" />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            </CardFooter>
          </Card>
        ) : (
          <Calendar mode="single" selected={value} onSelect={handleDateSelect} />
        )}
      </PopoverContent>
    </Popover>
  )
}

interface DateRangeTimePickerProps {
  value?: DateRange
  onChange: (range: DateRange | undefined) => void
  label?: string
  showTime?: boolean
  placeholder?: string
}

export function DateRangeTimePicker({
  value,
  onChange,
  label,
  showTime = false,
  placeholder = "Pick date range",
}: DateRangeTimePickerProps) {
  const [startTime, setStartTime] = React.useState("00:00:00")
  const [endTime, setEndTime] = React.useState("23:59:59")

  const handleDateSelect = (range: DateRange | undefined) => {
    if (range && showTime) {
      if (range.from) {
        const [hours, minutes, seconds] = startTime.split(":")
        range.from.setHours(Number.parseInt(hours), Number.parseInt(minutes), Number.parseInt(seconds))
      }
      if (range.to) {
        const [hours, minutes, seconds] = endTime.split(":")
        range.to.setHours(Number.parseInt(hours), Number.parseInt(minutes), Number.parseInt(seconds))
      }
    }
    onChange(range)
  }

  const handleStartTimeChange = (newTime: string) => {
    setStartTime(newTime)
    if (value?.from) {
      const [hours, minutes, seconds] = newTime.split(":")
      const newDate = new Date(value.from)
      newDate.setHours(Number.parseInt(hours), Number.parseInt(minutes), Number.parseInt(seconds))
      onChange({ ...value, from: newDate })
    }
  }

  const handleEndTimeChange = (newTime: string) => {
    setEndTime(newTime)
    if (value?.to) {
      const [hours, minutes, seconds] = newTime.split(":")
      const newDate = new Date(value.to)
      newDate.setHours(Number.parseInt(hours), Number.parseInt(minutes), Number.parseInt(seconds))
      onChange({ ...value, to: newDate })
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("justify-start px-2.5 font-normal w-full", !value?.from && "text-muted-foreground")}
        >
          <HugeiconsIcon icon={CalendarIcon} strokeWidth={2} data-icon="inline-start" />
          {value?.from ? (
            value.to ? (
              <>
                {format(value.from, showTime ? "LLL dd, y HH:mm" : "LLL dd, y")} -{" "}
                {format(value.to, showTime ? "LLL dd, y HH:mm" : "LLL dd, y")}
              </>
            ) : (
              format(value.from, showTime ? "LLL dd, y HH:mm" : "LLL dd, y")
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {showTime ? (
          <Card size="sm" className="border-0 shadow-none">
            <CardContent className="p-0">
              <Calendar mode="range" selected={value} onSelect={handleDateSelect} numberOfMonths={2} />
            </CardContent>
            <CardFooter className="border-t bg-card flex gap-4">
              <Field className="flex-1">
                <FieldLabel htmlFor="start-time">Start Time</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="start-time"
                    type="time"
                    step="1"
                    value={startTime}
                    onChange={(e) => handleStartTimeChange(e.target.value)}
                    className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                  <InputGroupAddon>
                    <HugeiconsIcon icon={Clock03Icon} strokeWidth={2} className="text-muted-foreground" />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <Field className="flex-1">
                <FieldLabel htmlFor="end-time">End Time</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="end-time"
                    type="time"
                    step="1"
                    value={endTime}
                    onChange={(e) => handleEndTimeChange(e.target.value)}
                    className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                  <InputGroupAddon>
                    <HugeiconsIcon icon={Clock03Icon} strokeWidth={2} className="text-muted-foreground" />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            </CardFooter>
          </Card>
        ) : (
          <Calendar mode="range" selected={value} onSelect={handleDateSelect} numberOfMonths={2} />
        )}
      </PopoverContent>
    </Popover>
  )
}
