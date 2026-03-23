"use client";

import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
    XCircle,
    AlertTriangle,
    RefreshCw,
    Home,
    ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

// ── ripple ring (red version) ───────────────────────────────────────────────
function RippleRing({ delay }: { delay: number }) {
    return (
        <motion.span
            className="absolute inset-0 rounded-full border border-red-300 dark:border-red-700"
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

// ── page ─────────────────────────────────────────────────────────────────────
export default function PaymentFailed() {
    const router = useRouter();
    const params = useParams();
    const bookingId = params.id as string;

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
            {/* ambient blobs */}
            <div className="pointer-events-none absolute -right-32 -top-32 h-105 w-105 rounded-full bg-red-500/5 blur-[90px]" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-[320px] rounded-full bg-yellow-500/5 blur-[80px]" />

            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="w-full max-w-md"
                >
                    <Card className="overflow-hidden border-border/60 shadow-2xl">
                        {/* top accent bar */}
                        <motion.div
                            className="h-1 w-full bg-linear-to-r from-red-500 via-red-400 to-yellow-500"
                            initial={{ scaleX: 0, originX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                        />

                        <CardContent className="px-8 py-10">
                            {/* icon */}
                            <div className="mb-7 flex justify-center">
                                <div className="relative flex items-center justify-center">
                                    <RippleRing delay={0.8} />
                                    <RippleRing delay={1.2} />

                                    <motion.div
                                        variants={scaleIn}
                                        initial="hidden"
                                        animate="show"
                                        className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 ring-2 ring-red-200 dark:bg-red-950/40 dark:ring-red-800"
                                    >
                                        <XCircle
                                            size={38}
                                            className="text-red-500"
                                            strokeWidth={1.8}
                                        />
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
                                    className="mb-3 gap-1.5 bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                                >
                                    <AlertTriangle size={12} />
                                    Payment Failed
                                </Badge>

                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    Payment was not successful
                                </h1>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    Something went wrong or the payment was
                                    cancelled. You can try again safely.
                                </p>
                            </motion.div>

                            {/* booking id */}
                            <motion.div
                                className="mb-6 flex justify-center"
                                variants={fadeUp}
                                custom={0.45}
                                initial="hidden"
                                animate="show"
                            >
                                <div className="rounded-full border border-red-200 bg-red-50 px-4 py-1.5 font-mono text-xs font-medium text-red-600 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400">
                                    Booking #
                                    {bookingId?.slice(-10).toUpperCase()}
                                </div>
                            </motion.div>

                            {/* actions */}
                            <motion.div
                                className="flex items-center gap-2.5"
                                variants={fadeUp}
                                custom={0.6}
                                initial="hidden"
                                animate="show"
                            >
                                <Button
                                    variant="outline"
                                    className="flex-1 gap-2 text-muted-foreground cursor-pointer h-10"
                                    onClick={() => router.push("/")}
                                >
                                    <Home size={14} />
                                    Back to Home
                                </Button>
                                <Button
                                    className="flex-1 gap-2 font-semibold cursor-pointer h-10"
                                    onClick={() =>
                                        router.push("/dashboard/my-bookings")
                                    }
                                >
                                    View My Bookings
                                    <ArrowRight size={15} />
                                </Button>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
