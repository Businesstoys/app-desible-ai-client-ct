'use client'
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Trash,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  UserX,
  Repeat,
  History,
  ArrowUpDown,
  ArrowDown,
  ArrowUp
} from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { useToast } from "@/hooks/use-toast";
import { ONGOING_CALL_STATUSES } from "@/constants";
import { useDeleteCallMutation, useHandUpCallMutation } from "@/store";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { formatDateTime } from "@/utils";
import { CallDetailsSheet } from "@/components/call-details-sheet"

const getStatusIcon = (status) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case 'in-progress':
    case 'ringing':
      return <Phone className="w-4 h-4 text-blue-600" />;
    case 'schedule':
      return <Calendar className="w-4 h-4 text-purple-600" />;
    case 'busy':
    case 'not-reachable':
    case 'no-answer':
      return <UserX className="w-4 h-4 text-yellow-600" />;
    case 'failed':
    case 'cancelled':
      return <XCircle className="w-4 h-4 text-red-600" />;
    default:
      return <Clock className="w-4 h-4 text-gray-600" />;
  }
};

const getStatusBadge = (call) => {
  const { callStatus, isClosed, maxAttemptsReached, callAttempt } = call;

  if (isClosed || maxAttemptsReached) {
    return (
      <div className="flex flex-col items-center sm:flex-row sm:items-center gap-1">
        <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Closed
        </Badge>
        <Badge variant="outline" className="text-red-600 border-red-200 mt-1 sm:mt-0 sm:ml-2">
          Max Attempts ({callAttempt}/15)
        </Badge>
      </div>
    )
  }

  const statusConfig = {
    completed: { variant: "default", className: "bg-green-100 text-green-700 hover:bg-green-100" },
    'in-progress': { variant: "default", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
    ringing: { variant: "default", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
    schedule: { variant: "default", className: "bg-purple-100 text-purple-700 hover:bg-purple-100" },
    queued: { variant: "default", className: "bg-gray-100 text-gray-700 hover:bg-gray-100" },
    initiate: { variant: "default", className: "bg-orange-100 text-orange-700 hover:bg-orange-100" },
    busy: { variant: "default", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" },
    'not-reachable': { variant: "default", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" },
    'no-answer': { variant: "default", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" },
    failed: { variant: "destructive", className: "" },
    cancelled: { variant: "destructive", className: "" },
    'hang-up': { variant: "destructive", className: "" },
  };

  const config = statusConfig[callStatus] || { variant: "secondary", className: "" };

  return (
    <div className="flex flex-col items-center gap-4 sm:items-center">
      <Badge variant={config.variant} className={`flex items-center gap-1 ${config.className}`}>
        {getStatusIcon(callStatus)}
        {callStatus}
      </Badge>
      {callAttempt > 1 && (
        <Badge
          variant="outline"
          className="text-blue-600 border-blue-200 mt-1 sm:mt-0 sm:ml-2"
        >
          <Repeat className="w-3 h-3 mr-1" />
          Attempt {callAttempt}
        </Badge>
      )}
    </div>
  );
};

function formatDuration(seconds) {
  if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes} min ${remainingSeconds} sec`
  } else {
    return `${seconds} sec`
  }
}

const SortableHeader = ({ field, label, sortBy, sortOrder, onSort, className = "" }) => {
  const isActive = sortBy === field;

  const getSortIcon = () => {
    if (!isActive) {
      return <ArrowUpDown className="w-4 h-4 text-textCustomDark group-hover:text-gray-600" />;
    }
    return sortOrder === 'asc'
      ? <ArrowUp className="w-4 h-4 text-blue-600" />
      : <ArrowDown className="w-4 h-4 text-blue-600" />;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <TableHead
            className={`
              w-40  cursor-pointer select-none group transition-all duration-200 ease-in-out
              hover:bg-blue-50/50 hover:text-blue-800 active:bg-blue-100/50
              ${isActive ? 'bg-blue-50/30 text-blue-800 font-semibold' : 'text-gray-700 font-semibold'}
              text-center
              ${className}
            `}
            onClick={() => onSort(field)}
          >
            <div className="flex items-center justify-center gap-1">
              <span className="truncate">{label}</span>
              <span className="flex-shrink-0">{getSortIcon()}</span>
            </div>
          </TableHead>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-gray-900 text-white text-xs">
          <p>
            {!isActive
              ? `Click to sort by ${label.toLowerCase()}`
              : `Currently sorted by ${label.toLowerCase()} (${sortOrder === 'asc' ? 'ascending' : 'descending'}). Click to toggle.`}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}


export function LogTable({
  data,
  page,
  setPage,
  perPage,
  setPerPage,
  totalPages,
  totalRecords,
  refetch,
  sortBy,
  sortOrder,
  setSortBy,
  setSortOrder
}) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [callData, setCallData] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [callToDelete, setCallToDelete] = useState(null);
  const [scheduleHistoryOpen, setScheduleHistoryOpen] = useState(false);
  const [selectedCallHistory, setSelectedCallHistory] = useState(null);
  const [onHangUpCall, { isLoading }] = useHandUpCallMutation()
  const [deleteCall, { isLoading: isDeleteLoading }] = useDeleteCallMutation()
  const { toast } = useToast()

  const handleMoreOptionsClick = (call) => {
    setCallData(call);
    setIsSheetOpen(true);
  };

  const handleHangUpClick = async (callId) => {
    try {
      await onHangUpCall(callId).unwrap()
      refetch()
      toast({
        title: 'Call Hung Up',
        description: `Call hung up successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to hang up call.',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteClick = (call) => {
    setCallToDelete(call);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!callToDelete || isDeleteLoading) return;

    try {
      await deleteCall(callToDelete._id).unwrap()
      refetch()
      toast({
        title: 'Deleted',
        description: 'Call deleted successfully.',
      })
    } catch (err) {
      toast({
        title: 'Error',
        description: err?.data?.message || 'Failed to delete call.',
        variant: 'destructive',
      })
    } finally {
      setDeleteDialogOpen(false);
      setCallToDelete(null);
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCallToDelete(null);
  };

  const handleSortClick = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  }


  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <div className="max-h-[67vh] overflow-y-auto [scrollbar-width:none]">
            <Table className="w-full">
              <TableHeader className="sticky top-0 z-20">  {/* no bg here */}
                <TableRow className="border-b border-gray-200">
                  <SortableHeader
                    field="effectiveDate"
                    label="Date & Time"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSortClick}
                    className="text-left"
                  />
                  <TableHead className="font-semibold text-textCustomDark w-40 bg-secondaryBackground border-b border-gray-200">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-textCustomDark w-40 bg-secondaryBackground border-b border-gray-200">
                    Phone
                  </TableHead>
                  <TableHead className="font-semibold text-textCustomDark w-40 bg-secondaryBackground border-b border-gray-200">
                    Customer
                  </TableHead>
                   <TableHead className="font-semibold text-textCustomDark w-40 bg-secondaryBackground border-b border-gray-200">
                    Duration
                  </TableHead>
                  <TableHead className="text-center font-semibold text-textCustomDark w-32 bg-secondaryBackground border-b border-gray-200">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="text-gray-500">Loading calls...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <Phone className="w-12 h-12 text-gray-300" />
                        <span className="text-gray-500 text-lg">No calls found</span>
                        <span className="text-gray-400 text-sm">Try adjusting your filters or search criteria</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.map((call, index) => (
                    <TableRow
                      key={call._id || index}
                      className={`hover:bg-gray-50 transition-colors border-b border-gray-100 ${call.isClosed || call.maxAttemptsReached ? 'bg-red-50' : ''
                        }`}
                    >
                      <TableCell className="text-center align-top py-4">
                        {(() => {
                          const { date, time } = formatDateTime(call.createdOn);
                          return (
                            <div className="flex flex-col items-center">
                              <span className="font-medium text-gray-800">{date}</span>
                              <span className="text-sm text-gray-500">{time}</span>
                            </div>
                          );
                        })()}
                      </TableCell>

                      <TableCell className="align-top py-4">
                        <div className="flex items-center justify-center gap-2">
                          {getStatusBadge(call)}
                          {call.callHistory && call.callHistory.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0 h-6 w-6 text-blue-500 hover:bg-blue-50"
                              onClick={() => {
                                setSelectedCallHistory(call);
                                setScheduleHistoryOpen(true);
                              }}
                              title="View Call History"
                            >
                              <History className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="align-top py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{call.toPhone}</span>
                          {call.fromPhone && (
                            <span className="text-xs text-gray-500">From: {call.fromPhone}</span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="align-top py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{call.studentName}</span>
                          {call?.schoolName && <span className="text-xs text-gray-500">{call?.schoolName}</span>}
                          {call?.location && <span className="text-xs text-gray-500">{call?.location}</span>}
                        </div>
                      </TableCell>

                      <TableCell className="align-top py-4">
                        <span className="text-sm text-gray-700">
                          {call?.callDuration ? formatDuration(call?.callDuration) : '-'}
                        </span>
                      </TableCell>

                      <TableCell className="align-top py-4">
                        <div className="flex items-center justify-end gap-2">
                          {call.callStatus === 'completed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMoreOptionsClick(call)}
                              className="h-8 px-3 text-xs"
                            >
                              View Details
                            </Button>
                          )}
                          {!ONGOING_CALL_STATUSES.includes(call?.callStatus) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(call)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Fixed footer (outside the scrollable table) */}
        <div className="py-4 px-6 flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 bg-gray-50 gap-4">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">{data.length > 0 ? (page - 1) * perPage + 1 : 0}</span> to{' '}
            <span className="font-medium">{Math.min(page * perPage, totalRecords)}</span> of{' '}
            <span className="font-medium">{totalRecords}</span> results
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Per page:</span>
              <select
                className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
              >
                {[10, 20, 50, 100].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <Button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page <= 1}
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="px-4 text-sm font-medium">
                {page} of {totalPages || 1}
              </div>
              <Button
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page >= totalPages || totalPages === 0}
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule History Dialog */}
      <Dialog open={scheduleHistoryOpen} onOpenChange={setScheduleHistoryOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-600">
              <History className="w-5 h-5" />
              Call History & Retry Information
            </DialogTitle>
            <DialogDescription>
              Complete call chain and retry history for this scheduled call
            </DialogDescription>
          </DialogHeader>

          {selectedCallHistory && (
            <div className="space-y-6">
              {/* Current Call Info */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Current Scheduled Call
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Customer:</span>
                    <div className="text-gray-900">{selectedCallHistory.customerName}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <div className="text-gray-900">{selectedCallHistory.toPhone}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Attempt:</span>
                    <div className="text-gray-900">{selectedCallHistory.callAttempt}/12</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <div className="text-gray-900">{selectedCallHistory.callStatus}</div>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-gray-700">Scheduled For:</span>
                    <div className="text-gray-900">
                      {new Date(selectedCallHistory.scheduledAt).toLocaleString("en-US", {
                        timeZone: "Asia/Kolkata",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Retry Information */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Repeat className="w-4 h-4" />
                  Retry Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-3 rounded border">
                    <div className="font-medium text-gray-700">Total Attempts</div>
                    <div className="text-2xl font-bold text-blue-600">{selectedCallHistory.callAttempt}</div>
                    <div className="text-xs text-gray-500">out of 12</div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="font-medium text-gray-700">Remaining</div>
                    <div className="text-2xl font-bold text-green-600">{12 - selectedCallHistory?.callAttempt}</div>
                    <div className="text-xs text-gray-500">attempts left</div>
                  </div>
                </div>
              </div>

              {/* Call Chain Information */}
              {selectedCallHistory?.callHistory.map((call, index) => (
                <div key={call._id} className="bg-white p-3 rounded border flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm">
                  <div>
                    <div className="font-medium text-gray-800">Attempt {index + 1}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(call.initiatedAt || call.createdOn).toLocaleString("en-US", {
                        timeZone: "Asia/Kolkata",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true
                      })}
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end">
                    <span className="text-sm font-semibold text-blue-700">Status: {call.callStatus}</span>
                    <span className="text-xs text-gray-600">Duration: {call.callDuration || 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <Trash className="w-5 h-5" />
              Delete Call Record
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 pt-2">
              Are you sure you want to delete this call record? This action cannot be undone and will permanently remove all associated data.
              {callToDelete && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Customer:</span>
                      <div className="text-gray-900">{callToDelete.customerName}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Phone:</span>
                      <div className="text-gray-900">{callToDelete.toPhone}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <div className="text-gray-900">{callToDelete.callStatus}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Attempts:</span>
                      <div className="text-gray-900">{callToDelete.callAttempt}/15</div>
                    </div>
                    {callToDelete.callDuration && (
                      <div className="col-span-2">
                        <span className="font-medium text-gray-700">Duration:</span>
                        <div className="text-gray-900">{callToDelete.callDuration}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel
              onClick={handleDeleteCancel}
              className="hover:bg-gray-50"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleteLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleteLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Deleting...
                </div>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <CallDetailsSheet call={callData} open={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </>
  );
}