'use client'
import { useState } from "react"
import { EditIcon } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUdpateCallMutation } from "@/store"
import { useToast } from "@/hooks/use-toast"

export function EditCallDialog({ call, index, onSave }) {
    const [open, setOpen] = useState(false);
    const [editedCall, setEditedCall] = useState(null);
    const [updateCall, { isLoading }] = useUdpateCallMutation()
    const { toast } = useToast()

    const handleOpenChange = (isOpen) => {
        setOpen(isOpen);
        if (isOpen) {
            setEditedCall({ ...call });
        }
    };

    const handleChange = (field, value) => {
        setEditedCall(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        if (!editedCall) return;

        const updatedFields = {};
        for (const key in editedCall) {
            if (editedCall[key] !== call[key]) {
                updatedFields[key] = editedCall[key];
            }
        }

        if (Object.keys(updatedFields).length === 0) {
            setOpen(false);
            return;
        }

        try {
            await updateCall({ ...updatedFields, _id: call._id }).unwrap();
            onSave?.();
            setOpen(false);
        } catch (error) {
            debugger
            toast({
                title: "Failed",
                description: error?.data?.message,
                variant: "failure"
            });
        }
    }

    // const hasChanges = editedCall && Object.keys(editedCall).some(
    //     (key) => editedCall[key] !== call[key]
    // )

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <div className="flex items-start justify-center cursor-pointer">
                    <EditIcon width={16} height={16} />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Call Information</DialogTitle>
                    <DialogDescription>
                        Make changes to the call details below.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor={`toPhone-${index}`} className="text-right">
                            Phone
                        </Label>
                        <Input
                            id={`toPhone-${index}`}
                            value={editedCall?.toPhone || ''}
                            className="col-span-3"
                            onChange={(e) => handleChange('toPhone', e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor={`customerName-${index}`} className="text-right">
                            Name
                        </Label>
                        <Input
                            id={`customerName-${index}`}
                            value={editedCall?.studentName || ''}
                            className="col-span-3"
                            onChange={(e) => handleChange('studentName', e.target.value)}
                        />
                    </div>
                    {/* <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor={`gender-${index}`} className="text-right">
                            Gender
                        </Label>
                        <Select
                            value={editedCall?.gender || ''}
                            onValueChange={(value) => handleChange('gender', value)}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div> */}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        className='bg-orange-500 hover:bg-orange-400'
                        onClick={handleSave}
                        disble={isLoading}
                    >Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}