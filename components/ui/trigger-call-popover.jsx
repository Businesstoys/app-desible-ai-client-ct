'use client'

import { useState, useRef, useEffect } from "react";
import { PlayCircle, PauseCircle, Eye, EyeOff, Info } from "lucide-react";
import { useRouter } from "next/navigation";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useCallInitiateMutation } from "@/store";

import { useToast } from "@/hooks/use-toast";

export default function TriggerCallDialog({ open, onOpenChange, data = [], selectedCall = [] }) {
  const [callInitiate, { isLoading }] = useCallInitiateMutation()

  const { toast } = useToast();
  const router = useRouter();

  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [selectedVoiceData, setSelectedVoiceData] = useState(null);
  const [agentName, setAgentName] = useState("Kavya");
  const [isPlaying, setIsPlaying] = useState(false);
  const [expandedPrompts, setExpandedPrompts] = useState({});
  const audioRef = useRef(null);

  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedTemplateId(data[0]._id);
      setSelectedTemplate(data[0]);

      if (data[0].voices && data[0].voices.length > 0) {
        setSelectedVoice(data[0].voices[0].value);
        setSelectedVoiceData(data[0].voices[0]);
      }
    }
  }, [data]);

  useEffect(() => {
    const template = data.find(t => t._id === selectedTemplateId);
    setSelectedTemplate(template);

    if (template && template.voices && template.voices.length > 0) {
      setSelectedVoice(template.voices[0].value);
      setSelectedVoiceData(template.voices[0]);
    } else {
      setSelectedVoice("");
      setSelectedVoiceData(null);
    }
  }, [selectedTemplateId, data]);

  useEffect(() => {
    if (selectedTemplate && selectedTemplate.voices) {
      const voice = selectedTemplate.voices.find(v => v.value === selectedVoice);
      setSelectedVoiceData(voice || null);
    }
  }, [selectedVoice, selectedTemplate])

  useEffect(() => {
    const handleAudioEnd = () => {
      setIsPlaying(false);
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleAudioEnd);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnd);
      }
    };
  }, [audioRef.current]);

  const togglePromptVisibility = (id) => {
    setExpandedPrompts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }

  const getPromptPreview = (prompt) => {
    if (!prompt) return "";
    const lines = prompt.split('\n');
    if (lines.length > 3) {
      return lines.slice(0, 3).join('\n') + '...';
    }
    if (prompt.length > 100) {
      return prompt.substring(0, 100) + '...';
    }
    return prompt;
  }

  const getAgentPlaceholder = () => {
    if (!selectedVoiceData) return "Type Agent Name";
    return `Agent name`;
  }

  const handlePlayVoiceTest = () => {
    setIsPlaying(prev => !prev);
    if (selectedVoiceData && selectedVoiceData.url) {
      if (!audioRef.current) {
        audioRef.current = new Audio(selectedVoiceData.url);
      } else {
        audioRef.current.src = selectedVoiceData.url;
      }
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.error("Failed to play audio:", err);
        });
      }
    }
  }

  const handleTriggerCall = async () => {
    if (selectedCall >= 0) return
  
    try {
      const payload = {
        callId: selectedCall,
        voiceId: selectedVoiceData._id,
        templateId: selectedTemplateId,
        agentName: agentName,
      }

      await callInitiate(payload).unwrap();
      router.push('/queued-calls')
      toast({
        title: "Success!",
        description: "Calls initiated successfully.",
        status: "success",
      });
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: error?.data?.message || "Please try again.",
        status: "error",
      });
    }
  }

  const resetState = () => {
    setSelectedTemplateId("");
    setSelectedTemplate(null);
    setSelectedVoice("");
    setSelectedVoiceData(null);
    setAgentName("");
    setIsPlaying(false);
    setExpandedPrompts({});
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };


  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetState()
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-md w-full bg-white rounded-lg shadow-lg border-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="text-xl font-semibold text-gray-800">Trigger Call</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <p className="mb-3 text-gray-700">Choose how you'd like to trigger the call.</p>
            <RadioGroup
              value={selectedTemplateId}
              onValueChange={setSelectedTemplateId}
              className="space-y-3"
            >
              {data.map((template) => (
                <div
                  key={template._id}
                  className="flex items-start space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <RadioGroupItem
                    value={template._id}
                    id={template._id}
                    className="text-orange-500 mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor={template._id}
                        className="font-medium cursor-pointer text-gray-800"
                      >
                        {template.name}
                      </Label>
                      {template.prompt && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePromptVisibility(template._id)}
                          className="p-1 h-auto text-gray-500 hover:text-gray-800 shrink-0 ml-2"
                        >
                          {expandedPrompts[template._id] ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </Button>
                      )}
                    </div>
                    {template.prompt && (
                      <div className="mt-1 w-full">
                        <div
                          className={`text-xs text-gray-500 mt-1 whitespace-pre-wrap break-words w-full ${expandedPrompts[template._id]
                            ? 'max-h-32 overflow-y-auto custom-scrollbar pr-1'
                            : 'line-clamp-2'
                            }`}
                        >
                          {expandedPrompts[template._id] ? template.prompt : getPromptPreview(template.prompt)}
                        </div>
                        {template.prompt.length > 50 && !expandedPrompts[template._id] && (
                          <Button
                            type="button"
                            variant="link"
                            size="sm"
                            onClick={() => togglePromptVisibility(template._id)}
                            className="p-0 h-auto text-xs text-blue-500 hover:text-blue-700"
                          >
                            View full prompt
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="voice-name" className="text-gray-700">Voice Name</Label>
              <Select
                value={selectedVoice}
                onValueChange={setSelectedVoice}
                disabled={!selectedTemplate || !selectedTemplate.voices || selectedTemplate.voices.length === 0}
              >
                <SelectTrigger
                  id="voice-name"
                  className="border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                >
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent>
                  {selectedTemplate?.voices?.map((voice) => (
                    <SelectItem key={voice.value} value={voice.value}>
                      {voice.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="agent-name" className="text-gray-700">
                  Agent Name
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-5 h-5 p-0 text-gray-400 hover:text-gray-700"
                    >
                      <Info size={16} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 text-sm text-gray-600">
                    The AI uses this name to introduce itself during the call (e.g., “Hi, this is Zara from XYZ”). It also helps personalize the interaction and identify the AI agent in logs and transcripts.
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Input
                  id="agent-name"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder={getAgentPlaceholder()}
                  className="border-gray-300 focus:ring-orange-500 focus:border-orange-500 mt-3"
                />
              </div>

            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Voice Test</Label>
            <div className="border border-gray-200 rounded-md p-4 flex justify-between items-center bg-gray-50">
              <div>
                <div className="font-medium text-gray-800">
                  {agentName || getAgentPlaceholder()}
                </div>
                <div className="text-sm text-gray-500">
                  {selectedVoiceData?.label || "No voice selected"}
                </div>
              </div>
              {selectedVoiceData && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePlayVoiceTest}
                  className={`${isPlaying ? 'text-orange-500' : 'text-blue-500'} hover:bg-gray-100`}
                >
                  {isPlaying ? <PauseCircle width={40} height={40} /> : <PlayCircle width={20} height={20} />}
                </Button>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleTriggerCall}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6"
            disabled={!selectedVoice || !selectedTemplateId || !agentName.trim() || isLoading}
          >
            Trigger Call
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}