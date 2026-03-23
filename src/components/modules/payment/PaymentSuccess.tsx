"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
    CheckCircle2,
    CalendarDays,
    Clock,
    Banknote,
    ArrowRight,
    Home,
} from "lucide-react";

import { getBookingById } from "../../../services/booking.services";
import { IBooking } from "../../../types/booking.type";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookingStatus } from "../../../types/enum.type";

// ── animation variants ──────────────────────────────────────────────────────
const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay },
    }),
};

const scaleIn: Variants = {
    hidden: { scale: 0, opacity: 0 },
    show: {
        scale: 1,
        opacity: 1,
        transition: { type: "spring", stiffness: 260, damping: 18, delay: 0.1 },
    },
};

const staggerContainer: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.55 } },
};

const staggerItem: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// ── ripple ring ──────────────────────────────────────────────────────────────
function RippleRing({ delay }: { delay: number }) {
    return (
        <motion.span
            className="absolute inset-0 rounded-full border border-green-300 dark:border-green-700"
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 1.9, opacity: 0 }}
            transition={{
                duration: 1.6,
                ease: "easeOut",
                delay,
                repeat: Infinity,
                repeatDelay: 1.2,
            }}
        />
    );
}

// ── detail card ──────────────────────────────────────────────────────────────
function DetailCard({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
}) {
    return (
        <motion.div variants={staggerItem}>
            <div className="flex items-start gap-3 rounded-xl bg-muted/50 px-4 py-3">
                <div className="mt-0.5 rounded-md bg-primary/10 p-1.5 text-primary">
                    <Icon size={14} />
                </div>
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        {label}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground">
                        {value}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

// ── page ─────────────────────────────────────────────────────────────────────
export default function PaymentSuccess() {
    const router = useRouter();
    const params = useParams();
    const bookingId = params.id as string;

    const {
        data: BookingData,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ["booking", bookingId],
        queryFn: () => getBookingById(bookingId),
    });

    const booking: IBooking | null = BookingData?.data ?? null;
    const isProcessing = isLoading || isFetching;

    const fmt = (d: string | Date) =>
        new Date(d).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

    const paid =
        booking?.status === "ADVANCE_PAID"
            ? booking?.status.split("_").join(" ")
            : (booking?.status as BookingStatus);

    const paymentAmount =
        booking?.status === "ADVANCE_PAID"
            ? booking?.payments?.find((payment) => payment.type === "ADVANCE")?.amount 
            : booking?.payments?.find((payment) => payment.type === "FINAL")?.amount ;

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
            {/* ambient blobs */}
            <div className="pointer-events-none absolute -right-32 -top-32 h-105 w-105 rounded-full bg-primary/5 blur-[90px]" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-[320px] rounded-full bg-green-500/5 blur-[80px]" />

            <AnimatePresence mode="wait">
                {/* ── LOADING ── */}
                {isProcessing ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.94 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="w-full max-w-sm border-border/60 shadow-xl">
                            <CardContent className="flex flex-col items-center gap-6 px-10 py-14 text-center">
                                {/* spinner */}
                                <motion.span
                                    className="block h-14 w-14 rounded-full border-[3px] border-primary/20 border-t-primary"
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 0.85,
                                        ease: "linear",
                                        repeat: Infinity,
                                    }}
                                />

                                {/* dots */}
                                <div className="flex gap-1.5">
                                    {[0, 0.18, 0.36].map((d, i) => (
                                        <motion.span
                                            key={i}
                                            className="h-1.5 w-1.5 rounded-full bg-primary"
                                            animate={{
                                                scale: [0.6, 1, 0.6],
                                                opacity: [0.4, 1, 0.4],
                                            }}
                                            transition={{
                                                duration: 1.2,
                                                delay: d,
                                                repeat: Infinity,
                                            }}
                                        />
                                    ))}
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-lg font-semibold tracking-tight text-foreground">
                                        Processing Payment
                                    </p>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        Please wait while we confirm
                                        <br />
                                        your payment with the bank.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    /* ── SUCCESS ── */
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="w-full max-w-md"
                    >
                        <Card className="overflow-hidden border-border/60 shadow-2xl">
                            {/* top accent bar */}
                            <motion.div
                                className="h-1 w-full bg-linear-to-r from-primary via-primary/70 to-green-500"
                                initial={{ scaleX: 0, originX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{
                                    duration: 0.7,
                                    ease: [0.22, 1, 0.36, 1],
                                    delay: 0.1,
                                }}
                            />

                            <CardContent className="px-8 py-10">
                                {/* check icon */}
                                <div className="mb-7 flex justify-center">
                                    <div className="relative flex items-center justify-center">
                                        <RippleRing delay={0.9} />
                                        <RippleRing delay={1.35} />

                                        <motion.div
                                            variants={scaleIn}
                                            initial="hidden"
                                            animate="show"
                                            className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 ring-2 ring-green-200 dark:bg-green-950/40 dark:ring-green-800"
                                        >
                                            <motion.div
                                                initial={{
                                                    scale: 0,
                                                    rotate: -30,
                                                }}
                                                animate={{
                                                    scale: 1,
                                                    rotate: 0,
                                                }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 300,
                                                    damping: 15,
                                                    delay: 0.35,
                                                }}
                                            >
                                                <CheckCircle2
                                                    size={38}
                                                    className="text-green-500"
                                                    strokeWidth={1.8}
                                                />
                                            </motion.div>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* heading */}
                                <motion.div
                                    className="mb-6 text-center"
                                    variants={fadeUp}
                                    custom={0.3}
                                    initial="hidden"
                                    animate="show"
                                >
                                    <Badge
                                        variant="secondary"
                                        className="mb-3 gap-1.5 bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400"
                                    >
                                        <motion.span
                                            className="inline-block h-1.5 w-1.5 rounded-full bg-green-500"
                                            animate={{ opacity: [1, 0.3, 1] }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                            }}
                                        />
                                        Payment Confirmed
                                    </Badge>

                                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                        Your booking is secured!
                                    </h1>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        Advance payment received. We'll have
                                        everything ready for your pickup.
                                    </p>
                                </motion.div>

                                {booking && (
                                    <>
                                        {/* booking ID */}
                                        <motion.div
                                            className="mb-5 flex justify-center"
                                            variants={fadeUp}
                                            custom={0.42}
                                            initial="hidden"
                                            animate="show"
                                        >
                                            <div className="rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 font-mono text-xs font-medium text-primary">
                                                #
                                                {booking.id
                                                    ?.slice(-10)
                                                    .toUpperCase()}
                                            </div>
                                        </motion.div>

                                        <Separator className="mb-5" />

                                        {/* details grid */}
                                        <motion.div
                                            className="mb-6 grid grid-cols-2 gap-2.5"
                                            variants={staggerContainer}
                                            initial="hidden"
                                            animate="show"
                                        >
                                            <DetailCard
                                                icon={CalendarDays}
                                                label="Pickup"
                                                value={fmt(booking.startDate)}
                                            />
                                            <DetailCard
                                                icon={CalendarDays}
                                                label="Return"
                                                value={fmt(booking.endDate)}
                                            />
                                            <DetailCard
                                                icon={Clock}
                                                label="Duration"
                                                value={`${booking.totalDays} day${booking.totalDays !== 1 ? "s" : ""}`}
                                            />
                                            <DetailCard
                                                icon={Banknote}
                                                label={paid}
                                                value={`৳${paymentAmount}`}
                                            />
                                        </motion.div>

                                        <Separator className="mb-5" />
                                    </>
                                )}

                                {/* actions */}
                                <motion.div
                                    className="flex items-center gap-2.5"
                                    variants={fadeUp}
                                    custom={0.7}
                                    initial="hidden"
                                    animate="show"
                                >
                                    <Button
                                        variant="outline"
                                        className="flex-1 gap-2 text-muted-foreground h-10 cursor-pointer"
                                        onClick={() => router.push("/")}
                                    >
                                        <Home size={14} />
                                        Back to Home
                                    </Button>
                                    <Button
                                        className="flex-1 gap-2 font-semibold shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 h-10 cursor-pointer"
                                        onClick={() =>
                                            router.push(
                                                "/dashboard/my-bookings",
                                            )
                                        }
                                    >
                                        View My Bookings
                                        <ArrowRight size={15} />
                                    </Button>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
