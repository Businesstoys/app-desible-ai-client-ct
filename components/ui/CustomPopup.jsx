import { useState } from "react";
import { EditIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CustomPopup({ data, handleOnChanges, index }) {
    const [editData, setEditData] = useState(data);
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleOnChangesData = (e) => {
        const { name, value } = e.target
        setEditData((prev) => ({ ...prev, [name]: value }))
    };

    const handleSaveChanges = () => {
        handleOnChanges(editData, index)
        setIsDialogOpen(false)
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <EditIcon width={15} height={15} onClick={() => setIsDialogOpen(true)} />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit call details</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="to_phone" className="text-right">
                            To Phone
                        </Label>
                        <Input
                            id="to_phone"
                            name="to_phone"
                            className="col-span-3"
                            value={editData.to_phone}
                            onChange={handleOnChangesData}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="agent_name" className="text-right">
                            Agent Name
                        </Label>
                        <Input
                            id="agent_name"
                            name="agent_name"
                            className="col-span-3"
                            value={editData.agent_name}
                            onChange={handleOnChangesData}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                            Type
                        </Label>
                        <Input
                            id="type"
                            name="type"
                            className="col-span-3"
                            value={editData.type}
                            onChange={handleOnChangesData}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleSaveChanges}
                        className="bg-orange-500 text-white hover:bg-orange-600"
                        type="button"
                    >
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
