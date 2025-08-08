'use client'

import { useRef, useState } from "react";

import { UploadIcon } from "@/public/svg/UploadIcon"
import { DownloadIcon } from "@/public/svg/DownloadIcon"
import { CloudUploadIcon } from "@/public/svg/CloudUploadIcon"
import { usePendingCallQuery, useUploadMutation, useTemplateListQuery } from "@/store"

import { FileDataTable } from "@/components/table/FileDataTable"
import { Button } from "@/components/ui/button"
import UploadDropdown from "@/components/ui/upload-dropdown"
import TriggerCallDialog from "@/components/ui/trigger-call-popover"
import { useToast } from "@/hooks/use-toast"

export default function Page() {
    const [uploadFile] = useUploadMutation()
    const { toast } = useToast()

    const { data, refetch } = usePendingCallQuery(
        undefined,
        { refetchOnFocus: true, keepUnusedDataFor: 0 },
    )

    const { data: templateList } = useTemplateListQuery()
    const fileInputRef = useRef(null);
    const callData = data?.data

    const [fileKey, setFileKey] = useState(Date.now());
    const [selectedCall, setSelectedCall] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);


    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            await uploadFile(formData).unwrap();
            refetch()
            toast({
                title: "Success!",
                description: "File uploaded successfully.",
                status: "success",
            });
        } catch (error) {
            toast({
                title: "Uh oh! Something went wrong.",
                description: error?.data?.message || "Please try again.",
                status: "error",
            });
        }
        setFileKey(Date.now())
    }


    return (
        <div className="w-full h-full p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between border-b-2 border-gray-200 pb-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Initiate Call</h1>
                </div>

                {callData?.length > 0 &&
                    <div className="flex items-center space-x-4">
                        <UploadDropdown refetch={refetch} />
                        <Button
                            onClick={() => setIsDialogOpen(true)}
                            className="bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-md"
                            aria-label="Trigger call"
                            disabled={false}
                        >
                            Trigger Call
                        </Button>
                        <TriggerCallDialog
                            open={isDialogOpen}
                            onOpenChange={setIsDialogOpen}
                            data={templateList?.data}
                            selectedCall={selectedCall}
                        />
                    </div>
                }
            </div>

            {!callData || !Array.isArray(callData) || callData?.length === 0
                ? <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 rounded-full bg-orange-50 mb-6">
                        <CloudUploadIcon />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Upload Excel to Initiate Calls
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 max-w-md text-center mb-8">
                        To trigger calls successfully, please upload an Excel file with data
                        formatted according to the template provided below.
                    </p>
                    <div className="flex space-x-4">
                        <Button
                            onClick={handleButtonClick}
                            className="bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-md px-6 py-4"
                            size="lg"
                            aria-label="Upload excel"
                        >
                            <UploadIcon />
                            Upload Excel File
                            <input
                                key={fileKey}
                                type="file"
                                accept=".xlsx, .xls"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />
                        </Button>
                        <a
                            href="/template.xlsx"
                            download="template.xlsx"
                            className="text-black hover:underline"
                        >
                            <Button
                                variant="outline"
                                className="border-gray-300 hover:bg-gray-100 transition-colors"
                                size="lg"
                                aria-label="Download Template"
                            >
                                <DownloadIcon />
                                Download Template
                            </Button>
                        </a>
                    </div>
                </div>
                : <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <FileDataTable
                        selectedRows={selectedCall}
                        setSelectedRows={setSelectedCall}
                        setCallData={() => { }}
                        data={callData}
                        refetch={refetch}
                    />
                </div>
            }
        </div>
    );
}   
