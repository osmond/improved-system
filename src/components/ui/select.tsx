"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import {
  Check,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value
const SelectTrigger = SelectPrimitive.Trigger
const SelectPortal = SelectPrimitive.Portal
const SelectViewport = SelectPrimitive.Viewport
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
  SelectPortal,
  SelectViewport,
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
  multiple = false,
}: {
  value: string | string[]
  onValueChange: (val: any) => void
  options: { value: string; label: string }[]
  label?: string
  multiple?: boolean
}) {
  const lastIndex = React.useRef<number | null>(null)
  const selectedValues = Array.isArray(value) ? value : [value]
  const display = multiple
    ? options
        .filter((o) => selectedValues.includes(o.value))
        .map((o) => o.label)
        .join(", ") || "Select options"
    : undefined
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium" htmlFor="simple-select">
          {label}
        </label>
      )}
      <Select
        value={multiple ? "" : (value as string)}
        onValueChange={(val) => {
          if (!multiple) onValueChange(val)
        }}
      >
        <SelectTrigger
          id="simple-select"
          className="inline-flex items-center justify-between rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2"
          aria-label={label}
        >
          {multiple ? (
            <span className="truncate">{display}</span>
          ) : (
            <SelectValue placeholder="Select an option" />
          )}
          <SelectIcon asChild>
            <ChevronsUpDown className="w-4 h-4 opacity-50" />
          </SelectIcon>
        </SelectTrigger>
        <SelectPortal>
          <SelectContent className="overflow-hidden rounded-md border bg-card z-[60]">
            <SelectScrollUpButton className="flex items-center justify-center h-6">
              <ChevronUp className="w-4 h-4" />
            </SelectScrollUpButton>
            <SelectViewport>
              <SelectGroup>
                {options.map((opt, idx) => {
                  const isSelected = selectedValues.includes(opt.value)
                  return (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      onMouseDown={(e) => {
                        if (!multiple) return
                        e.preventDefault()
                        let next = [...selectedValues]
                        if (e.shiftKey && lastIndex.current !== null) {
                          const [start, end] =
                            idx > lastIndex.current
                              ? [lastIndex.current, idx]
                              : [idx, lastIndex.current]
                          const range = options
                            .slice(start, end + 1)
                            .map((o) => o.value)
                          range.forEach((v) => {
                            if (!next.includes(v)) next.push(v)
                          })
                        } else if (e.ctrlKey || e.metaKey) {
                          if (next.includes(opt.value)) {
                            next = next.filter((v) => v !== opt.value)
                          } else {
                            next.push(opt.value)
                          }
                          lastIndex.current = idx
                        } else {
                          next = [opt.value]
                          lastIndex.current = idx
                        }
                        onValueChange(next)
                      }}
                      onSelect={(e) => {
                        if (multiple) e.preventDefault()
                      }}
                      className={cn(
                        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1 text-sm outline-none focus:bg-muted",
                        multiple && isSelected ? "bg-muted" : "",
                      )}
                    >
                      <SelectItemText>{opt.label}</SelectItemText>
                      {(!multiple || isSelected) && (
                        <SelectItemIndicator className="absolute left-0 inline-flex w-6 items-center justify-center">
                          <Check className="w-4 h-4" />
                        </SelectItemIndicator>
                      )}
                    </SelectItem>
                  )
                })}
              </SelectGroup>
            </SelectViewport>
            <SelectScrollDownButton className="flex items-center justify-center h-6">
              <ChevronDown className="w-4 h-4" />
            </SelectScrollDownButton>
          </SelectContent>
        </SelectPortal>
      </Select>
    </div>
  )
}
