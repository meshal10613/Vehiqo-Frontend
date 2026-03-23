"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IBooking } from "../../../../types/booking.type";
import { cancelBooking } from "../../../../services/booking.services";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { BookingStatusEnum } from "../../../../types/enum.type";

interface CancelBookingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking: IBooking | null;
}

export default function CancelBookingDialog({
    open,
    onOpenChange,
    booking,
}: CancelBookingDialogProps) {
    const queryClient = useQueryClient();
    const serverData = {
        id: booking?.id as string,
        status: BookingStatusEnum.CANCELLED,
    };

    const { mutate, isPending } = useMutation({
        mutationFn: () => cancelBooking(serverData),
        onSuccess: (result: any) => {
            if (result?.success === false) {
                toast.error(result?.message || "Failed to cancel booking.");
                return;
            }
            toast.success("Booking cancelled successfully.");
            void queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
            onOpenChange(false);
        },
        onError: (error: any) => {
            toast.error(
                error.message || "Something went wrong.",
            );
        },
    });

    if (!booking) return null;

    const canCancel = booking.status === "PENDING";

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
                            animate={
                                canCancel
                                    ? { rotate: [0, -15, 15, -8, 8, 0] }
                                    : {}
                            }
                            transition={{
                                duration: 0.5,
                                delay: 2,
                                repeat: Infinity,
                                repeatDelay: 2,
                                ease: "easeInOut",
                            }}
                        >
                            <XCircle className="w-6 h-6 text-red-500" />
                        </motion.div>
                    </motion.div>
                </div>

                {/* Title + description */}
                <AlertDialogHeader className="text-center items-center">
                    <AlertDialogTitle className="text-lg font-semibold text-zinc-900">
                        {canCancel
                            ? "Cancel this booking?"
                            : "Cannot cancel booking"}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-zinc-500">
                        {canCancel ? (
                            <>
                                You're about to cancel your booking for{" "}
                                <span className="font-semibold text-zinc-700">
                                    {booking.vehicle?.brand}{" "}
                                    {booking.vehicle?.model}
                                </span>
                                . This action cannot be undone and the vehicle
                                will be released back to available.
                            </>
                        ) : (
                            <>
                                This booking can no longer be cancelled — the
                                advance payment has already been made. Please
                                contact support if you need assistance.
                            </>
                        )}
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
                        {canCancel ? "Keep booking" : "Close"}
                    </Button>

                    {canCancel && (
                        <Button
                            onClick={() => mutate()}
                            disabled={isPending}
                            className="cursor-pointer flex-1 bg-red-600 hover:bg-red-500 text-white gap-2 h-10"
                        >
                            {isPending ? (
                                <>
                                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    Cancelling...
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-4 h-4" />
                                    Yes, cancel
                                </>
                            )}
                        </Button>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
