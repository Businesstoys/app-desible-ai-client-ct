'use client';

import { useState, useMemo } from 'react';
import {
  format,
  startOfToday,
  endOfToday,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from 'date-fns';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useCallDataExportMutation } from '@/store';
import { showErrorToast } from './toast';

const mkRange = (from, to) => ({ from, to });

export default function ExportDialog({ search, nin }) {
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [exportData, { isLoading: isExporting }] = useCallDataExportMutation();
  const presets = useMemo(() => {
    const today = startOfToday();
    const endToday = endOfToday();

    return [
      { key: 'today', label: 'Today', value: mkRange(today, endToday) },
      {
        key: 'last7',
        label: 'Last 7 Days',
        value: mkRange(subDays(endToday, 6), endToday),
      },
      {
        key: 'thisWeek',
        label: 'This Week',
        value: mkRange(
          startOfWeek(today, { weekStartsOn: 1 }),
          endOfWeek(today, { weekStartsOn: 1 }),
        ),
      },
      {
        key: 'thisMonth',
        label: 'This Month',
        value: mkRange(startOfMonth(today), endOfMonth(today)),
      },
      {
        key: 'thisYear',
        label: 'This Year',
        value: mkRange(startOfYear(today), endOfYear(today)),
      },
    ];
  }, []);

  const handleApply = () => {
    if (!dateRange.from || !dateRange.to) return;
    // onExport(dateRange)
    handleExport();
    setOpen(false);
  };

  const isActivePreset = (preset) =>
    dateRange?.from &&
    dateRange?.to &&
    format(preset.value.from, 'yyyy-MM-dd') ===
    format(dateRange.from, 'yyyy-MM-dd') &&
    format(preset.value.to, 'yyyy-MM-dd') ===
    format(dateRange.to, 'yyyy-MM-dd');

  const isCustomRange =
    dateRange?.from && dateRange?.to && !presets.some((p) => isActivePreset(p));

  const handleExport = async () => {
    if (!dateRange.from || !dateRange.to) {
      alert('Please select a valid date range.');
      return;
    }
    try {
      const exportParams = {
        startDate: format(dateRange.from, 'yyyy-MM-dd'),
        endDate: format(dateRange.to, 'yyyy-MM-dd'),
        nin: nin + 'schedule',
        search,
        // ...(attempt && { attempt }),
      };

      const response = await exportData(exportParams).unwrap();

      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `call_logs_export_${format(dateRange.from, 'dd-MM-yy')}_to_${format(dateRange.to, 'dd-MM-yy')}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      showErrorToast('Uh oh! Something went wrong', {
        description:
          err?.status === 404
            ? 'No call data found for this range.'
            : 'Please try again later.',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='flex w-fit items-center justify-center gap-2 bg-primary text-white hover:bg-primary-hover'>
          Export Template
          <ChevronDown className='h-4 w-4' />
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='tracking-tight'>
            Select Date Range to Export
          </DialogTitle>
          <DialogDescription className='text-sm text-muted-foreground'>
            Choose a range or pick dates on the calendar.
          </DialogDescription>
        </DialogHeader>

        {/* Selected range summary */}
        <div className='flex items-center gap-2 border border-border bg-accent px-3 py-2 text-sm font-medium text-foreground'>
          <CalendarIcon className='h-5 w-5 text-muted-foreground' />
          <span>
            {dateRange?.from && dateRange?.to
              ? `${format(dateRange.from, 'dd MMM yyyy')} – ${format(dateRange.to, 'dd MMM yyyy')}`
              : 'Select a date range'}
          </span>
          {isCustomRange && (
            <span className='ml-auto bg-primary px-2 py-0.5 text-xs uppercase tracking-wide text-white'>
              Custom
            </span>
          )}
        </div>

        {/* Preset toolbar - square buttons */}
        <div className='grid grid-cols-2 gap-2 sm:grid-cols-5'>
          {presets?.map((p) => (
            <button
              key={p.key}
              type='button'
              onClick={() => setDateRange(p.value)}
              className={[
                'border px-3 py-2 text-center text-sm font-medium transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                isActivePreset(p)
                  ? 'border-transparent bg-primary text-white'
                  : 'border-border bg-white text-foreground hover:bg-accent',
              ].join(' ')}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Calendar container */}
        <div className='border border-border bg-white shadow-sm'>
          <Calendar
            mode='range'
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
            initialFocus
            className='mx-auto'
          />
        </div>

        {/* Actions */}
        <div className='flex gap-2'>
          <Button
            variant='outline'
            onClick={() => {
              setDateRange({ from: null, to: null });
              setOpen(false);
            }}
            className='w-full'
          >
            Cancel
          </Button>
          <Button
            className='w-full bg-primary hover:bg-primary-hover'
            disabled={!dateRange?.from || !dateRange?.to || isExporting}
            onClick={handleApply}
          >
            {isExporting ? 'Exporting…' : 'Apply & Download'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
