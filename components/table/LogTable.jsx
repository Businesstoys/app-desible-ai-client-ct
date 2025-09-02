'use client';
import { useState } from 'react';
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
  ArrowUp,
} from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { ONGOING_CALL_STATUSES } from '@/constants';
import { useDeleteCallMutation, useHandUpCallMutation } from '@/store';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { formatDateTime } from '@/utils';
import { CallDetailsSheet } from '@/components/call-details-sheet';
import { formatDuration } from '@/utils/format-duration';
import { ReviewIcon } from '@/public/svg/ReviewIcon';
import { VerifiedIcon } from '@/public/svg/VerifiedIcon';
import { showErrorToast, showSuccessToast } from '../ui/toast';

const getStatusIcon = (status) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className='h-4 w-4 text-green-600' />;
    case 'in-progress':
    case 'ringing':
      return <Phone className='h-4 w-4 text-blue-600' />;
    case 'schedule':
      return <Calendar className='h-4 w-4 text-purple-600' />;
    case 'busy':
    case 'not-reachable':
    case 'no-answer':
      return <UserX className='h-4 w-4 text-yellow-600' />;
    case 'failed':
    case 'cancelled':
      return <XCircle className='h-4 w-4 text-red-600' />;
    default:
      return <Clock className='h-4 w-4 text-gray-600' />;
  }
};

const getStatusBadge = (call) => {
  const { callStatus, isClosed, maxAttemptsReached, callAttempt } = call;

  if (isClosed || maxAttemptsReached) {
    return (
      <div className='flex flex-col items-center gap-1 sm:flex-row sm:items-center'>
        <Badge variant='destructive' className='flex items-center gap-1'>
          <XCircle className='h-3 w-3' />
          Closed
        </Badge>
        <Badge
          variant='outline'
          className='mt-1 border-red-200 text-red-600 sm:ml-2 sm:mt-0'
        >
          Max Attempts ({callAttempt}/15)
        </Badge>
      </div>
    );
  }

  const statusConfig = {
    completed: {
      variant: 'default',
      className: 'bg-green-100 text-green-700 hover:bg-green-100',
    },
    'in-progress': {
      variant: 'default',
      className: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
    },
    ringing: {
      variant: 'default',
      className: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
    },
    schedule: {
      variant: 'default',
      className: 'bg-purple-100 text-purple-700 hover:bg-purple-100',
    },
    queued: {
      variant: 'default',
      className: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
    },
    initiate: {
      variant: 'default',
      className: 'bg-orange-100 text-orange-700 hover:bg-orange-100',
    },
    busy: {
      variant: 'default',
      className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
    },
    'not-reachable': {
      variant: 'default',
      className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
    },
    'no-answer': {
      variant: 'default',
      className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
    },
    failed: { variant: 'destructive', className: '' },
    cancelled: { variant: 'destructive', className: '' },
    'hang-up': { variant: 'destructive', className: '' },
  };

  const config = statusConfig[callStatus] || {
    variant: 'secondary',
    className: '',
  };

  return (
    <div className='flex flex-col items-center gap-4 sm:items-center'>
      <Badge
        variant={config.variant}
        className={`flex items-center gap-1 ${config.className}`}
      >
        {getStatusIcon(callStatus)}
        {callStatus}
      </Badge>
      {callAttempt > 1 && (
        <Badge
          variant='outline'
          className='mt-1 border-blue-200 text-blue-600 sm:ml-2 sm:mt-0'
        >
          <Repeat className='mr-1 h-3 w-3' />
          Attempt {callAttempt}
        </Badge>
      )}
    </div>
  );
};

