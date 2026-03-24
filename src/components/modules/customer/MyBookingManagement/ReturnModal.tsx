"use client";

import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    Car,
    CalendarDays,
    Clock,
    AlertTriangle,
    ReceiptText,
} from "lucide-react";
import { format, differenceInCalendarDays } from "date-fns";

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
import { updateBooking } from "../../../../services/booking.services";
import { cn } from "@/lib/utils";
import { BookingStatusEnum } from "../../../../types/enum.type";

interface ReturnModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking: IBooking | null;
}

function fmt(n: number) {
    return new Intl.NumberFormat("en-BD").format(Math.round(n));
}

export default function ReturnModal({
    open,
    onOpenChange,
    booking,
}: ReturnModalProps) {
    const queryClient = useQueryClient();

    const now = useMemo(() => new Date(), [open]);

    // ── Client-side return cost preview ──────────────────────────────────────
    // Mirrors the backend logic so the customer sees an estimate before confirming.
    const preview = useMemo(() => {
        if (!booking) return null;

        const returnedAt = now;
        const endDate = new Date(booking.endDate);
        const pickedUpAt = booking.pickedUpAt
            ? new Date(booking.pickedUpAt)
            : now;

        // Actual days used (minimum 1)
        const actualDays = Math.max(
            1,
            differenceInCalendarDays(returnedAt, pickedUpAt),
        );

        // Late fee: days beyond the agreed endDate × pricePerDay × 1.2
        const isLate = returnedAt > endDate;
        const extraDays = isLate
            ? differenceInCalendarDays(returnedAt, endDate)
            : 0;
        const lateFee = extraDays * booking.pricePerDay * 1.2;

        // Base cost uses booking's totalDays (agreed) + any extra
        const totalDays = booking.totalDays + extraDays;
        const baseCost = totalDays * booking.pricePerDay;

        // Existing charges from booking (admin may have set these already)
        const fuelCharge = booking.fuelCharge ?? 0;
        const fuelCredit = booking.fuelCredit ?? 0;
        const damageCharge = booking.damageCharge ?? 0;

        const totalCost =
            baseCost + lateFee + fuelCharge + damageCharge - fuelCredit;
        const remainingDue = Math.max(0, totalCost - booking.advanceAmount);

        return {
            actualDays,
            isLate,
            extraDays,
            lateFee,
            baseCost,
            totalCost,
            remainingDue,
        };
    }, [booking, now]);

    const { mutate, isPending } = useMutation({
        mutationFn: () =>
            updateBooking(booking!.id, {
                status: BookingStatusEnum.RETURNED,
                returnedAt: now.toISOString(),
            }),
        onSuccess: () => {
            toast.success(
                "Vehicle returned! Pay the remaining amount to complete your booking.",
            );
            queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
            onOpenChange(false);
        },
        onError: (err: any) => {
            toast.error(
                err?.message ?? "Something went wrong. Please try again.",
            );
        },
    });

    if (!booking || !preview) return null;

    const v = booking.vehicle;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-zinc-900">
                        <ReceiptText className="w-5 h-5 text-[#FF5100]" />
                        Return Vehicle
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        Confirm that you have returned the vehicle. The admin
                        will verify fuel level and any damage before finalising
                        your bill.
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

                    {/* Date row */}
                    <div className="grid grid-cols-2 gap-2 border-t border-zinc-200 pt-3 text-xs text-zinc-600">
                        <div className="flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5 text-zinc-400" />
                            Picked up:{" "}
                            <span className="font-medium text-zinc-800 ml-1">
                                {booking.pickedUpAt
                                    ? format(
                                          new Date(booking.pickedUpAt),
                                          "MMM dd",
                                      )
                                    : "—"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-zinc-400" />
                            Returning:{" "}
                            <span className="font-medium text-zinc-800 ml-1">
                                {format(now, "MMM dd, yyyy")}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Late fee warning */}
                {preview.isLate && (
                    <div className="flex items-start gap-2.5 rounded-lg bg-red-50 border border-red-100 p-3 text-xs text-red-700">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                        <p>
                            You are returning{" "}
                            <span className="font-semibold">
                                {preview.extraDays} day
                                {preview.extraDays !== 1 ? "s" : ""} late.
                            </span>{" "}
                            A 20% late fee of{" "}
                            <span className="font-semibold">
                                ৳{fmt(preview.lateFee)}
                            </span>{" "}
                            will be added.
                        </p>
                    </div>
                )}

                {/* Minimum 1-day notice */}
                {!preview.isLate && preview.actualDays < 2 && (
                    <div className="flex items-start gap-2.5 rounded-lg bg-amber-50 border border-amber-100 p-3 text-xs text-amber-700">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                        <p>
                            Returning within the same day. A minimum of{" "}
                            <span className="font-semibold">1 day</span> is
                            charged.
                        </p>
                    </div>
                )}

                {/* Cost preview */}
                <div className="rounded-xl border border-zinc-100 divide-y divide-zinc-100 text-sm overflow-hidden">
                    <div className="flex justify-between px-4 py-2.5 text-zinc-600">
                        <span>Base cost</span>
                        <span className="font-medium text-zinc-800">
                            ৳{fmt(preview.baseCost)}
                        </span>
                    </div>
                    {preview.lateFee > 0 && (
                        <div className="flex justify-between px-4 py-2.5 text-red-600">
                            <span>Late fee ({preview.extraDays}d × 1.2×)</span>
                            <span className="font-medium">
                                +৳{fmt(preview.lateFee)}
                            </span>
                        </div>
                    )}
                    <div className="flex justify-between px-4 py-2.5 text-zinc-400 text-xs">
                        <span>Advance paid</span>
                        <span>−৳{fmt(booking.advanceAmount)}</span>
                    </div>
                    <div className="flex justify-between px-4 py-2.5 bg-zinc-50 font-semibold">
                        <span className="text-zinc-800">
                            Est. remaining due
                        </span>
                        <span
                            className={cn(
                                preview.remainingDue > 0
                                    ? "text-[#FF5100]"
                                    : "text-emerald-600",
                            )}
                        >
                            {preview.remainingDue > 0
                                ? `৳${fmt(preview.remainingDue)}`
                                : "Settled"}
                        </span>
                    </div>
                </div>

                <p className="text-[11px] text-zinc-400 -mt-1">
                    * Fuel and damage charges may be added by the admin after
                    inspection. The final amount may differ.
                </p>

                <DialogFooter className="gap-2 flex items-center">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
						className="flex-1 h-10 cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => mutate()}
                        disabled={isPending}
                        className="bg-[#FF5100] hover:bg-[#e04800] text-white flex-1 h-10 cursor-pointer"
                    >
                        {isPending ? "Confirming…" : "Confirm Return"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
