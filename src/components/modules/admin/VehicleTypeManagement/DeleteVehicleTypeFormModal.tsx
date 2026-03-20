"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

// ⚠️ adjust this type if needed
import { IVehicleType } from "../../../../types/vehicleType.type";
import { deleteVehicleType } from "../../../../services/vehicleType.services";

interface DeleteVehicleTypeFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    vehicleType: IVehicleType | null;
}

export default function DeleteVehicleTypeFormModal({
    open,
    onOpenChange,
    vehicleType,
}: DeleteVehicleTypeFormModalProps) {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: (vehicleTypeId: string) => deleteVehicleType(vehicleTypeId),

        onSuccess: (result) => {
            if (!result?.success) {
                toast.error(result?.message || "Failed to delete vehicle type");
                return;
            }

            toast.success(
                result?.message || "Vehicle type deleted successfully",
            );

            onOpenChange(false);

            void queryClient.invalidateQueries({
                queryKey: ["vehicle-type"], // ⚠️ match your query key
            });
        },

        onError: (error: any) => {
            toast.error(error?.message || "Something went wrong.");
        },
    });

    const handleDelete = () => {
        if (!vehicleType) return;
        mutate(vehicleType.id);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="animate-in fade-in-0 zoom-in-95 duration-200 max-w-sm">
                {/* Icon */}
                <div className="flex justify-center pt-2 pb-1">
                    <motion.div
                        className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                            delay: 0.1,
                        }}
                    >
                        <motion.div
                            animate={{ rotate: [0, -15, 15, -8, 8, 0] }}
                            transition={{
                                duration: 0.5,
                                delay: 2,
                                repeat: Infinity,
                                repeatDelay: 2,
                                ease: "easeInOut",
                            }}
                        >
                            <Trash2 className="w-6 h-6 text-red-500" />
                        </motion.div>
                    </motion.div>
                </div>

                <AlertDialogHeader className="text-center items-center">
                    <AlertDialogTitle className="text-lg font-semibold text-zinc-900">
                        Delete &quot;{vehicleType?.name}&quot;?
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-sm text-zinc-500">
                        This action cannot be undone. The vehicle type and all
                        associated data will be permanently removed.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex-row gap-2 mt-2">
                    <AlertDialogCancel
                        disabled={isPending}
                        className="cursor-pointer flex-1 border-zinc-200 text-zinc-700 hover:bg-zinc-50 h-10"
                    >
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isPending}
                        className="cursor-pointer flex-1 bg-red-600 hover:bg-red-500 text-white gap-2 h-10 disabled:opacity-70"
                    >
                        {isPending ? (
                            <>
                                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
