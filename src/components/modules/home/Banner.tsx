"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Shield, Clock, Star } from "lucide-react";

import banner from "../../../../public/banner/banner.png";
import car1 from "../../../../public/banner/car1.png";
import car2 from "../../../../public/banner/car2.png";
import car3 from "../../../../public/banner/car3.png";
import { IPublicStats } from "../../../types/stats.type";

// ── DATA ──────────────────────────────────────────────────────────────────────

const CARS = [
    { src: car1, alt: "Sports Coupe" },
    { src: car2, alt: "SUV" },
    { src: car3, alt: "Supercar" },
];

const TRUST_BADGES = [
    { icon: Shield, label: "Fully Insured" },
    { icon: Clock, label: "24/7 Support" },
    { icon: Star, label: "Top Rated" },
];

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function Banner({ stat }: { stat: IPublicStats }) {
    const [carIndex, setCarIndex] = useState(0);

    // Rotate cars every 3s
    useEffect(() => {
        const interval = setInterval(() => {
            setCarIndex((prev) => (prev + 1) % CARS.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative min-h-[90vh] bg-zinc-900 overflow-hidden flex items-center">
            {/* ── Background dot grid ── */}
            <div
                className="absolute inset-0 opacity-[0.07] pointer-events-none"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                }}
            />

            {/* ── Orange gradient wash — bottom left ── */}
            <div className="absolute -bottom-32 -left-32 w-125 h-125 rounded-full bg-[#FF5100]/15 blur-3xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-75 h-75 rounded-full bg-[#FF5100]/8 blur-3xl pointer-events-none" />

            {/* ── Top accent line ── */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#FF5100]/50 to-transparent" />

            <div className="relative w-full container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* ── LEFT: Text Content ── */}
                    <div className="space-y-8 order-2 lg:order-1">
                        {/* Pill badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                ease: "easeOut" as const,
                                delay: 0.1,
                            }}
                        >
                            <div className="inline-flex items-center gap-2 bg-[#FF5100]/15 border border-[#FF5100]/25 text-[#FF5100] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5100] animate-pulse" />
                                Bangladesh's Premium Rental
                            </div>
                        </motion.div>

                        {/* Heading */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.55,
                                ease: "easeOut" as const,
                                delay: 0.2,
                            }}
                        >
                            <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.05] tracking-tight text-white">
                                Drive Your{" "}
                                <span className="text-[#FF5100]">Dream</span>
                                <br />
                                on Your Terms
                            </h1>
                        </motion.div>

                        {/* Description */}
                        <motion.p
                            className="text-base text-zinc-400 leading-relaxed max-w-md"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                ease: "easeOut" as const,
                                delay: 0.32,
                            }}
                        >
                            Choose from our verified fleet of cars, SUVs, and
                            more. Flexible rentals, transparent pricing, and a
                            seamless booking experience — all in one place.
                        </motion.p>

                        {/* CTA */}
                        <motion.div
                            className="flex flex-wrap items-center gap-4"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                ease: "easeOut" as const,
                                delay: 0.42,
                            }}
                        >
                            <Link
                                href="/vehicles"
                                className="group inline-flex items-center gap-2.5 bg-[#FF5100] hover:bg-[#e04800] text-white font-bold px-7 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-[#FF5100]/25 hover:shadow-[#FF5100]/40"
                            >
                                Start Booking
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                            </Link>
                            <Link
                                href="/vehicles"
                                className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors duration-200 underline underline-offset-4 decoration-zinc-700 hover:decoration-white"
                            >
                                Browse Fleet
                            </Link>
                        </motion.div>

                        {/* Trust badges */}
                        <motion.div
                            className="flex flex-wrap items-center gap-5 pt-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.55 }}
                        >
                            {TRUST_BADGES.map(({ icon: Icon, label }) => (
                                <div
                                    key={label}
                                    className="flex items-center gap-2 text-xs text-zinc-500 font-medium"
                                >
                                    <div className="w-6 h-6 rounded-lg bg-[#FF5100]/10 flex items-center justify-center">
                                        <Icon className="w-3.5 h-3.5 text-[#FF5100]" />
                                    </div>
                                    {label}
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* ── RIGHT: Images ── */}
                    <motion.div
                        className="relative order-1 lg:order-2 flex items-center justify-center"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 0.6,
                            ease: "easeOut" as const,
                            delay: 0.15,
                        }}
                    >
                        {/* Banner person image — static */}
                        <div className="relative w-72 sm:w-80 lg:w-96 xl:w-105 shrink-0">
                            <Image
                                src={banner}
                                alt="Happy customer"
                                className="w-full h-auto object-contain drop-shadow-2xl"
                                priority
                            />
                        </div>

                        {/* Rotating car — positioned to overlap bottom-right of banner */}
                        <div className="absolute -bottom-6 -right-4 sm:right-0 w-64 sm:w-72 lg:w-80 xl:w-90">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={carIndex}
                                    initial={{ opacity: 0, x: 40, scale: 0.92 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: -30, scale: 0.95 }}
                                    transition={{
                                        duration: 0.55,
                                        ease: "easeOut" as const,
                                    }}
                                >
                                    <Image
                                        src={CARS[carIndex].src}
                                        alt={CARS[carIndex].alt}
                                        className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(255,81,0,0.25)]"
                                        priority
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Car dot indicators */}
                            <div className="flex justify-center gap-1.5 mt-3">
                                {CARS.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCarIndex(i)}
                                        className={`rounded-full transition-all duration-300 cursor-pointer ${
                                            i === carIndex
                                                ? "w-5 h-1.5 bg-[#FF5100]"
                                                : "w-1.5 h-1.5 bg-zinc-600 hover:bg-zinc-400"
                                        }`}
                                        aria-label={`Show car ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Floating stat card */}
                        <motion.div
                            className="absolute top-4 -left-4 sm:left-0 bg-zinc-800/90 backdrop-blur-sm border border-zinc-700 rounded-2xl px-4 py-3 shadow-xl"
                            initial={{ opacity: 0, y: -12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: 0.7,
                                duration: 0.45,
                                ease: "easeOut" as const,
                            }}
                        >
                            <p className="text-2xl font-extrabold text-white leading-none">
                                {stat.vehicle}<span className="text-[#FF5100]">+</span>
                            </p>
                            <p className="text-xs text-zinc-400 mt-0.5 font-medium">
                                Fleet Vehicles
                            </p>
                        </motion.div>

                        {/* Floating rating card */}
                        <motion.div
                            className="absolute top-1/2 -translate-y-1/2 -right-2 sm:right-2 bg-zinc-800/90 backdrop-blur-sm border border-zinc-700 rounded-2xl px-4 py-3 shadow-xl"
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                delay: 0.85,
                                duration: 0.45,
                                ease: "easeOut" as const,
                            }}
                        >
                            <div className="flex items-center gap-1 mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-3 h-3 fill-amber-400 text-amber-400"
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-zinc-400 font-medium">
                                {stat.rating} · {stat.review}+ reviews
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* ── Bottom fade into next section ── */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-zinc-50 to-transparent pointer-events-none" />
        </section>
    );
}
