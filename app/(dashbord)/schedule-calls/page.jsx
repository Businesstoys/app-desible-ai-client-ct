'use client';
import { useState } from "react";
import { RefreshCcw } from "lucide-react";

import { useCallListQuery, useCallDataExportMutation } from "@/store/api/callApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ScheduleLogTable } from "@/components/table/ScheduleLogTable";

export default function Page() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);


  const queryParams = {
    search,
    page,
    perPage,
    in: 'schedule'
  };

  const { data = { data: [], meta: { total: 1 } }, isLoading, refetch } = useCallListQuery(queryParams);
  const [exportData, { isLoading: isExporting }] = useCallDataExportMutation();
  const meta = data.meta;

  const totalPages = Math.ceil(meta.total / perPage);
  return (
    <div className="p-6 bg-gray-50">
      <div className="flex flex-col space-y-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Input
            placeholder="Search by name, phone or status..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="bg-white border border-gray-200"
          />

          {/* Trigger modal export */}
          {/* <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-md transition-all duration-200">
                Export Template
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
              <DialogHeader className="pb-4">
                <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  Select Date Range to Export
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                  Choose a date range to export your template data.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <CalendarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {dateRange?.from && dateRange?.to
                      ? `${format(dateRange?.from, 'dd MMM yyyy')} - ${format(dateRange?.to, 'dd MMM yyyy')}`
                      : 'Select a date range'}
                  </span>
                </div>

                <div className="p-4 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    initialFocus
                    className="w-full"
                    classNames={{
                      months: "flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4",
                      day_selected: "bg-blue-600 text-white hover:bg-blue-700",
                      day_today: "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white",
                      day_range_middle: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",

                      // ✅ Fix navigation layout
                      nav: "absolute top-[30%] left-10 right-10 flex items-center justify-between p-2",
                      nav_button: "h-8 w-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                      nav_button_previous: "",  // ← Remove absolute positioning
                      nav_button_next: "",      // ← Remove absolute positioning
                    }}
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleExport}
                    disabled={!dateRange?.from || !dateRange?.to || isExporting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isExporting ? 'Exporting...' : 'Apply & Download'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog> */}
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => refetch()}
        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 mb-3"
      >
        Refresh Data
        <RefreshCcw size={10} />
      </Button>

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