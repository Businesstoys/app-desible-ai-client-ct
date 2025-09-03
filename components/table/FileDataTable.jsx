'use client'
import { useEffect } from "react"
import { Trash } from "lucide-react"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import Checkbox from "../ui/checkbox"
import { EditCallDialog } from "../ui/edit-call-popover"
import { useRemoveCallsMutation } from "@/store"
import { showErrorToast, showSuccessToast } from "../ui/toast"

export function FileDataTable({ data = [], selectedRows, setSelectedRows, refetch }) {
    const [callDelete, { isLoading }] = useRemoveCallsMutation()

    useEffect(() => {
        setSelectedRows(data.map(call => call._id))
    }, [data])

    const handleCheckboxChange = (_id) => {
        setSelectedRows(prev => {
            if (prev.includes(_id)) {
                return prev.filter(id => id !== _id)
            } else {
                return [...prev, _id]
            }
        })
    }

    const handleSelectAll = () => {
        const allSelected = selectedRows.length === data.length
        setSelectedRows(allSelected ? [] : data.map(call => call._id))
    }

    const handleSaveCall = () => {
        refetch()
        showSuccessToast("Success!",
            { description: "Call details updated successfully." })

    }

    const handleOnClick = async (_id) => {
        try {
            await callDelete([_id]).unwrap()
            refetch()
            showSuccessToast("Success", {
                description: "Call details deleted successfully."
            })

        } catch (error) {
            showErrorToast("Failure", {
                description: "Unable to delete the call. Please try again!"
            })

        }
    }

    return (
        <Table>
            <TableCaption>A list of your recent uploaded call details.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        <Checkbox
                            checked={selectedRows.length === data.length}
                            onChange={handleSelectAll}
                        />
                    </TableHead>
                    <TableHead>To Phone</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>location</TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((call, index) => (
                    <TableRow key={call._id}>
                        <TableCell>
                            <Checkbox
                                checked={selectedRows.includes(call._id)}
                                onChange={() => handleCheckboxChange(call._id)}
                            />
                        </TableCell>
                        <TableCell className="font-medium">{call.toPhone}</TableCell>
                        <TableCell>{call.studentName}</TableCell>
                        <TableCell>{call.location}</TableCell>
                        <TableCell>
                            <div className="flex items-start justify-center cursor-pointer">
                                <EditCallDialog
                                    call={call}
                                    index={index}
                                    onSave={handleSaveCall}
                                />
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-start justify-center cursor-pointer">
                                <Trash width={16} height={16} onClick={() => handleOnClick(call._id)} />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}