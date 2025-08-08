import 'react-h5-audio-player/lib/styles.css';
import React, { useEffect, useState } from 'react';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet"

import {
    Slider
} from "@/components/ui/slider"

import {
    Button
} from "@/components/ui/button"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import {
    Badge
} from "@/components/ui/badge"

import AudioPlayer from './audio-player';
import { useCallFeedbackMutation } from '@/store';

const Conversation = (str = "") => {
    const formattedConversation = str
        .trim()
        .split('\n')
        .map((line, index) => {
            const [speaker, ...messageParts] = line.split(':');
            const message = messageParts.join(':').trim();

            return (
                <div key={index} className="mb-2">
                    <strong className="text-blue-600">{speaker}:</strong> {message}
                </div>
            );
        });

    return <div className="space-y-1">{formattedConversation}</div>;
}

export default Conversation

export function CallDetailsSheet({ open, onOpenChange, callData, onFeedbackSubmit }) {
    const [overallRating, setOverallRating] = useState(5);
    const [qualityRating, setQualityRating] = useState(5);
    const [clarityRating, setClarityRating] = useState(5);
    const [toneRating, setToneRating] = useState(5);
    const [feedbackNote, setFeedbackNote] = useState("");
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [activeTab, setActiveTab] = useState("details")

    const [submitFeedback, { isLoading }] = useCallFeedbackMutation()

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

    const voiceInfo = callData?.voiceName
    const voiceLanguage = getVoiceLanguage(voiceInfo)

    const getRatingEmoji = (value) => {
        if (value <= 3) return "😞";
        if (value <= 6) return "😐";
        if (value <= 8) return "🙂";
        return "😄";
    }

    const getRatingColor = (value) => {
        if (value <= 3) return "text-red-500";
        if (value <= 6) return "text-yellow-500";
        if (value <= 8) return "text-blue-500";
        return "text-green-500";
    }

    const getRatingBgColor = (value) => {
        if (value <= 3) return "bg-red-100";
        if (value <= 6) return "bg-yellow-100";
        if (value <= 8) return "bg-blue-100";
        return "bg-green-100";
    }

    const getCallStatusBadge = (status) => {
        if (!status) return null;

        const statusColors = {
            'completed': 'bg-green-100 text-green-800 border-green-200',
            'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
            'failed': 'bg-red-100 text-red-800 border-red-200',
            'busy': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'no-answer': 'bg-orange-100 text-orange-800 border-orange-200',
            'pending': 'bg-gray-100 text-gray-800 border-gray-200',
            'queued': 'bg-purple-100 text-purple-800 border-purple-200',
            'cancelled': 'bg-red-100 text-red-800 border-red-200',
            'hang-up': 'bg-red-100 text-red-800 border-red-200',
        };

        const colorClass = statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';

        return (
            <Badge className={`${colorClass} px-2 py-1 text-xs`}>
                {status.toUpperCase()}
            </Badge>
        );
    }

    const handleSubmitFeedback = async () => {
        debugger
        try {
            await submitFeedback({
                id: callData?._id,
                data: {
                    quality: qualityRating,
                    clarity: clarityRating,
                    tone: toneRating,
                    overall: overallRating,
                    note: feedbackNote
                }
            }).unwrap()

            setFeedbackSubmitted(true)

        } catch (error) {
            console.error("Failed to submit feedback:", error)
        }
    }

    useEffect(() => {
        if (callData?.feedback) {
            setOverallRating(callData.feedback.overall || 5);
            setQualityRating(callData.feedback.quality || 5);
            setClarityRating(callData.feedback.clarity || 5);
            setToneRating(callData.feedback.tone || 5);
            setFeedbackNote(callData.feedback.note || '');
            setFeedbackSubmitted(true)
        }
    }, [callData])

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto no-scrollbar bg-gray-50 w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
                <SheetHeader className="border-b pb-4">
                    <div className="flex justify-between items-center">
                        <SheetTitle className="text-xl font-bold text-gray-800">Call Details</SheetTitle>
                        {callData?.callStatus && getCallStatusBadge(callData.callStatus)}
                    </div>
                    <SheetDescription className="text-sm text-gray-500">
                        {callData?.customerName && `Call with ${callData.customerName}`} • {formatDuration(callData?.callDuration)}
                    </SheetDescription>
                </SheetHeader>

                <Tabs defaultValue="details" className="mt-6" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-2 mb-4">
                        <TabsTrigger value="details">Call Details</TabsTrigger>
                        <TabsTrigger
                            value="feedback"
                            disabled={callData?.callStatus !== 'completed'}
                            className={callData?.callStatus !== 'completed' ? 'cursor-not-allowed opacity-50' : ''}
                        >
                            QA Feedback
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="mt-0">
                        <div className="grid gap-6">
                            {/* Agent Information Section */}
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">Agent Information</h3>
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-100 p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-800">{callData?.agentName || "N/A"}</h4>
                                        <p className="text-xs text-gray-500">Agent</p>
                                    </div>
                                </div>

                                {/* Voice Information */}
                                <div className="mt-4 flex items-center gap-4">
                                    <div className="bg-green-100 p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-800">{voiceInfo}</h4>
                                        {voiceLanguage && (
                                            <p className="text-xs text-gray-500">Language: {voiceLanguage}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Call Summary Section */}
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">Call Summary</h3>
                                <div className="space-y-4">
                                    {/* <div className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
                                        <h4 className="text-sm font-medium text-gray-700 mb-1">Summary</h4>
                                        <p className="text-sm text-gray-600">
                                            {callData?.summary || "No summary available"}
                                        </p>
                                    </div> */}

                                    <div className="flex gap-4">
                                        <div className="flex-1 bg-gray-50 p-3 rounded-md border border-gray-200">
                                            <h4 className="text-sm font-medium text-gray-700 mb-1">Remark</h4>
                                            <p className="text-sm text-gray-600">
                                                {callData?.remark || "Not Available"}
                                            </p>
                                        </div>

                                        <div className="flex-1 bg-gray-50 p-3 rounded-md border border-gray-200">
                                            <h4 className="text-sm font-medium text-gray-700 mb-1">Sub-Remark</h4>
                                            <p className="text-sm text-gray-600">
                                                {callData?.subRemark || "Not Available"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recording Section */}
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">Recording</h3>
                                <div>
                                    {callData?.callRecordingUrl ? (
                                        <AudioPlayer source={callData?.callRecordingUrl} />
                                    ) : (
                                        <div className="flex items-center justify-center bg-red-50 p-4 rounded-md">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <h4 className="text-sm text-red-600 font-medium">Recording not available</h4>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Transcript Section */}
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">Transcript</h3>
                                <div className="rounded-md bg-gray-50 p-4 border border-gray-200">
                                    {callData?.transcriptionText ? (
                                        <div className="text-sm text-gray-800">
                                            {Conversation(callData?.transcriptionText)}
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
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="feedback" className="mt-0">
                        {!feedbackSubmitted ? (
                            <Card className="shadow-sm border-blue-100">
                                <CardHeader className="bg-blue-50 border-b border-blue-100">
                                    <CardTitle className="text-md font-semibold text-blue-700">QA Feedback</CardTitle>
                                    <CardDescription className="text-blue-600">
                                        Rate the quality of this call
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="space-y-8">
                                        {/* Overall Rating */}
                                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                            <h3 className="text-lg font-medium text-gray-800 mb-4">Overall Rating</h3>
                                            <div className="mb-6">
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-sm text-gray-500">Poor</span>
                                                    <span className="text-sm text-gray-500">Excellent</span>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <Slider
                                                        value={[overallRating]}
                                                        min={1}
                                                        max={10}
                                                        step={1}
                                                        onValueChange={(value) => setOverallRating(value[0])}
                                                        className="w-full"
                                                    />
                                                    <div className="mt-4 flex items-center justify-center">
                                                        <div className={`${getRatingBgColor(overallRating)} p-3 rounded-full`}>
                                                            <span className={`text-3xl ${getRatingColor(overallRating)}`}>{getRatingEmoji(overallRating)}</span>
                                                        </div>
                                                        <span className={`text-2xl font-bold ml-3 ${getRatingColor(overallRating)}`}>{overallRating}/10</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Detailed Ratings */}
                                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                            <h3 className="text-lg font-medium text-gray-800 mb-4">Call Attributes</h3>

                                            {/* Quality Rating */}
                                            <div className="mb-6">
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm font-medium text-gray-700">Quality</span>
                                                    <span className={`text-sm font-medium ${getRatingColor(qualityRating)}`}>{qualityRating}/10</span>
                                                </div>
                                                <Slider
                                                    value={[qualityRating]}
                                                    min={1}
                                                    max={10}
                                                    step={1}
                                                    onValueChange={(value) => setQualityRating(value[0])}
                                                    className="w-full"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Voice clarity, connection reliability</p>
                                            </div>

                                            {/* Clarity Rating */}
                                            <div className="mb-6">
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm font-medium text-gray-700">Clarity</span>
                                                    <span className={`text-sm font-medium ${getRatingColor(clarityRating)}`}>{clarityRating}/10</span>
                                                </div>
                                                <Slider
                                                    value={[clarityRating]}
                                                    min={1}
                                                    max={10}
                                                    step={1}
                                                    onValueChange={(value) => setClarityRating(value[0])}
                                                    className="w-full"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Clear communication, easy to understand</p>
                                            </div>

                                            {/* Tone Rating */}
                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm font-medium text-gray-700">Tone</span>
                                                    <span className={`text-sm font-medium ${getRatingColor(toneRating)}`}>{toneRating}/10</span>
                                                </div>
                                                <Slider
                                                    value={[toneRating]}
                                                    min={1}
                                                    max={10}
                                                    step={1}
                                                    onValueChange={(value) => setToneRating(value[0])}
                                                    className="w-full"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Friendliness, empathy, appropriateness</p>
                                            </div>
                                        </div>

                                        {/* Comments */}
                                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                            <h3 className="text-lg font-medium text-gray-800 mb-3">Additional Feedback</h3>
                                            <textarea
                                                rows={4}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                placeholder="Share your thoughts about this call..."
                                                value={feedbackNote}
                                                onChange={(e) => setFeedbackNote(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end pt-2 border-t">
                                    <Button
                                        disabled={isLoading}
                                        onClick={handleSubmitFeedback}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        Submit Feedback
                                    </Button>
                                </CardFooter>
                            </Card>
                        ) : (
                            <Card className="shadow-sm border-green-100">
                                <CardHeader className="bg-green-50 border-b border-green-100">
                                    <CardTitle className="text-md font-semibold text-green-700">Feedback Submitted</CardTitle>
                                    <CardDescription className="text-green-600">
                                        Thank you for your feedback!
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="py-6">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="bg-green-100 p-4 rounded-full mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-medium text-green-700 mb-2">Feedback Recorded</h3>

                                        <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-md">
                                            <div className="bg-white p-3 rounded-lg border border-gray-200 flex flex-col items-center">
                                                <span className="text-sm text-gray-500">Overall</span>
                                                <span className={`text-2xl font-bold ${getRatingColor(overallRating)}`}>{overallRating}/10</span>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg border border-gray-200 flex flex-col items-center">
                                                <span className="text-sm text-gray-500">Quality</span>
                                                <span className={`text-2xl font-bold ${getRatingColor(qualityRating)}`}>{qualityRating}/10</span>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg border border-gray-200 flex flex-col items-center">
                                                <span className="text-sm text-gray-500">Clarity</span>
                                                <span className={`text-2xl font-bold ${getRatingColor(clarityRating)}`}>{clarityRating}/10</span>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg border border-gray-200 flex flex-col items-center">
                                                <span className="text-sm text-gray-500">Tone</span>
                                                <span className={`text-2xl font-bold ${getRatingColor(toneRating)}`}>{toneRating}/10</span>
                                            </div>
                                        </div>

                                        {feedbackNote && (
                                            <div className="mt-6 w-full max-w-md">
                                                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                                                    <h4 className="text-sm font-medium text-gray-700 mb-1">Your Comments</h4>
                                                    <p className="text-sm text-gray-600">
                                                        {feedbackNote}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    );
}