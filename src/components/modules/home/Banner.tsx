// "use client";

// import { motion, AnimatePresence } from "framer-motion";
// import { useEffect, useState } from "react";
// import Image, { StaticImageData } from "next/image";
// import { CalendarDays, CheckCircle2 } from "lucide-react";
// import banner from "../../../../public/banner/banner.png";
// import car1 from "../../../../public/banner/car1.png";
// import car2 from "../../../../public/banner/car2.png";
// import car3 from "../../../../public/banner/car3.png";
// import Link from "next/link";

// const cars: { src: StaticImageData; label: string }[] = [
//     { src: car1, label: "Sports" },
//     { src: car2, label: "Luxury" },
//     { src: car3, label: "Premium" },
// ];

// const perks = ["No Hidden Fees", "Free Cancellation", "24/7 Support"];

// export default function Banner() {
//     const [current, setCurrent] = useState(0);

//     useEffect(() => {
//         const timer = setInterval(
//             () => setCurrent((p) => (p + 1) % cars.length),
//             3500,
//         );
//         return () => clearInterval(timer);
//     }, []);

//     return (
//         <section className="relative w-full bg-white overflow-hidden flex items-center">
//             <div className="w-full container mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 relative">
//                 <div className="flex flex-col md:flex-row items-center lg:items-stretch h-150 xl:h-175 gap-0">
//                     {/* ── LEFT ──────────────────────────────────────────────── */}
//                     <div className="flex-1 flex flex-col justify-center gap-5 lg:gap-6 z-10 pt-16 lg:pt-0 pb-8 lg:pb-0">
//                         {/* headline */}
//                         <motion.div
//                             initial={{ opacity: 0, y: 40 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{
//                                 duration: 0.7,
//                                 ease: [0.22, 1, 0.36, 1],
//                             }}
//                         >
//                             <h1
//                                 className="font-black leading-none tracking-tight"
//                                 style={{
//                                     fontSize: "clamp(2.4rem, 5.5vw, 5rem)",
//                                 }}
//                             >
//                                 <span className="text-[#FF5100]">
//                                     Rent Smart.
//                                 </span>
//                                 <br />
//                                 <span className="text-zinc-900">
//                                     Drive Anywhere
//                                 </span>
//                                 <br />
//                                 <span className="text-zinc-900">
//                                     with Vehiqo.
//                                 </span>
//                             </h1>
//                         </motion.div>

//                         {/* subtitle */}
//                         <motion.p
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{
//                                 duration: 0.7,
//                                 delay: 0.15,
//                                 ease: [0.22, 1, 0.36, 1],
//                             }}
//                             className="text-zinc-500 text-sm sm:text-base max-w-sm leading-relaxed"
//                         >
//                             Affordable, reliable, and hassle-free car rentals in
//                             minutes.
//                         </motion.p>

//                         {/* CTA */}
//                         <motion.div
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{
//                                 duration: 0.7,
//                                 delay: 0.25,
//                                 ease: [0.22, 1, 0.36, 1],
//                             }}
//                         >
//                             <Link
//                                 href={`/vehicles`}
//                                 className="inline-flex items-center gap-2.5 bg-[#FF5100] hover:bg-orange-600 active:scale-95 text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg transition-all duration-200 shadow-lg shadow-orange-200"
//                             >
//                                 Start Booking
//                                 <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5" />
//                             </Link>
//                         </motion.div>

//                         {/* car dots */}
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ delay: 0.4 }}
//                             className="flex items-center gap-2 pt-2"
//                         >
//                             {cars.map((_, i) => (
//                                 <button
//                                     key={i}
//                                     onClick={() => setCurrent(i)}
//                                     className="cursor-pointer transition-all duration-300 rounded-full"
//                                     style={{
//                                         width:
//                                             i === current ? "2rem" : "0.5rem",
//                                         height: "0.375rem",
//                                         backgroundColor:
//                                             i === current
//                                                 ? "#FF5100"
//                                                 : "#d4d4d8",
//                                     }}
//                                 />
//                             ))}
//                         </motion.div>
//                     </div>

//                     {/* ── RIGHT ─────────────────────────────────────────────── */}
//                     <div className="flex-1 relative flex items-center justify-center lg:justify-end">
//                         <div
//                             className="absolute top-0 right-0 lg:-right-6 xl:-right-12 lg:block w-full h-full"
//                             style={{
//                                 // borderRadius:
//                                 //     "48% 42% 38% 60% / 46% 44% 54% 50%",
//                                 // overflow: "hidden",
//                             }}
//                         >
//                             <Image
//                                 src={banner}
//                                 alt="background"
//                                 fill
//                                 className="object-cover"
//                                 priority
//                             />
//                             {/* dark overlay */}
//                             <div className="absolute inset-0 bg-zinc-900/55" />

//                             {/* CAR RENTAL text inside blob */}
//                             {/* <div className="absolute top-4 left-6 sm:top-6 sm:left-10 pointer-events-none select-none">
//                                 <p
//                                     className="font-black uppercase leading-none text-white/20"
//                                     style={{
//                                         fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
//                                         WebkitTextStroke:
//                                             "1px rgba(255,255,255,0.25)",
//                                         letterSpacing: "-0.02em",
//                                     }}
//                                 >
//                                     CAR
//                                     <br />
//                                     RENTAL
//                                 </p>
//                             </div> */}

//                             {/* perks — right side inside blob */}
//                             {/* <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2.5">
//                                 {perks.map((perk, i) => (
//                                     <motion.div
//                                         key={perk}
//                                         initial={{ opacity: 0, x: 20 }}
//                                         animate={{ opacity: 1, x: 0 }}
//                                         transition={{ delay: 0.3 + i * 0.1 }}
//                                         className="flex items-center gap-2"
//                                     >
//                                         <CheckCircle2 className="h-4 w-4 text-white shrink-0" />
//                                         <span className="text-white text-xs sm:text-sm font-medium whitespace-nowrap">
//                                             {perk}
//                                         </span>
//                                     </motion.div>
//                                 ))}
//                             </div> */}
//                         </div>

//                         {/* ── CAR (in front of blob, bleeds below) ─────────── */}
//                         <div
//                             className="relative z-10"
//                             style={{
//                                 width: "clamp(400px, 55vw, 820px)",
//                                 marginTop: "clamp(60px, 10vh, 120px)",
//                             }}
//                         >
//                             <AnimatePresence mode="wait">
//                                 <motion.div
//                                     key={current}
//                                     initial={{ opacity: 0, x: 60, scale: 0.94 }}
//                                     animate={{ opacity: 1, x: 0, scale: 1 }}
//                                     exit={{ opacity: 0, x: -60, scale: 0.94 }}
//                                     transition={{
//                                         duration: 0.55,
//                                         ease: [0.25, 0.46, 0.45, 0.94],
//                                     }}
//                                     style={{
//                                         filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.35)) drop-shadow(0 8px 16px rgba(0,0,0,0.2))",
//                                     }}
//                                 >
//                                     <Image
//                                         src={cars[current].src}
//                                         alt={cars[current].label}
//                                         width={820}
//                                         height={460}
//                                         className="w-full h-auto object-contain"
//                                         priority
//                                     />
//                                 </motion.div>
//                             </AnimatePresence>

//                             {/* ground shadow ellipse */}
//                             <div
//                                 className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-8 rounded-full blur-2xl"
//                                 style={{ background: "rgba(0,0,0,0.18)" }}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// }

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

export default function Banner() {
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
                                500<span className="text-[#FF5100]">+</span>
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
                                4.9 · 200+ reviews
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
