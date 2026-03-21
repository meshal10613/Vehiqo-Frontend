"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import banner from "../../../../public/banner/banner.png";
import car1 from "../../../../public/banner/car1.png";
import car2 from "../../../../public/banner/car2.png";
import car3 from "../../../../public/banner/car3.png";
import Link from "next/link";

const cars: { src: StaticImageData; label: string }[] = [
    { src: car1, label: "Sports" },
    { src: car2, label: "Luxury" },
    { src: car3, label: "Premium" },
];

const perks = ["No Hidden Fees", "Free Cancellation", "24/7 Support"];

export default function Banner() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(
            () => setCurrent((p) => (p + 1) % cars.length),
            3500,
        );
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative w-full bg-white overflow-hidden flex items-center">
            <div className="w-full container mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 relative">
                <div className="flex flex-col md:flex-row items-center lg:items-stretch h-150 xl:h-175 gap-0">
                    {/* ── LEFT ──────────────────────────────────────────────── */}
                    <div className="flex-1 flex flex-col justify-center gap-5 lg:gap-6 z-10 pt-16 lg:pt-0 pb-8 lg:pb-0">
                        {/* headline */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.7,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            <h1
                                className="font-black leading-none tracking-tight"
                                style={{
                                    fontSize: "clamp(2.4rem, 5.5vw, 5rem)",
                                }}
                            >
                                <span className="text-[#FF5100]">
                                    Rent Smart.
                                </span>
                                <br />
                                <span className="text-zinc-900">
                                    Drive Anywhere
                                </span>
                                <br />
                                <span className="text-zinc-900">
                                    with Vehiqo.
                                </span>
                            </h1>
                        </motion.div>

                        {/* subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.7,
                                delay: 0.15,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="text-zinc-500 text-sm sm:text-base max-w-sm leading-relaxed"
                        >
                            Affordable, reliable, and hassle-free car rentals in
                            minutes.
                        </motion.p>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.7,
                                delay: 0.25,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            <Link
                                href={`/vehicles`}
                                className="inline-flex items-center gap-2.5 bg-[#FF5100] hover:bg-orange-600 active:scale-95 text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg transition-all duration-200 shadow-lg shadow-orange-200"
                            >
                                Start Booking
                                <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5" />
                            </Link>
                        </motion.div>

                        {/* car dots */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-2 pt-2"
                        >
                            {cars.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrent(i)}
                                    className="cursor-pointer transition-all duration-300 rounded-full"
                                    style={{
                                        width:
                                            i === current ? "2rem" : "0.5rem",
                                        height: "0.375rem",
                                        backgroundColor:
                                            i === current
                                                ? "#FF5100"
                                                : "#d4d4d8",
                                    }}
                                />
                            ))}
                        </motion.div>
                    </div>

                    {/* ── RIGHT ─────────────────────────────────────────────── */}
                    <div className="flex-1 relative flex items-center justify-center lg:justify-end">
                        <div
                            className="absolute top-0 right-0 lg:-right-6 xl:-right-12 lg:block w-full h-full"
                            style={{
                                // borderRadius:
                                //     "48% 42% 38% 60% / 46% 44% 54% 50%",
                                // overflow: "hidden",
                            }}
                        >
                            <Image
                                src={banner}
                                alt="background"
                                fill
                                className="object-cover"
                                priority
                            />
                            {/* dark overlay */}
                            <div className="absolute inset-0 bg-zinc-900/55" />

                            {/* CAR RENTAL text inside blob */}
                            {/* <div className="absolute top-4 left-6 sm:top-6 sm:left-10 pointer-events-none select-none">
                                <p
                                    className="font-black uppercase leading-none text-white/20"
                                    style={{
                                        fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                                        WebkitTextStroke:
                                            "1px rgba(255,255,255,0.25)",
                                        letterSpacing: "-0.02em",
                                    }}
                                >
                                    CAR
                                    <br />
                                    RENTAL
                                </p>
                            </div> */}

                            {/* perks — right side inside blob */}
                            {/* <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2.5">
                                {perks.map((perk, i) => (
                                    <motion.div
                                        key={perk}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + i * 0.1 }}
                                        className="flex items-center gap-2"
                                    >
                                        <CheckCircle2 className="h-4 w-4 text-white shrink-0" />
                                        <span className="text-white text-xs sm:text-sm font-medium whitespace-nowrap">
                                            {perk}
                                        </span>
                                    </motion.div>
                                ))}
                            </div> */}
                        </div>

                        {/* ── CAR (in front of blob, bleeds below) ─────────── */}
                        <div
                            className="relative z-10"
                            style={{
                                width: "clamp(400px, 55vw, 820px)",
                                marginTop: "clamp(60px, 10vh, 120px)",
                            }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={current}
                                    initial={{ opacity: 0, x: 60, scale: 0.94 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: -60, scale: 0.94 }}
                                    transition={{
                                        duration: 0.55,
                                        ease: [0.25, 0.46, 0.45, 0.94],
                                    }}
                                    style={{
                                        filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.35)) drop-shadow(0 8px 16px rgba(0,0,0,0.2))",
                                    }}
                                >
                                    <Image
                                        src={cars[current].src}
                                        alt={cars[current].label}
                                        width={820}
                                        height={460}
                                        className="w-full h-auto object-contain"
                                        priority
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* ground shadow ellipse */}
                            <div
                                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-8 rounded-full blur-2xl"
                                style={{ background: "rgba(0,0,0,0.18)" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


