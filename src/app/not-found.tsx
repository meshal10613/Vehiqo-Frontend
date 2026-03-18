"use client";
import { motion, Variants } from "framer-motion";
import { Home, MoveLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const floatingOrbs = [
    { size: 320, x: "10%", y: "15%", delay: 0, duration: 8 },
    { size: 200, x: "75%", y: "60%", delay: 1.5, duration: 10 },
    { size: 140, x: "55%", y: "10%", delay: 0.8, duration: 7 },
    { size: 100, x: "20%", y: "70%", delay: 2, duration: 9 },
];

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.12,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 28 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
};

const digitVariants: Variants = {
    hidden: { opacity: 0, scale: 0.6, rotateX: 40 },
    show: {
        opacity: 1,
        scale: 1,
        rotateX: 0,
        transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    },
};

export default function NotFoundPage() {
    return (
        <div className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden px-6">
            {/* Floating background orbs */}
            {floatingOrbs.map((orb, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-rose-400/10 pointer-events-none"
                    style={{
                        width: orb.size,
                        height: orb.size,
                        left: orb.x,
                        top: orb.y,
                        filter: "blur(60px)",
                    }}
                    animate={{
                        y: [0, -24, 0],
                        scale: [1, 1.06, 1],
                    }}
                    transition={{
                        duration: orb.duration,
                        delay: orb.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Dot grid */}
            <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, #f43f5e28 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                }}
            />

            {/* Main content */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="relative z-10 flex flex-col items-center text-center max-w-xl w-full"
            >
                {/* Badge */}
                <motion.div variants={itemVariants}>
                    <Badge
                        variant="outline"
                        className="border-rose-300 text-primary bg-rose-50 text-xs tracking-widest uppercase mb-10 px-4 py-1.5"
                    >
                        <Compass className="w-3 h-3 mr-1.5 animate-spin animation-duration-[4s]" />
                        Page Not Found
                    </Badge>
                </motion.div>

                {/* 404 digits */}
                <div className="flex items-center gap-2 mb-8">
                    {["4", "0", "4"].map((digit, i) => (
                        <motion.span
                            key={i}
                            variants={digitVariants}
                            className="text-[120px] sm:text-[160px] font-black leading-none tracking-tighter select-none"
                            style={{
                                WebkitTextStroke:
                                    digit === "0" ? "3px #FF5100" : undefined,
                                color: digit !== "0" ? "#FF5100" : undefined,
                                textShadow:
                                    digit !== "0"
                                        ? "0 4px 32px rgba(244,63,94,0.2)"
                                        : "none",
                            }}
                        >
                            {digit}
                        </motion.span>
                    ))}
                </div>

                {/* Animated underline */}
                <motion.div
                    className="h-px bg-linear-to-r from-transparent via-primary to-transparent mb-8"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "100%", opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                />

                {/* Text */}
                <motion.h1
                    variants={itemVariants}
                    className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mb-3"
                >
                    Looks like you&apos;re lost
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-zinc-500 text-sm leading-relaxed mb-10 max-w-sm"
                >
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    Let&apos;s get you back on track.
                </motion.p>

                {/* Actions */}
                <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-3 flex-wrap justify-center"
                >
                    <Button
                        className="bg-primary hover:bg-primary text-white gap-2 shadow-lg shadow-primary/20 transition-all duration-200 cursor-pointer h-10"
                    >
                        <Link href="/" className="flex items-center gap-2">
                            <Home className="w-4 h-4" />
                            Back to Home
                        </Link>
                    </Button>

                    <Button
                        variant="outline"
                        className="border-zinc-200 text-zinc-700 hover:bg-zinc-50 gap-2 transition-all duration-200 cursor-pointer h-10"
                        onClick={() => window.history.back()}
                    >
                        <span onClick={() => window.history.back()} className="flex items-center gap-2 cursor-pointer">
                            <MoveLeft className="w-4 h-4" />
                            Go Back
                        </span>
                    </Button>
                </motion.div>

                {/* Floating decorative dots */}
                <motion.div
                    className="absolute -top-8 -right-8 w-20 h-20 pointer-events-none"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 rounded-full bg-primary/80"
                            style={{
                                top: `${50 + 40 * Math.sin((i * Math.PI * 2) / 6)}%`,
                                left: `${50 + 40 * Math.cos((i * Math.PI * 2) / 6)}%`,
                                transform: "translate(-50%, -50%)",
                            }}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
}