const SortableHeader = ({
  field,
  label,
  sortBy,
  sortOrder,
  onSort,
  className = '',
}) => {
  const isActive = sortBy === field;

  const getSortIcon = () => {
    if (!isActive) {
      return (
        <ArrowUpDown className='h-4 w-4 text-textCustomDark group-hover:text-gray-600' />
      );
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className='h-4 w-4 text-blue-600' />
    ) : (
      <ArrowDown className='h-4 w-4 text-blue-600' />
    );
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <TableHead
            className={`group w-40 cursor-pointer select-none transition-all duration-200 ease-in-out hover:bg-blue-50/50 hover:text-blue-800 active:bg-blue-100/50 ${isActive ? 'bg-blue-50/30 font-semibold text-blue-800' : 'font-semibold text-gray-700'} text-center ${className} `}
            onClick={() => onSort(field)}
          >
            <div className='flex items-center justify-center gap-1'>
              <span className='truncate'>{label}</span>
              <span className='flex-shrink-0'>{getSortIcon()}</span>
            </div>
          </TableHead>
        </TooltipTrigger>
        <TooltipContent side='top' className='bg-gray-900 text-xs text-white'>
          <p>
            {!isActive
              ? `Click to sort by ${label.toLowerCase()}`
              : `Currently sorted by ${label.toLowerCase()} (${sortOrder === 'asc' ? 'ascending' : 'descending'}). Click to toggle.`}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

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
  setSortOrder,
}) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [callData, setCallData] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [callToDelete, setCallToDelete] = useState(null);
  const [scheduleHistoryOpen, setScheduleHistoryOpen] = useState(false);
  const [selectedCallHistory, setSelectedCallHistory] = useState(null);

  const [deleteCall, { isLoading }] = useDeleteCallMutation();

  const handleMoreOptionsClick = (call) => {
    setCallData(call);
    setIsSheetOpen(true);
  };

  const handleDeleteClick = (call) => {
    setCallToDelete(call);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!callToDelete || isLoading) return;

    try {
      await deleteCall(callToDelete._id).unwrap();
      refetch();
      showSuccessToast('Deleted', {
        description: 'Call deleted successfully.',
      });
    } catch (err) {
      showErrorToast('Error', {
        description: err?.data?.message || 'Failed to delete call.',
      });
    } finally {
      setDeleteDialogOpen(false);
      setCallToDelete(null);
    }
  };

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
  };

  return (
    <>
      <div className='flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm'>
        <div className='overflow-x-auto'>
          <div className='max-h-[67vh] overflow-y-auto [scrollbar-width:none]'>
            <Table className='w-full'>
              <TableHeader className='sticky top-0 z-20'>
                {' '}
                {/* no bg here */}
                <TableRow className='border-b border-gray-200'>
                  <SortableHeader
                    field='effectiveDate'
                    label='Date & Time'
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSortClick}
                    className='text-left'
                  />
                  <TableHead className='w-40 border-b border-gray-200 bg-secondaryBackground font-semibold text-textCustomDark'>
                    Status
                  </TableHead>
                  <TableHead className='w-40 border-b border-gray-200 bg-secondaryBackground font-semibold text-textCustomDark'>
                    Phone
                  </TableHead>
                  <TableHead className='w-40 border-b border-gray-200 bg-secondaryBackground font-semibold text-textCustomDark'>
                    Customer
                  </TableHead>
                  <TableHead className='w-40 border-b border-gray-200 bg-secondaryBackground font-semibold text-textCustomDark'>
                    Duration
                  </TableHead>
                  <TableHead className='w-40 border-b border-gray-200 bg-secondaryBackground font-semibold text-textCustomDark'>
                    Outcome
                  </TableHead>
                  <TableHead className='w-32 border-b border-gray-200 bg-secondaryBackground text-center font-semibold text-textCustomDark'>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className='py-12 text-center'>
                      <div className='flex flex-col items-center gap-3'>
                        <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
                        <span className='text-gray-500'>Loading calls...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className='py-12 text-center'>
                      <div className='flex flex-col items-center gap-3'>
                        <Phone className='h-12 w-12 text-gray-300' />
                        <span className='text-lg text-gray-500'>
                          No calls found
                        </span>
                        <span className='text-sm text-gray-400'>
                          Try adjusting your filters or search criteria
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.map((call, index) => (
                    <TableRow
                      key={call._id || index}
                      className={`border-b border-gray-100 transition-colors hover:bg-gray-50 ${
                        call.isClosed || call.maxAttemptsReached
                          ? 'bg-red-50'
                          : ''
                      }`}
                    >
                      <TableCell className='py-4 text-center align-top'>
                        {(() => {
                          const { date, time } = formatDateTime(call.createdOn);
                          return (
                            <div className='flex flex-col items-center'>
                              <span className='font-medium text-gray-800'>
                                {date}
                              </span>
                              <span className='text-sm text-gray-500'>
                                {time}
                              </span>
                            </div>
                          );
                        })()}
                      </TableCell>

                      <TableCell className='py-4 align-top'>
                        <div className='flex items-center justify-center gap-2'>
                          {getStatusBadge(call)}
                          {call.callHistory && call.callHistory.length > 0 && (
                            <Button
                              variant='ghost'
                              size='sm'
                              className='h-6 w-6 p-0 text-blue-500 hover:bg-blue-50'
                              onClick={() => {
                                setSelectedCallHistory(call);
                                setScheduleHistoryOpen(true);
                              }}
                              title='View Call History'
                            >
                              <History className='h-4 w-4' />
                            </Button>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className='py-4 align-top'>
                        <div className='flex flex-col'>
                          <span className='font-medium text-gray-900'>
                            {call.toPhone}
                          </span>
                          {call.fromPhone && (
                            <span className='text-xs text-gray-500'>
                              From: {call.fromPhone}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className='py-4 align-top'>
                        <div className='flex flex-col'>
                          <span className='font-medium text-gray-900'>
                            {call.carrierName}
                          </span>
                          {call?.shipmentNumber && (
                            <span className='text-xs text-gray-500'>
                              {call?.shipmentNumber}
                            </span>
                          )}
                          {call?.location && (
                            <span className='text-xs text-gray-500'>
                              {call?.location}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className='py-4 align-top'>
                        <span className='text-sm text-gray-700'>
                          {call?.callDuration
                            ? formatDuration(call?.callDuration)
                            : '-'}
                        </span>
                      </TableCell>

                      <TableCell className='flex justify-center py-4 align-top'>
                        {(() => {
                          const outcome = call?.outcome || 'pending'; // default to "pending"

                          const outcomeConfig = {
                            pending: (
                              <span className='text-sm text-gray-700'>-</span>
                            ),
                            review: (
                              <div className='flex w-fit items-center gap-2 rounded-md bg-[#835006] px-2 py-1 text-white'>
                                <span className='flex h-4 w-4 items-center justify-center rounded-full bg-white'>
                                  <ReviewIcon />
                                </span>
                                <span className='text-sm'>Review</span>
                              </div>
                            ),
                            verified: (
                              <div className='flex w-fit items-center gap-2 rounded-md bg-[#00942B] px-2 py-1 text-white'>
                                <span className='flex h-4 w-4 items-center justify-center rounded-full bg-white'>
                                  <VerifiedIcon />
                                </span>
                                <span className='text-sm'>Verified</span>
                              </div>
                            ),
                          };
                          return outcomeConfig[outcome];
                        })()}
                      </TableCell>

                      <TableCell className='py-4 align-top'>
                        <div className='flex items-center justify-end gap-2'>
                          {call.callStatus === 'completed' && (
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleMoreOptionsClick(call)}
                              className='h-8 px-3 text-xs'
                            >
                              View Details
                            </Button>
                          )}
                          {!ONGOING_CALL_STATUSES.includes(
                            call?.callStatus,
                          ) && (
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => handleDeleteClick(call)}
                              className='h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700'
                            >
                              <Trash className='h-4 w-4' />
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

        <div className='flex flex-col items-center justify-between gap-4 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row'>
          <div className='text-sm text-gray-600'>
            Showing{' '}
            <span className='font-medium'>
              {data.length > 0 ? (page - 1) * perPage + 1 : 0}
            </span>{' '}
            to{' '}
            <span className='font-medium'>
              {Math.min(page * perPage, totalRecords)}
            </span>{' '}
            of <span className='font-medium'>{totalRecords}</span> results
          </div>

          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-2'>
              <span className='text-sm text-gray-700'>Per page:</span>
              <select
                className='rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
              >
                {[10, 20, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className='flex items-center'>
              <Button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page <= 1}
                size='sm'
                variant='outline'
                className='h-8 w-8 p-0'
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <div className='px-4 text-sm font-medium'>
                {page} of {totalPages || 1}
              </div>
              <Button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page >= totalPages || totalPages === 0}
                size='sm'
                variant='outline'
                className='h-8 w-8 p-0'
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={scheduleHistoryOpen} onOpenChange={setScheduleHistoryOpen}>
        <DialogContent className='max-h-[80vh] overflow-y-auto sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2 text-blue-600'>
              <History className='h-5 w-5' />
              Call History & Retry Information
            </DialogTitle>
            <DialogDescription>
              Complete call chain and retry history for this scheduled call
            </DialogDescription>
          </DialogHeader>

          {selectedCallHistory && (
            <div className='space-y-6'>
              {/* Current Call Info */}
              <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
                <h3 className='mb-3 flex items-center gap-2 font-semibold text-blue-900'>
                  <Calendar className='h-4 w-4' />
                  Current Scheduled Call
                </h3>
                <div className='grid grid-cols-2 gap-3 text-sm'>
                  <div>
                    <span className='font-medium text-gray-700'>Customer:</span>
                    <div className='text-gray-900'>
                      {selectedCallHistory.carrierName}
                    </div>
                  </div>
                  <div>
                    <span className='font-medium text-gray-700'>Phone:</span>
                    <div className='text-gray-900'>
                      {selectedCallHistory.shipmentNumber}
                    </div>
                  </div>
                  <div>
                    <span className='font-medium text-gray-700'>Attempt:</span>
                    <div className='text-gray-900'>
                      {selectedCallHistory.callAttempt}/12
                    </div>
                  </div>
                  <div>
                    <span className='font-medium text-gray-700'>Status:</span>
                    <div className='text-gray-900'>
                      {selectedCallHistory.callStatus}
                    </div>
                  </div>
                  <div className='col-span-2'>
                    <span className='font-medium text-gray-700'>
                      Scheduled For:
                    </span>
                    <div className='text-gray-900'>
                      {new Date(selectedCallHistory.scheduledAt).toLocaleString(
                        'en-US',
                        {
                          timeZone: 'Asia/Kolkata',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true,
                        },
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Retry Information */}
              <div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
                <h3 className='mb-3 flex items-center gap-2 font-semibold text-gray-900'>
                  <Repeat className='h-4 w-4' />
                  Retry Information
                </h3>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div className='rounded border bg-white p-3'>
                    <div className='font-medium text-gray-700'>
                      Total Attempts
                    </div>
                    <div className='text-2xl font-bold text-blue-600'>
                      {selectedCallHistory.callAttempt}
                    </div>
                    <div className='text-xs text-gray-500'>out of 12</div>
                  </div>
                  <div className='rounded border bg-white p-3'>
                    <div className='font-medium text-gray-700'>Remaining</div>
                    <div className='text-2xl font-bold text-green-600'>
                      {12 - selectedCallHistory?.callAttempt}
                    </div>
                    <div className='text-xs text-gray-500'>attempts left</div>
                  </div>
                </div>
              </div>

              {/* Call Chain Information */}
              {selectedCallHistory?.callHistory.map((call, index) => (
                <div
                  key={call._id}
                  className='flex flex-col gap-2 rounded border bg-white p-3 text-sm sm:flex-row sm:items-center sm:justify-between'
                >
                  <div>
                    <div className='font-medium text-gray-800'>
                      Attempt {index + 1}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {new Date(
                        call.initiatedAt || call.createdOn,
                      ).toLocaleString('en-US', {
                        timeZone: 'Asia/Kolkata',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                      })}
                    </div>
                  </div>
                  <div className='flex flex-col sm:items-end'>
                    <span className='text-sm font-semibold text-blue-700'>
                      Status: {call.callStatus}
                    </span>
                    <span className='text-xs text-gray-600'>
                      Duration: {call.callDuration || 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className='sm:max-w-[500px]'>
          <AlertDialogHeader>
            <AlertDialogTitle className='flex items-center gap-2 text-red-600'>
              <Trash className='h-5 w-5' />
              Delete Call Record
            </AlertDialogTitle>
            <AlertDialogDescription className='pt-2 text-gray-600'>
              Are you sure you want to delete this call record? This action
              cannot be undone and will permanently remove all associated data.
              {callToDelete && (
                <div className='mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4'>
                  <div className='grid grid-cols-2 gap-3 text-sm'>
                    <div>
                      <span className='font-medium text-gray-700'>
                        Customer:
                      </span>
                      <div className='text-gray-900'>
                        {callToDelete.customerName}
                      </div>
                    </div>
                    <div>
                      <span className='font-medium text-gray-700'>Phone:</span>
                      <div className='text-gray-900'>
                        {callToDelete.toPhone}
                      </div>
                    </div>
                    <div>
                      <span className='font-medium text-gray-700'>Status:</span>
                      <div className='text-gray-900'>
                        {callToDelete.callStatus}
                      </div>
                    </div>
                    <div>
                      <span className='font-medium text-gray-700'>
                        Attempts:
                      </span>
                      <div className='text-gray-900'>
                        {callToDelete.callAttempt}/15
                      </div>
                    </div>
                    {callToDelete.callDuration && (
                      <div className='col-span-2'>
                        <span className='font-medium text-gray-700'>
                          Duration:
                        </span>
                        <div className='text-gray-900'>
                          {callToDelete.callDuration}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='gap-2'>
            <AlertDialogCancel
              onClick={handleDeleteCancel}
              className='hover:bg-gray-50'
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isLoading}
              className='bg-red-600 text-white hover:bg-red-700'
            >
              {isLoading ? (
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-white'></div>
                  Deleting...
                </div>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <CallDetailsSheet
        call={callData}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </>
  );
}
