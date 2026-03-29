"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IPayment } from "../../../../types/payment.type";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../../../ui/alert-dialog";
import { deletePayment } from "../../../../services/payment.services";

interface DeletePaymentFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    vehicle: IPayment | null; // named "vehicle" to match useRowActionModalState shape in PaymentTable
}

export default function DeletePaymentFormModal({
    open,
    onOpenChange,
    vehicle: payment,
}: DeletePaymentFormModalProps) {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: () => deletePayment(payment!.id),
        onSuccess: (result: any) => {
            if (result?.success === false) {
                toast.error(result?.message || "Failed to delete payment.");
                return;
            }
            toast.success(result?.message || "Payment deleted successfully.");
            void queryClient.invalidateQueries({ queryKey: ["payments"] });
            onOpenChange(false);
        },
        onError: (error: any) => {
            toast.error(error?.message || "Something went wrong.");
        },
    });

    const handleDelete = () => {
        if (!payment) return;
        mutate();
    };

    if (!payment) return null;

    const paymentLabel = payment.type
        ? payment.type.replace(/_/g, " ").toLowerCase()
        : "payment";

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="animate-in fade-in-0 zoom-in-95 duration-200 max-w-sm">
                {/* Icon */}
                <div className="flex justify-center pt-2 pb-1">
                    <motion.div
                        className="w-14 h-14 rounded-full border bg-red-50 border-red-100 flex items-center justify-center"
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

                {/* Title + description */}
                <AlertDialogHeader className="text-center items-center">
                    <AlertDialogTitle className="text-lg font-semibold text-zinc-900 capitalize">
                        Delete {paymentLabel}?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-zinc-500">
                        This action cannot be undone. The payment record and all
                        associated invoice data will be permanently removed.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {/* Footer */}
                <AlertDialogFooter className="flex-row gap-2 mt-2">
                    <Button
                        variant="outline"
                        disabled={isPending}
                        onClick={() => onOpenChange(false)}
                        className="cursor-pointer flex-1 border-zinc-200 text-zinc-700 hover:bg-zinc-50 h-10"
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleDelete}
                        disabled={isPending}
                        className="cursor-pointer flex-1 bg-red-600 hover:bg-red-500 text-white gap-2 h-10"
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
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}