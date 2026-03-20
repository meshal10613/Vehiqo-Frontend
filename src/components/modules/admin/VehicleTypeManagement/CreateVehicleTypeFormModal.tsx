"use client";

import { Plus } from "lucide-react";
import { Button } from "../../../ui/button";
import { Dialog, DialogTrigger } from "../../../ui/dialog";
import { useState } from "react";

export default function CreateVehicleTypeFormModal() {
    const [open, setOpen] = useState(false);

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);
        // if (!nextOpen) resetForm();
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    className="ml-auto shrink-0 cursor-pointer h-10"
                >
                    <Plus className="size-4" />
                    Create Type
                </Button>
            </DialogTrigger>
        </Dialog>
    );
}
