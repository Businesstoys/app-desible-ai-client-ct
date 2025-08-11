// Home.tsx
'use client';
import { useState } from 'react'
import { format } from 'date-fns'
import { RefreshCcw } from 'lucide-react'
import { useCallListQuery, useCallDataExportMutation } from '@/store/api/callApi'

import { useToast } from '@/hooks/use-toast';
import ExportDialog from '@/components/ui/export-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LogTable } from '@/components/table/LogTable'


export default function Home() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [sortBy, setSortBy] = useState('effectiveDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [attempt, setAttempt] = useState('');
  const { toast } = useToast();

  const nin = 'pending,queued,deleted,schedule';


  const queryParams = {
    search,
    page,
    perPage,
    nin,
    sortBy,
    sortOrder,
    ...(attempt && { attempt }),
  };

  const {
  data = { data: [], meta: { total: 1 } },
  isLoading,
  isFetching,
  refetch,
} = useCallListQuery(queryParams, { refetchOnMountOrArgChange: true });

const loading = isLoading || isFetching;
  const [exportData, { isLoading: isExporting }] = useCallDataExportMutation()
  const meta = data.meta;
  const totalPages = Math.ceil(meta.total / perPage);

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
    } catch (err) {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: err?.status === 404 ? 'No call data found for this range.' : 'Please try again later.',
        status: 'error',
      });
    }
  }

  return (
    <div className="p-6 min-h-screen space-y-4">
      <div className='flex flex-row justify-between'>
        <h3 className="text-[#1F2328] text-2xl font-bold leading-none tracking-[-0.03em]">Logs</h3>
        <div className="flex flex-row gap-3">
          <Input
            className="h-9"
            placeholder="Search by name, phone or status..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <ExportDialog
            isExporting={isExporting}
            onExport={(range) => {
              setDateRange(range)
              handleExport()
            }}
          />

          <div className="flex justify-end">
            <Button variant="outline" size="sm" className="h-9" onClick={refetch}>
              <RefreshCcw />
            </Button>
          </div>
        </div>
      </div>


      <LogTable
        data={data.data}
        isLoading={loading}
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