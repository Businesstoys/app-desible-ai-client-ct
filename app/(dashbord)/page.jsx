// Home.tsx
'use client';
import { useState } from 'react'
import { RefreshCcw } from 'lucide-react'

import { useCallListQuery } from '@/store/api/callApi'

import ExportDialog from '@/components/ui/export-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LogTable } from '@/components/table/LogTable'
import DropdownSelect from '@/components/ui/dropdown';


export default function Home() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('effectiveDate');
  const [sortOrder, setSortOrder] = useState('desc')
  const [outcome, setOutcome] = useState('');

  const outcomesData = [
    { label: 'All', value: 'all' },
    { label: 'Verified', value: 'verified' },
    { label: 'Pending', value: 'pending' },
    { label: 'Review', value: 'review' },
    { label: 'Rejected', value: 'Rejected' }
  ];

  const nin = 'pending,queued,deleted,schedule';

  const queryParams = {
    search,
    page,
    perPage,
    nin,
    sortBy,
    sortOrder,
    outcome
  };

  const {
  data = { data: [], meta: { total: 1 } },
  isLoading,
  isFetching,
  refetch,
} = useCallListQuery(queryParams, { refetchOnMountOrArgChange: true });

  const loading = isLoading || isFetching;
  const meta = data.meta;
  const totalPages = Math.ceil(meta.total / perPage);

  return (
    <div className="p-6 min-h-screen space-y-4">
      <div className='flex flex-row justify-between'>
        <h3 className="text-[#1F2328] text-2xl font-bold leading-none tracking-[-0.03em]">Logs</h3>
        <div className="flex flex-row gap-3">
          <Input
            className="h-9 w-72"
            placeholder="Search by name, phone or status..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <ExportDialog search={search} nin={nin} />

          <DropdownSelect
            value={outcome}
            options={outcomesData}
            onChange={setOutcome}
            placeholder='Select Outcome'
          />
          <div className='flex justify-end'>
            <Button
              variant='outline'
              size='sm'
              className='h-9'
              onClick={refetch}
            >
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
