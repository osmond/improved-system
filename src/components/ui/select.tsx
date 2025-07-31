"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value
const SelectTrigger = SelectPrimitive.Trigger
const SelectContent = SelectPrimitive.Content
const SelectItem = SelectPrimitive.Item
const SelectLabel = SelectPrimitive.Label
const SelectSeparator = SelectPrimitive.Separator
const SelectIcon = SelectPrimitive.Icon
const SelectItemText = SelectPrimitive.ItemText
const SelectItemIndicator = SelectPrimitive.ItemIndicator
const SelectScrollUpButton = SelectPrimitive.ScrollUpButton
const SelectScrollDownButton = SelectPrimitive.ScrollDownButton

export type SelectProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectIcon,
  SelectItemText,
  SelectItemIndicator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}

export function SimpleSelect({
  value,
  onValueChange,
  options,
  label,
}: {
  value: string
  onValueChange: (val: string) => void
  options: { value: string; label: string }[]
  label?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium" htmlFor="simple-select">
          {label}
        </label>
      )}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          id="simple-select"
          className="inline-flex items-center justify-between rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2"
          aria-label={label}
        >
          <SelectValue placeholder="Select an option" />
          <SelectIcon>
            <ChevronDown className="w-4 h-4" />
          </SelectIcon>
        </SelectTrigger>
        <SelectContent className="overflow-hidden rounded-md border bg-card">
          <SelectScrollUpButton className="flex items-center justify-center h-6">
            ▲
          </SelectScrollUpButton>
          <SelectGroup>
            {options.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1 text-sm outline-none focus:bg-muted"
              >
                <SelectItemText>{opt.label}</SelectItemText>
                <SelectItemIndicator className="absolute left-0 inline-flex w-6 items-center justify-center">
                  <Check className="w-4 h-4" />
                </SelectItemIndicator>
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectScrollDownButton className="flex items-center justify-center h-6">
            ▼
          </SelectScrollDownButton>
        </SelectContent>
      </Select>
    </div>
  )
}
