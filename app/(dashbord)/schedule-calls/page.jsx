'use client';
import { useState } from 'react';
import { RefreshCcw } from 'lucide-react';

import { useCallListQuery} from '@/store/api/callApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ScheduleLogTable } from '@/components/table/ScheduleLogTable';
export default function Page() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
   
  const queryParams = {
    search,
    page,
    perPage,
    in: 'schedule',
  };

  const {
    data = { data: [], meta: { total: 1 } },
    isLoading,
    refetch,
  } = useCallListQuery(queryParams);
  const meta = data.meta

  const totalPages = Math.ceil(meta.total / perPage);
  return (
    <div className='bg-gray-50 p-6'>
      <div className='flex flex-row justify-between mb-6'>
        <h3 className='text-2xl font-bold leading-none tracking-[-0.03em] text-[#1F2328]'>
          Schedule Calls
        </h3>
        <div className='flex flex-row gap-3'>
          <Input
            placeholder='Search by name, phone or status...'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className='border border-gray-200 bg-white w-[250px]' 
          />

          <Button
            variant='outline'
            size='sm'
            onClick={() => refetch()}
            className="h-fill-available"
          >
            <RefreshCcw size={10} />
          </Button>
        </div>
      </div>

      <ScheduleLogTable
        data={data.data}
        isLoading={isLoading}
        page={page}
        perPage={perPage}
        setPage={setPage}
        totalPages={totalPages}
        setPerPage={setPerPage}
        totalRecords={meta.total}
        refetch={refetch}
      />
    </div>
  );
}
