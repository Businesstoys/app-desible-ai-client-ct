'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useCallDataExportMutation, useCallListQuery } from '@/store';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from "@/components/ui/tooltip";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, PlayCircle, PauseCircle, FileText, ChevronLeft, ChevronRight, Eye, Mail, Calendar, Check, RefreshCcw } from 'lucide-react';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};


const truncateText = (text, maxLength = 20) => {
  if (!text || text === '—') return '—';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export default function DispositionsPage() {
  const [search, setSearch] = useState('');
  const [range, setRange] = useState('all');
  const [agent, setAgent] = useState('all');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [transcriptDialog, setTranscriptDialog] = useState({ open: false, data: null });
  const [subRemarkDialog, setSubRemarkDialog] = useState({ open: false, content: '', title: '' });
  const [playingId, setPlayingId] = useState(null);
  const audioRef = useRef(null);

  const queryParams = useMemo(() => ({
    search, range, agent, page, perPage, remark: 'All Details Collected'
  }), [search, range, agent, page, perPage]);


  const { data = { data: [], meta: { total: 1 } }, isLoading,refetch } = useCallListQuery(queryParams)
  const [exportData, { isLoading: isExporting }] = useCallDataExportMutation();
  const meta = data.meta
  const totalPages = Math.ceil(meta?.total / perPage)
  const agentOptions = useMemo(() => {
    const allAgents = [...new Set(data.data.map(item => item.agentName).filter(Boolean))]
    return allAgents
  }, [data.data])

  const showTranscript = (item) => {
    setTranscriptDialog({
      open: true,
      data: {
        id: item._id,
        customerName: item.customerName,
        agentName: item.agentName,
        date: formatDate(item?.createdOn),
        content: item.transcriptionText || "No transcript available for this call."
      }
    })
  }

  const showSubRemarkDetail = (customerName, subRemark) => {
    setSubRemarkDialog({
      open: true,
      title: `Sub-Remark: ${customerName || 'Client'}`,
      content: subRemark
    });
  };

  const handleAudioToggle = (itemId, audioUrl) => {
    if (!audioRef.current) return;

    if (playingId === itemId) {
      audioRef.current.pause();
      setPlayingId(null);
    } else {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setPlayingId(itemId);
    }
  }

  const SubRemarkDisplay = ({ text, customerName }) => {
    if (!text || text === '—') return '—';

    return (
      <div className="flex items-center justify-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                onClick={() => showSubRemarkDetail(customerName, text)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View full sub-remark</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  };

  const ActionStatus = ({ emailSent, eventCreated }) => {
    return (
      <div className="flex flex-col xs:flex-row gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${emailSent ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                <Mail className="h-3 w-3" />
                <span className="hidden xs:inline">Email</span>
                {emailSent && <Check className="h-3 w-3" />}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{emailSent ? 'Email sent' : 'No email sent'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${eventCreated ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                <Calendar className="h-3 w-3" />
                <span className="hidden xs:inline">Meeting</span>
                {eventCreated && <Check className="h-3 w-3" />}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{eventCreated ? 'Meeting scheduled' : 'No meeting scheduled'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      <audio ref={audioRef} onEnded={() => setPlayingId(null)} hidden />
      <div className="">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dispositions</h1>
        <div className="flex flex-col space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 bg-white border border-gray-200"
              />
            </div>

            <Select value={range} onValueChange={setRange}>
              <SelectTrigger className="bg-white border border-gray-200">
                <span className="text-sm">Date Range: <SelectValue placeholder="All Time" /></span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>

            <Select value={agent} onValueChange={setAgent}>
              <SelectTrigger className="bg-white border border-gray-200">
                <span className="text-sm">Agent: <SelectValue placeholder="All" /></span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {agentOptions.map(name => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
   
        <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  {/* <TableHead className="hidden md:table-cell">ID</TableHead> */}
                  <TableHead>Phone</TableHead>
                  <TableHead>Student Name</TableHead>
                  {/* <TableHead className="hidden sm:table-cell">Agent</TableHead> */}
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead>Recording</TableHead>
                  <TableHead className="hidden md:table-cell">Remarks</TableHead>
                  <TableHead className="hidden lg:table-cell">Sub-Remark</TableHead>
                  <TableHead>Template</TableHead>
                  {/* <TableHead>Action</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">Loading...</TableCell>
                  </TableRow>
                ) : data.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">No records found</TableCell>
                  </TableRow>
                ) : (
                  data.data.map(item => (
                    <TableRow key={item._id}>
                      <TableCell>{item.toPhone}</TableCell>
                      <TableCell>
                        <div className="flex flex-col sm:hidden">
                          <span>{item.customerName}</span>
                          <span className="text-xs text-gray-500">{item?.agentName}</span>
                          <span className="text-xs text-gray-500">{formatDate(item?.createdOn)}</span>
                        </div>
                        <span className="hidden sm:block">{item?.studentName}</span>
                      </TableCell>
                      {/* <TableCell className="hidden sm:table-cell">{item.agentName}</TableCell> */}
                      <TableCell className="hidden lg:table-cell">{formatDate(item?.createdOn)}</TableCell>
                      <TableCell className="space-x-1">
                        {item.callRecordingUrl ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-blue-600 h-7 w-7"
                              onClick={() => handleAudioToggle(item._id, item.callRecordingUrl)}
                              title={playingId === item._id ? "Pause" : "Play"}
                            >
                              {playingId === item._id ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-blue-600 h-7 w-7"
                              onClick={() => showTranscript(item)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </>
                        ) : '—'}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help">{item.remark}</span>
                            </TooltipTrigger>
                            {item.remark && <TooltipContent><p>{item.remark}</p></TooltipContent>}
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {item.subRemark ?
                          <SubRemarkDisplay text={item.subRemark} customerName={item.customerName} /> :
                          '—'
                        }
                      </TableCell>
                      <TableCell>
                        {item?.template}
                      </TableCell>
                      {/* <TableCell>
                        <ActionStatus
                          emailSent={item.emailSent}
                          eventCreated={item.eventCreated}
                        />
                      </TableCell> */}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="py-3 px-4 sm:px-6 bg-white border-t border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-0">
                Showing {Math.min((page - 1) * perPage + 1, meta?.total || 0)} to {Math.min(page * perPage, meta?.total || 0)} of {meta?.total || 0} results
              </div>

              <div className="flex items-center space-x-2 sm:space-x-6">
                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm text-gray-700">Per page:</span>
                  <Select value={perPage.toString()} onValueChange={(value) => { setPerPage(Number(value)); setPage(1); }}>
                    <SelectTrigger className="w-16 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 20, 50, 100].map(n => (
                        <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center">
                  <Button
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page <= 1}
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="px-2 sm:px-4 py-1 text-xs sm:text-sm">{page} / {totalPages || 1}</div>
                  <Button
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={page >= totalPages}
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transcript Dialog */}
      <Dialog open={transcriptDialog.open} onOpenChange={(open) => setTranscriptDialog(prev => ({ ...prev, open }))}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Call Transcript</DialogTitle>
          </DialogHeader>
          {transcriptDialog.data && (
            <div className="mt-2">
              <div className="flex flex-col space-y-1 mb-4">
                <div className="flex flex-col sm:flex-row sm:justify-between text-sm">
                  <span className="text-gray-600">Client: <span className="font-medium text-gray-900">{transcriptDialog.data.customerName}</span></span>
                  <span className="text-gray-600">Date: <span className="font-medium text-gray-900">{transcriptDialog.data.date}</span></span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between text-sm">
                  <span className="text-gray-600">Agent: <span className="font-medium text-gray-900">{transcriptDialog.data.agentName}</span></span>
                  <span className="text-gray-600">Call ID: <span className="font-medium text-gray-900">{transcriptDialog.data.id}</span></span>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto bg-gray-50 p-4 rounded-md border border-gray-200">
                <pre className="text-sm whitespace-pre-wrap font-sans">{transcriptDialog.data.content}</pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Sub-Remark Dialog */}
      <Dialog open={subRemarkDialog.open} onOpenChange={(open) => setSubRemarkDialog(prev => ({ ...prev, open }))}>
        <DialogContent className="w-[95vw] max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{subRemarkDialog.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-200 max-h-96 overflow-y-auto">
            <p className="text-sm whitespace-pre-wrap">{subRemarkDialog.content}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}