import 'react-h5-audio-player/lib/styles.css';
import React, { useEffect, useState } from 'react';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import AudioPlayer from './audio-player'
import { Pencil } from 'lucide-react';
import DropdownSelect from './ui/dropdown';
import { OutcomesData } from '@/constants';
import { useUpdateOutcomeMutation } from '@/store';
import { showErrorToast, showSuccessToast } from './ui/toast';

// ----- helpers -----
const Conversation = (str = "") => {
  if (!str) return <div className="text-sm text-gray-500">Transcription not available</div>;

  const formatted = str
    .trim()
    .split('\n')
    .map((line, idx) => {
      const [speaker, ...messageParts] = line.split(':');
      const message = messageParts.join(':').trim();
      return (
        <div key={idx} className="mb-2">
          <strong className="text-blue-600">{speaker}:</strong> {message}
        </div>
      );
    });

  return <div className="space-y-1">{formatted}</div>;
};

const formatDuration = (seconds) => {
  if (!seconds) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

const getVoiceLanguage = (voiceLabel) => {
  if (!voiceLabel || !voiceLabel.includes("|")) return "";
  return voiceLabel.split("|")[1].trim();
}


export function CallDetailsSheet({ open, onOpenChange, call, refetch }) {
  const voiceInfo = call?.voiceName;
  const voiceLanguage = getVoiceLanguage(voiceInfo);
  console.log('CallDetailsSheet call:', call);

  const [newOutcome, setNewOutcome] = useState(call?.outcome || '');
  const [isEditing, setIsEditing] = useState(false);

  const editableOutcomesData = OutcomesData.filter(opt => opt.value !== 'All');

  useEffect(() => {
    setNewOutcome(call?.outcome || '');
  }, [call]);

  const [updateOutcomeMutation] = useUpdateOutcomeMutation();
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleOutcomeChange = (value) => {
    setNewOutcome(value);
  };

  const handleSaveOutcome = async () => {
    if (newOutcome && newOutcome !== call?.outcome) {
      try {
        // Call the API to update outcome
        await updateOutcomeMutation({
          callId: call?._id,
          outcome: newOutcome
        }).unwrap();
        refetch();
        showSuccessToast('Outcome updated successfully');

      } catch (err) {
        showErrorToast('Failed to update outcome', {
          description: err?.data?.message || 'Please try again later.',
        });
      }
      setIsEditing(false);
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto no-scrollbar bg-gray-50 w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
        <SheetHeader className="border-b pb-4">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-xl font-bold text-gray-800">Call Details</SheetTitle>
            {call?.callStatus && <Badge className={`bg-green-100 text-green-800 border-green-200 px-2 py-1 text-xs`} variant={'outline'}>{call?.callStatus.toUpperCase()}</Badge>}
          </div>
          <SheetDescription className="text-sm text-gray-500">
            {`Call with ${'Tam'}`}
          </SheetDescription>
        </SheetHeader>

        <div className='mt-6 grid gap-6'>
          <section className='rounded-lg bg-white p-4 shadow-sm'>
            <h3 className='text-md mb-3 border-b pb-2 font-semibold text-gray-700'>
              Shipment Information
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1'>
                <h4 className='text-sm font-medium text-gray-800'>
                  Shipment Id:
                </h4>
                <p className='text-sm text-gray-500'>{call?.shipmentNumber}</p>
              </div>
              <div className='flex flex-col gap-1'>
                <h4 className='text-sm font-medium text-gray-800'>
                  Source:
                </h4>
                <p className='text-sm text-gray-500'>{call?.originCity}</p>
              </div>
              <div className='flex flex-col gap-1'>
                <h4 className='text-sm font-medium text-gray-800'>
                  Destination:
                </h4>
                <p className='text-sm text-gray-500'>{call?.destinationCity}</p>
              </div>
              <div className='flex flex-col gap-1'>
                <h4 className='text-sm font-medium text-gray-800'>
                  PickUp Date:
                </h4>
                <p className="text-sm text-gray-500">
                  {call?.pickupDate ? new Date(call.pickupDate).toLocaleDateString("en-US") : ""}
                </p>
              </div>
              <div className='flex flex-col gap-1'>
                <h4 className='text-sm font-medium text-gray-800'>
                  Delivery Date:
                </h4>
                <p className="text-sm text-gray-500">
                  {call?.delivaryDate ? new Date(call.delivaryDate).toLocaleDateString("en-US") : ""}
                </p>
              </div>
            </div>
          </section>

          {/* Outcome Update */}
          <section className="mt-6 bg-white rounded-lg p-4 shadow-sm">
            <div className='flex justify-between mb-3 border-b pb-2'>
              <h3 className="text-md font-semibold text-gray-700 ">Outcome</h3>
              <button
                onClick={toggleEdit}
                className="ml-4 text-blue-500 hover:text-blue-700 flex items-center"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
            {call && (
              <div className="flex flex-col gap-2">
                {/* Display: current outcome, updater, timestamp, edit button */}
                {!isEditing && (
                  <div className='grid grid-cols-2 gap-4'>
                    <p className="flex flex-col gap-1 text-sm mb-1">
                      <span className="font-medium text-gray-700">Current Outcome:</span>{' '}
                      <span className="text-sm text-gray-500">{newOutcome || call?.outcome}</span>
                    </p>
                    <p className="flex flex-col gap-1 text-sm mb-1">
                      <span className="font-medium text-gray-700">Updated by :</span>{' '}
                      <span className="text-sm text-gray-500">{call.outcomeDetails?.lastUpdatedBy?.userName || 'Unknown'}</span>
                    </p>
                    <p className="flex flex-col gap-1 text-sm">
                      <span className="font-medium text-gray-700">Updated at :</span>{' '}
                      <span className="text-sm text-gray-500">
                        {call.outcomeDetails?.lastUpdatedAt
                          ? new Date(call.outcomeDetails.lastUpdatedAt).toLocaleString()
                          : 'Not yet updated'}
                      </span>
                    </p>
                  </div>
                )}

                {/* Edit mode: show dropdown and update/cancel */}
                {isEditing && (
                  <div className="flex flex-col gap-3">
                    <DropdownSelect
                      value={newOutcome}
                      options={editableOutcomesData}
                      onChange={handleOutcomeChange}
                      placeholder="Select Outcome"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveOutcome}
                        disabled={newOutcome === call?.outcome}
                        className="bg-primary text-white"
                      >
                        Update
                      </Button>
                      <Button variant="outline" onClick={toggleEdit}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Call Summary */}
          <section className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">Call Summary</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 bg-gray-50 p-3 rounded-md border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Remark</h4>
                  <p className="text-sm text-gray-600">{call?.remark || "Not Available"}</p>
                </div>
                <div className="flex-1 bg-gray-50 p-3 rounded-md border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Sub-Remark</h4>
                  <p className="text-sm text-gray-600">{call?.subRemark || "Not Available"}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Recording */}
          <section className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">Recording</h3>
            {call?.callRecordingUrl ? (
              <AudioPlayer source={call?.callRecordingUrl} />
            ) : (
              <div className="flex items-center justify-center bg-red-50 p-4 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="text-sm text-red-600 font-medium">Recording not available</h4>
              </div>
            )}
          </section>

          {/* Transcript */}
          <section className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">Transcript</h3>
            <div className="rounded-md bg-gray-50 p-4 border border-gray-200">
              {call?.transcriptionText ? (
                <div className="text-sm text-gray-800">
                  {Conversation(call?.transcriptionText)}
                </div>
              ) : (
                <div className="flex items-center justify-center p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="text-sm text-gray-500">Transcription not available</h4>
                </div>
              )}
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}