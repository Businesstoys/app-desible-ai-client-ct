'use client'
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, RefreshCcw, Trash, Pause, Play } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  useUpdateCallStatusMutation,
  useCallListQuery,
  useGetQueueStatusQuery,
  useStartQueueMutation,
  useStopQueueMutation
} from "@/store"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { showErrorToast, showSuccessToast } from "@/components/ui/toast"

export default function Page() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [selectedRows, setSelectedRows] = useState([])

  // Call queue status hooks
  const { data: queueStatusData, refetch: refetchQueueStatus, isLoading: isQueueStatusLoading } = useGetQueueStatusQuery()
  const [startQueue, { isLoading: isStartingQueue }] = useStartQueueMutation()
  const [stopQueue, { isLoading: isStoppingQueue }] = useStopQueueMutation()

  const { data = { data: [], meta: { total: 0 } }, refetch, isLoading } =
    useCallListQuery(
      { in: 'queued', page, perPage },
      {
        refetchOnFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        keepUnusedDataFor: 0,
        staleTime: 0,
      }
    )

  const [updateStatus, { isSuccess: isUpdateSuccess }] = useUpdateCallStatusMutation()
  const totalRecords = data.meta.total
  const totalPages = Math.ceil(totalRecords / perPage)

  useEffect(() => {
    setSelectedRows([])
  }, [page, perPage])

  useEffect(() => {
    refetch()
  }, [refetch])

  useEffect(() => {
    if (isUpdateSuccess) {
      refetch()
      setSelectedRows([])
    }
  }, [isUpdateSuccess, refetch])

  const handleQueueStatusChange = async (actionFn, successMsg) => {
    try {
      await actionFn().unwrap()
      showSuccessToast("Success", {
        description: successMsg
      })
      refetchQueueStatus()
    } catch {
      showErrorToast("Error", {
        description: 'Queue status update failed.',
      })

    }
  }

  const handleCheckboxChange = (_id) => {
    setSelectedRows((prev) =>
      prev.includes(_id) ? prev.filter((id) => id !== _id) : [...prev, _id]
    )
  }

  const handleSelectAll = () => {
    if (selectedRows.length === data.data.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(data.data.map((call) => call._id))
    }
  }

  const handleUpdateCallStatus = async (ids) => {
    try {
      await updateStatus({ ids, status: 'pending' }).unwrap()
      showSuccessToast("Updated", {
        description: `${ids.length} call(s) moved to pending status.`,
      })
    } catch (err) {
      showErrorToast('Error', {
        description: 'Failed to update call status.'
      })
    }
  }

  const isQueueRunning = queueStatusData?.isQueueRunning

  return (
    <div className="w-full h-full p-6 bg-gray-50 rounded-lg shadow-sm">
      <div className="flex items-center justify-between border-b-2 border-gray-200 pb-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Queued Calls</h1>
          <p className="text-sm text-gray-600">
            Manage and monitor all your queued calls
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleUpdateCallStatus(selectedRows)}
                  disabled={selectedRows.length === 0}
                  className="flex items-center gap-1"
                >
                  <Trash size={16} />
                  <span>Remove Selected ({selectedRows.length})</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Removes calls from queue and moves them to pending status</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isQueueRunning ? "secondary" : "success"}
                  size="sm"
                  className="flex items-center gap-1 bg-inherit rounded-md border w-max"
                  onClick={() =>
                    isQueueRunning
                      ? handleQueueStatusChange(stopQueue, "Queue stopped.")
                      : handleQueueStatusChange(startQueue, "Queue started.")
                  }
                  disabled={isQueueStatusLoading || isStartingQueue || isStoppingQueue}
                >
                  {isQueueRunning ? (
                    <>
                      <Pause size={16} /> <span>Stop Queue</span>
                    </>
                  ) : (
                    <>
                      <Play size={16} /> <span>Start Queue</span>
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isQueueRunning ? "Stop queue and prevent new calls from processing" : "Start the queue"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
          >
            <RefreshCcw size={10} />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto min-h-[45vh] max-h-[52vh] overflow-scroll [scrollbar-width:none]">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className=" w-12 font-semibold text-textCustomDark bg-secondaryBackground border-b border-gray-200">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounvded border-gray-300 text-primary focus:ring-primary"
                    checked={
                      data.data.length > 0 &&
                      selectedRows.length === data.data.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="font-semibold text-textCustomDark w-40 bg-secondaryBackground border-b border-gray-200">To Phone</TableHead>
                <TableHead className="font-semibold text-textCustomDark w-40 bg-secondaryBackground border-b border-gray-200">Account Name</TableHead>
                <TableHead className="font-semibold text-textCustomDark w-40 bg-secondaryBackground border-b border-gray-200" >Driver Name</TableHead>
                <TableHead className="font-semibold text-textCustomDark w-40 bg-secondaryBackground border-b border-gray-200" >Shipment Number</TableHead>
                <TableHead className="font-semibold text-textCustomDark w-40 bg-secondaryBackground border-b border-gray-200" ></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : data.data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-gray-500"
                  >
                    No queued calls found.
                  </TableCell>
                </TableRow>
              ) : (
                data.data.map((call) => (
                  <TableRow key={call._id} className="hover:bg-gray-50">
                    <TableCell>
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={selectedRows.includes(call._id)}
                        onChange={() => handleCheckboxChange(call._id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{call.toPhone}</TableCell>
                    <TableCell>{call.accountName}</TableCell>
                    <TableCell>{call.driverName}</TableCell>
                    <TableCell className='text-center' >{call.shipmentNumber}</TableCell>
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateCallStatus([call._id])}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash size={16} className="mr-1" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remove from queue and move to pending</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="py-4 px-6 flex justify-between items-center border-t border-gray-100 bg-white">
          <div className="text-sm text-gray-600">
            Showing {data.data.length > 0 ? (page - 1) * perPage + 1 : 0} to{' '}
            {Math.min(page * perPage, totalRecords)} of {totalRecords} results
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Per page:</span>
              <select
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value))
                  setPage(1)
                }}
              >
                {[10, 20, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <Button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page <= 1}
                size="icon"
                variant="outline"
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="px-3 text-sm">
                {page} / {totalPages || 1}
              </div>
              <Button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page >= totalPages || totalPages === 0}
                size="icon"
                variant="outline"
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}