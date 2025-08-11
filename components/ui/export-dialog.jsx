'use client'

import { useState, useMemo } from 'react'
import {
  format,
  startOfToday, endOfToday,
  subDays,
  startOfWeek, endOfWeek,
  startOfMonth, endOfMonth,
  startOfYear, endOfYear,
} from 'date-fns'
import { CalendarIcon, ChevronDown } from 'lucide-react'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'

const mkRange = (from, to) => ({ from, to })

export default function ExportDialog({ isExporting, onExport }) {
  const [open, setOpen] = useState(false)
  const [dateRange, setDateRange] = useState({ from: null, to: null })

  const presets = useMemo(() => {
    const today = startOfToday()
    const endToday = endOfToday()

    return [
      { key: 'today',      label: 'Today',         value: mkRange(today, endToday) },
      { key: 'last7',      label: 'Last 7 Days',   value: mkRange(subDays(endToday, 6), endToday) },
      { key: 'thisWeek',   label: 'This Week',     value: mkRange(startOfWeek(today, { weekStartsOn: 1 }), endOfWeek(today, { weekStartsOn: 1 })) },
      { key: 'thisMonth',  label: 'This Month',    value: mkRange(startOfMonth(today), endOfMonth(today)) },
      { key: 'thisYear',   label: 'This Year',     value: mkRange(startOfYear(today), endOfYear(today)) },
    ]
  }, [])

  const handleApply = () => {
    if (!dateRange.from || !dateRange.to) return
    onExport(dateRange)
    setOpen(false)
  }

  const isActivePreset = (preset) =>
    dateRange?.from &&
    dateRange?.to &&
    format(preset.value.from, 'yyyy-MM-dd') === format(dateRange.from, 'yyyy-MM-dd') &&
    format(preset.value.to, 'yyyy-MM-dd') === format(dateRange.to, 'yyyy-MM-dd')

  const isCustomRange =
    dateRange?.from &&
    dateRange?.to &&
    !presets.some((p) => isActivePreset(p))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary w-fit hover:bg-primary-hover text-white flex items-center justify-center gap-2">
          Export Template
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="tracking-tight">Select Date Range to Export</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Choose a range or pick dates on the calendar.
          </DialogDescription>
        </DialogHeader>

        {/* Selected range summary */}
        <div className="flex items-center gap-2 text-sm font-medium text-foreground border border-border bg-accent px-3 py-2">
          <CalendarIcon className="w-5 h-5 text-muted-foreground" />
          <span>
            {dateRange?.from && dateRange?.to
              ? `${format(dateRange.from, 'dd MMM yyyy')} – ${format(dateRange.to, 'dd MMM yyyy')}`
              : 'Select a date range'}
          </span>
          {isCustomRange && (
            <span className="ml-auto text-xs px-2 py-0.5 bg-primary text-white uppercase tracking-wide">
              Custom
            </span>
          )}
        </div>

        {/* Preset toolbar - square buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {presets.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setDateRange(p.value)}
              className={[
                "px-3 py-2 text-sm font-medium border text-center transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                isActivePreset(p)
                  ? "bg-primary text-white border-transparent"
                  : "bg-white text-foreground border-border hover:bg-accent",
              ].join(' ')}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Calendar container */}
        <div className="border border-border bg-white shadow-sm">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
            initialFocus
            className="mx-auto"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setDateRange({ from: null, to: null })
              setOpen(false)
            }}
            className="w-full"
          >
            Cancel
          </Button>
          <Button
            className="w-full bg-primary hover:bg-primary-hover"
            disabled={!dateRange?.from || !dateRange?.to || isExporting}
            onClick={handleApply}
          >
            {isExporting ? 'Exporting…' : 'Apply & Download'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}