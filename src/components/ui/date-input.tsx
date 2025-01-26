"use client"

import { format, isValid } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import React from "react"

interface DateInputProps {
  value: Date | null
  onChange: (date: Date | null, rawValue?: string) => void
  label: string
  error?: string | null
}

export function DateInput({ value, onChange, error: externalError }: DateInputProps) {
  const [inputValue, setInputValue] = React.useState("")
  const [errorState, setError] = React.useState<string | null>(null)

  // Only update input value when value is explicitly set from parent
  React.useEffect(() => {
    if (value && isValid(value)) {
      setInputValue(format(value, "dd/MM/yyyy"))
      setError(null)
    } else if (value === null && !inputValue) {
      setInputValue("")
      setError(null)
    }
  }, [value, inputValue])

  // Update error state when external error changes
  React.useEffect(() => {
    setError(externalError || null)
  }, [externalError])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    
    // Pass both the raw value and null date to parent
    onChange(null, newValue)
    setError(null)
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="DD/MM/YYYY"
          className={cn(
            "flex-1",
            errorState && "border-red-500 focus-visible:ring-red-500"
          )}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "px-2",
                !value && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={value || undefined}
              onSelect={(date) => {
                if (date) {
                  const formatted = format(date, "dd/MM/yyyy")
                  setInputValue(formatted)
                  onChange(date, formatted)
                } else {
                  setInputValue("")
                  onChange(null, "")
                }
              }}
              initialFocus
              fromYear={2020}
              toYear={2030}
            />
          </PopoverContent>
        </Popover>
      </div>
      {errorState && (
        <p className="text-sm text-red-500">{errorState}</p>
      )}
    </div>
  )
}
