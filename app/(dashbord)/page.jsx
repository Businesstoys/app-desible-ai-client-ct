// Home.tsx
'use client';
import { useState } from 'react';
import { format } from 'date-fns';
import { RefreshCcw, CalendarIcon, ChevronDown } from 'lucide-react';
import { LogTable } from '@/components/table/LogTable';
import { useCallListQuery, useCallDataExportMutation } from '@/store/api/callApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [sortBy, setSortBy] = useState('effectiveDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [attempt, setAttempt] = useState('');
  const { toast } = useToast();

  const nin = 'pending,queued,deleted,schedule';

  // Generate attempt options (1-15)
  const attemptOptions = Array.from({ length: 15 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `Attempt ${i + 1}`,
  }));

  const queryParams = {
    search,
    page,
    perPage,
    nin,
    sortBy,
    sortOrder,
    ...(attempt && { attempt }),
  };

  const { data = { data: [], meta: { total: 1 } }, isLoading, refetch } = useCallListQuery(queryParams);
  const [exportData, { isLoading: isExporting }] = useCallDataExportMutation();
  const meta = data.meta;
  const totalPages = Math.ceil(meta.total / perPage);

  const handleAttemptChange = (value) => {
    setAttempt(value === 'all' ? '' : value);
    setPage(1);
  };

  const handleExport = async () => {
    if (!dateRange.from || !dateRange.to) {
      alert("Please select a valid date range.");
      return;
    }
    try {
      const exportParams = {
        startDate: format(dateRange.from, 'yyyy-MM-dd'),
        endDate: format(dateRange.to, 'yyyy-MM-dd'),
        nin: nin + ',schedule',
        search,
        ...(attempt && { attempt }),
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
      setDialogOpen(false);
    } catch (err) {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: err?.status === 404 ? 'No call data found for this range.' : 'Please try again later.',
        status: 'error',
      });
    }
  };

  return (
    <div className="p-6 bg-muted min-h-screen space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          placeholder="Search by name, phone or status..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <Select value={attempt || 'all'} onValueChange={handleAttemptChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by attempt" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Attempts</SelectItem>
            {attemptOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 w-32 hover:bg-orange-600 text-white">Export Template</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Select Date Range to Export</DialogTitle>
              <DialogDescription>Choose a date range to export your call logs.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm">
                  {dateRange?.from && dateRange?.to
                    ? `${format(dateRange?.from, 'dd MMM yyyy')} - ${format(dateRange?.to, 'dd MMM yyyy')}`
                    : 'Select a date range'}
                </span>
              </div>
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                initialFocus
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)} className="w-full">
                  Cancel
                </Button>
                <Button
                  className="w-full"
                  disabled={!dateRange?.from || !dateRange?.to || isExporting}
                  onClick={handleExport}
                >
                  {isExporting ? 'Exporting...' : 'Apply & Download'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={refetch}>
          <RefreshCcw className="h-4 w-4 mr-1" /> Refresh Data
        </Button>
      </div>

      <LogTable
        data={data.data}
        isLoading={isLoading}
        page={page}
        perPage={perPage}
        setPage={setPage}
        totalPages={totalPages}
        setPerPage={setPerPage}
        totalRecords={meta.total}
        refetch={refetch}
        sortBy={sortBy}
        sortOrder={sortOrder}
        setSortBy={setSortBy}
        setSortOrder={setSortOrder}
      />
    </div>
  );
}