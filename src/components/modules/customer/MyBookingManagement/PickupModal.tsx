"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Car, CalendarDays, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import { IBooking } from "../../../../types/booking.type";
import { BookingStatusEnum } from "../../../../types/enum.type";
import { updateBooking } from "../../../../services/booking.services";

interface PickupModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking: IBooking | null;
}

export default function PickupModal({
    open,
    onOpenChange,
    booking,
}: PickupModalProps) {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: () =>
            updateBooking(booking!.id, {
                status: BookingStatusEnum.PICKED_UP,
                pickedUpAt: new Date().toISOString(),
            }),
        onSuccess: (result: any) => {
			console.log(result)
            if (result?.success === false) {
                toast.error(result?.message || "Failed to cancel booking.");
                return;
            }
            toast.success(result?.message || "Booking picked up successfully.");
            void queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
            onOpenChange(false);
        },
        onError: (err: any) => {
            toast.error(
                err?.message ?? "Something went wrong. Please try again.",
            );
        },
    });

    if (!booking) return null;

    const v = booking.vehicle;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-zinc-900">
                        <Car className="w-5 h-5 text-[#FF5100]" />
                        Confirm Pick-Up
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        Confirm that you have physically received the vehicle.
                        The rental period starts from today.
                    </DialogDescription>
                </DialogHeader>

                {/* Vehicle info */}
                <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 space-y-3">
                    <div className="flex items-center gap-3">
                        {v?.image?.[0] ? (
                            <img
                                src={v.image[0]}
                                alt={`${v.brand} ${v.model}`}
                                className="w-14 h-10 rounded-lg object-cover border border-zinc-200"
                            />
                        ) : (
                            <div className="w-14 h-10 rounded-lg bg-zinc-200 flex items-center justify-center">
                                <Car className="w-5 h-5 text-zinc-400" />
                            </div>
                        )}
                        <div>
                            <p className="font-semibold text-zinc-800">
                                {v?.brand} {v?.model}
                            </p>
                            <p className="text-xs text-zinc-400">
                                {v?.year} · {v?.plateNo}
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-zinc-200 pt-3 grid grid-cols-2 gap-2 text-xs text-zinc-600">
                        <div className="flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5 text-zinc-400" />
                            <span>
                                Start:{" "}
                                <span className="font-medium text-zinc-800">
                                    {format(
                                        new Date(booking.startDate),
                                        "MMM dd, yyyy",
                                    )}
                                </span>
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5 text-zinc-400" />
                            <span>
                                End:{" "}
                                <span className="font-medium text-zinc-800">
                                    {format(
                                        new Date(booking.endDate),
                                        "MMM dd, yyyy",
                                    )}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Notice */}
                <div className="flex items-start gap-2.5 rounded-lg bg-amber-50 border border-amber-100 p-3 text-xs text-amber-700">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                    <p>
                        Once confirmed, the rental clock starts. Even if you
                        return the vehicle the same day, a minimum of{" "}
                        <span className="font-semibold">1 day</span> will be
                        charged.
                    </p>
                </div>

                <DialogFooter className="gap-5 flex items-center">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="flex-1 h-10 cursor-pointer"
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => mutate()}
                        disabled={isPending}
                        className="bg-[#FF5100] hover:bg-[#e04800] text-white flex-1 h-10 cursor-pointer"
                    >
                        {isPending ? "Confirming…" : "Confirm Pick-Up"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
