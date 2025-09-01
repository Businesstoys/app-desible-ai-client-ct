'use client'
import { ChevronDown, ChevronUp, Upload, Download } from "lucide-react";
import { useState, useRef } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useUploadMutation } from "@/store";
import { showErrorToast, showSuccessToast } from "./toast";

export default function UploadDropdown({ refetch }) {
    const [uploadFile] = useUploadMutation();

    const fileInputRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const [fileKey, setFileKey] = useState(Date.now());

    const handleFileUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
            fileInputRef.current.target.value = null
        }
    };

    const handleFileChange = async (event) => {
        setIsOpen(false)
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            await uploadFile(formData).unwrap();
            refetch();
            showSuccessToast("Success!",{
                description: "File uploaded successfully.",
            });
        } catch (error) {
            showErrorToast("Uh oh! Something went wrong.",{
                description: error?.data?.message || "Please try again.",
            });
        }
        setFileKey(Date.now());
    };

    const handleDownloadTemplate = () => {
        const link = document.createElement('a');
        link.href = '/template.xlsx';
        link.download = 'template.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex justify-center">
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="bg-white text-black border border-gray-200 w-full">
                        Upload Contact List
                        {isOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                    <DropdownMenuItem
                        onClick={handleFileUpload}
                        className="flex items-center justify-center bg-orange-500 text-white hover:bg-orange-600 cursor-pointer"
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Excel File
                    </DropdownMenuItem>
                    <input
                        key={fileKey}
                        type="file"
                        accept=".xlsx, .xls"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                    <DropdownMenuItem
                        onClick={handleDownloadTemplate}
                        className="flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Download Template
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}