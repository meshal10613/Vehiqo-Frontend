"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    ArrowRight,
    Shield,
    Info,
    Loader2,
    CalendarDays,
    CreditCard,
    Clock,
    CheckCircle2,
    AlignLeft,
} from "lucide-react";
import { IVehicle } from "../../../types/vehicle.type";
import { createBooking } from "../../../services/booking.services";
import { createAdvancePaymentSession } from "../../../services/payment.services";
import { toast } from "sonner";

function fmt(n: number) {
    return new Intl.NumberFormat("en-BD").format(n);
}

function diffDays(a: Date, b: Date) {
    return Math.max(
        1,
        Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)),
    );
}

function toDateInputValue(d: Date) {
    return d.toISOString().split("T")[0];
}

function PaymentChoiceModal({
    open,
    bookingId,
    advanceAmount,
    onPayLater,
}: {
    open: boolean;
    bookingId: string;
    advanceAmount: number;
    onPayLater: () => void;
}) {
    const router = useRouter();

    const onPayNow = async (id: string) => {
        const result = await createAdvancePaymentSession(id);
        if (!result.success) {
            onPayLater();
            toast.error(result.message);
            return;
        }
        router.push(result.data.sessionUrl);
        onPayLater();
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 28, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 14, scale: 0.97 }}
                        transition={{
                            type: "spring",
                            stiffness: 320,
                            damping: 28,
                        }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Success header */}
                        <div className="bg-emerald-500 px-6 py-6 flex flex-col items-center text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 20,
                                    delay: 0.1,
                                }}
                                className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-3"
                            >
                                <CheckCircle2 className="w-8 h-8 text-white" />
                            </motion.div>
                            <h2 className="text-white text-xl font-bold">
                                Booking confirmed!
                            </h2>
                            <p className="text-emerald-100 text-sm mt-1">
                                Your booking is pending payment
                            </p>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Advance due notice */}
                            <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 text-center">
                                <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">
                                    Advance due
                                </p>
                                <p className="text-3xl font-extrabold text-zinc-900">
                                    ৳{fmt(advanceAmount)}
                                </p>
                                <p className="text-xs text-zinc-400 mt-1">
                                    Booking auto-cancels if not paid in time
                                </p>
                            </div>

                            {/* Options */}
                            <div className="space-y-3">
                                <button
                                    onClick={() => onPayNow(bookingId)}
                                    className="w-full bg-[#FF5100] hover:bg-[#e04800] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#FF5100]/20 cursor-pointer"
                                >
                                    <CreditCard className="w-4 h-4" />
                                    Pay Now
                                    <ArrowRight className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={onPayLater}
                                    className="w-full py-3.5 rounded-xl border border-zinc-200 text-zinc-700 font-semibold hover:bg-zinc-50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                >
                                    <Clock className="w-4 h-4 text-zinc-400" />
                                    Pay Later
                                </button>
                            </div>

                            <p className="text-xs text-zinc-400 text-center leading-relaxed">
                                You can pay later from{" "}
                                <span className="font-semibold text-zinc-600">
                                    My Bookings
                                </span>
                                . The vehicle will be held until the advance is
                                received.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export function BookingModal({
    open,
    onClose,
    vehicle,
}: {
    open: boolean;
    onClose: () => void;
    vehicle: IVehicle;
}) {
    const queryClient = useQueryClient();
    const today = toDateInputValue(new Date());
    const tomorrow = toDateInputValue(new Date(Date.now() + 86400000));

    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(tomorrow);
    const [notes, setNotes] = useState("");

    // Payment choice modal state — shown after successful booking creation
    const [paymentModal, setPaymentModal] = useState(false);
    const [createdBookingId, setCreatedBookingId] = useState<string | null>(
        null,
    );

    const days =
        startDate && endDate
            ? diffDays(new Date(startDate), new Date(endDate))
            : 1;
    const baseCost = days * vehicle.pricePerDay;
    // Advance is always 30% of base cost, minimum ৳200 (matches server validation)
    const advanceAmount = Math.max(200, Math.ceil(baseCost * 0.3));
    const remaining = baseCost - advanceAmount;

    const { mutate, isPending, error } = useMutation({
        mutationFn: () =>
            createBooking({
                vehicleId: vehicle.id,
                startDate,
                endDate,
                advanceAmount,
                // Only include notes if the user actually typed something
                ...(notes.trim() ? { notes: notes.trim() } : {}),
            }),
        onSuccess: (data) => {
            console.log(data);
            // data.data.id is the created booking's ID
            setCreatedBookingId(data.data.id);
            setPaymentModal(true);
            void queryClient.invalidateQueries({
                queryKey: ["vehicle-details"],
            });
            void queryClient.invalidateQueries({
                queryKey: ["vehicle"],
            });
        },
    });

    const handleClose = () => {
        // Reset form state when closing
        setStartDate(today);
        setEndDate(tomorrow);
        setNotes("");
        setPaymentModal(false);
        setCreatedBookingId(null);
        onClose();
    };

    return (
        <>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={handleClose}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 24, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 12, scale: 0.97 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 28,
                            }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header band */}
                            <div className="bg-[#FF5100] px-6 py-5">
                                <button
                                    onClick={handleClose}
                                    className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-1">
                                    Book This Vehicle
                                </p>
                                <h2 className="text-white text-xl font-bold">
                                    {vehicle.brand} {vehicle.model}{" "}
                                    <span className="font-normal opacity-80">
                                        {vehicle.year}
                                    </span>
                                </h2>
                            </div>

                            <div className="p-6 space-y-5">
                                {/* Date pickers */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
                                            Pick-up Date
                                        </label>
                                        <input
                                            type="date"
                                            min={today}
                                            value={startDate}
                                            onChange={(e) => {
                                                setStartDate(e.target.value);
                                                // Auto-advance endDate if it's no longer after startDate
                                                if (e.target.value >= endDate) {
                                                    setEndDate(
                                                        toDateInputValue(
                                                            new Date(
                                                                new Date(
                                                                    e.target
                                                                        .value,
                                                                ).getTime() +
                                                                    86400000,
                                                            ),
                                                        ),
                                                    );
                                                }
                                            }}
                                            className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#FF5100]/30 focus:border-[#FF5100] transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
                                            Return Date
                                        </label>
                                        <input
                                            type="date"
                                            min={
                                                startDate
                                                    ? toDateInputValue(
                                                          new Date(
                                                              new Date(
                                                                  startDate,
                                                              ).getTime() +
                                                                  86400000,
                                                          ),
                                                      )
                                                    : tomorrow
                                            }
                                            value={endDate}
                                            onChange={(e) =>
                                                setEndDate(e.target.value)
                                            }
                                            className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#FF5100]/30 focus:border-[#FF5100] transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Cost breakdown */}
                                <div className="bg-zinc-50 rounded-2xl p-4 space-y-3 border border-zinc-100">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">
                                            ৳{fmt(vehicle.pricePerDay)} × {days}{" "}
                                            day
                                            {days > 1 ? "s" : ""}
                                        </span>
                                        <span className="font-semibold text-zinc-800">
                                            ৳{fmt(baseCost)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500 flex items-center gap-1">
                                            <Info className="w-3.5 h-3.5" />
                                            Advance due now (৳200)
                                        </span>
                                        <span className="font-semibold text-[#FF5100]">
                                            ৳{fmt(advanceAmount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">
                                            Remaining on return
                                        </span>
                                        <span className="font-medium text-zinc-600">
                                            ৳{fmt(remaining)}
                                        </span>
                                    </div>
                                    <div className="border-t border-zinc-200 pt-3 flex justify-between">
                                        <span className="font-bold text-zinc-900">
                                            Total Estimate
                                        </span>
                                        <span className="font-bold text-zinc-900 text-lg">
                                            ৳{fmt(baseCost)}
                                        </span>
                                    </div>
                                </div>

                                {/* Notes — optional */}
                                <div>
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                                        <AlignLeft className="w-3.5 h-3.5" />
                                        Notes
                                        <span className="normal-case font-normal text-zinc-400">
                                            (optional)
                                        </span>
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) =>
                                            setNotes(e.target.value)
                                        }
                                        maxLength={500}
                                        rows={3}
                                        placeholder="Any special requests or information for the admin..."
                                        className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#FF5100]/30 focus:border-[#FF5100] transition-all resize-none"
                                    />
                                    <p className="text-right text-[11px] text-zinc-300 mt-1">
                                        {notes.length}/500
                                    </p>
                                </div>

                                {/* Server error */}
                                {error && (
                                    <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
                                        {(error as any)?.message ??
                                            "Something went wrong. Please try again."}
                                    </div>
                                )}

                                {/* Fine print */}
                                <p className="text-xs text-zinc-400 flex items-start gap-1.5">
                                    <Shield className="w-3.5 h-3.5 mt-0.5 shrink-0 text-zinc-400" />
                                    Final cost may vary based on fuel usage,
                                    late return, or damage charges assessed on
                                    return.
                                </p>

                                {/* CTA */}
                                <button
                                    onClick={() => mutate()}
                                    disabled={isPending}
                                    className="w-full bg-[#FF5100] hover:bg-[#e04800] disabled:bg-[#FF5100]/60 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-[#FF5100]/20 cursor-pointer disabled:cursor-not-allowed"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Creating booking...
                                        </>
                                    ) : (
                                        <>
                                            <CalendarDays className="w-5 h-5" />
                                            Confirm Booking
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Payment choice — layered on top of the booking modal backdrop */}
            {createdBookingId && (
                <PaymentChoiceModal
                    open={paymentModal}
                    bookingId={createdBookingId}
                    advanceAmount={advanceAmount}
                    onPayLater={handleClose}
                />
            )}
        </>
    );
}
