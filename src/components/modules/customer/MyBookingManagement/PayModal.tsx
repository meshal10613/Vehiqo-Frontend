"use client";

import { IBooking } from "../../../../types/booking.type";
import { AnimatePresence, motion } from "framer-motion";
import { X, CreditCard, Clock, ArrowRight } from "lucide-react";

function fmt(n: number) {
    return new Intl.NumberFormat("en-BD").format(n);
}

interface PayModalProps {
    open: boolean;
    onClose: () => void;
    booking: IBooking | null;
    onPayNow: (booking: IBooking) => void;
}

export default function PayModal({
    open,
    onClose,
    booking,
    onPayNow,
}: PayModalProps) {
    if (!booking) return null;

    const isAdvance = booking.status === "PENDING";
    const amount = isAdvance ? booking.advanceAmount : booking.remainingDue;
    const label = isAdvance ? "Advance payment" : "Remaining balance";
    const description = isAdvance
        ? "Pay the advance now to confirm your booking. You can also pay later from My Bookings."
        : "Settle the remaining balance to complete your booking.";

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
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
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-[#FF5100] px-6 py-5 relative">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-1">
                                {label}
                            </p>
                            <h2 className="text-white text-xl font-bold">
                                {booking.vehicle?.brand}{" "}
                                {booking.vehicle?.model}{" "}
                                <span className="font-normal opacity-80">
                                    {booking.vehicle?.year}
                                </span>
                            </h2>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Amount due */}
                            <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100 text-center">
                                <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2">
                                    Amount due
                                </p>
                                <p className="text-4xl font-extrabold text-zinc-900">
                                    ৳{fmt(amount)}
                                </p>
                                {isAdvance && (
                                    <p className="text-xs text-zinc-400 mt-2">
                                        Remaining ৳
                                        {fmt(
                                            booking.remainingDue -
                                                booking.advanceAmount >
                                                0
                                                ? booking.remainingDue
                                                : booking.totalCost -
                                                      booking.advanceAmount,
                                        )}{" "}
                                        due on return
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-sm text-zinc-500 text-center leading-relaxed">
                                {description}
                            </p>

                            {/* Actions */}
                            <div className="space-y-3">
                                <button
                                    onClick={() => onPayNow(booking)}
                                    className="w-full bg-[#FF5100] hover:bg-[#e04800] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-[#FF5100]/20 cursor-pointer"
                                >
                                    <CreditCard className="w-4 h-4" />
                                    Pay Now
                                    <ArrowRight className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={onClose}
                                    className="w-full py-3.5 rounded-xl border border-zinc-200 text-zinc-700 font-semibold hover:bg-zinc-50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                >
                                    <Clock className="w-4 h-4 text-zinc-400" />
                                    Pay Later
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
