"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    Car,
    Shield,
    Clock,
    Star,
    Users,
    MapPin,
    ArrowRight,
    CheckCircle2,
    Zap,
    HeartHandshake,
    Award,
    TrendingUp,
} from "lucide-react";

// ── ANIMATION VARIANTS ────────────────────────────────────────────────────────

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut" as const,
            delay: i * 0.1,
        },
    }),
};

// ── DATA ──────────────────────────────────────────────────────────────────────

const VALUES = [
    {
        icon: Shield,
        title: "Trust & Safety",
        description:
            "Every vehicle in our fleet is regularly inspected, insured, and maintained to the highest safety standards.",
    },
    {
        icon: Zap,
        title: "Seamless Experience",
        description:
            "From browsing to booking to returning — we've engineered every step to be fast, clear, and hassle-free.",
    },
    {
        icon: HeartHandshake,
        title: "Customer First",
        description:
            "We treat every renter as a partner. Transparent pricing, honest policies, and real human support.",
    },
    {
        icon: TrendingUp,
        title: "Always Growing",
        description:
            "We continuously expand our fleet, improve our platform, and listen to feedback to serve you better.",
    },
];

const MILESTONES = [
    { year: "2022", event: "Vehiqo founded in Barisal, Bangladesh" },
    { year: "2023", event: "Expanded fleet to 100+ verified vehicles" },
    { year: "2024", event: "Launched online booking & payment platform" },
    { year: "2025", event: "Reached 500+ vehicles & 200+ customer reviews" },
];

const TEAM = [
    {
        name: "Syed Mohiuddin Meshal",
        role: "Founder & Lead Developer",
        initials: "SM",
        bio: "MERN Stack Developer building Vehiqo from the ground up — handling everything from database design to frontend UX.",
        location: "Jhalakathi, Barisal",
    },
];

const WHY_US = [
    "Verified & insured fleet",
    "Transparent pricing — no hidden fees",
    "30% advance booking model",
    "Online payment via Stripe, bKash & more",
    "License-based vehicle matching",
    "24/7 customer support",
];

// ── SUB-COMPONENTS ────────────────────────────────────────────────────────────

function SectionBadge({ label }: { label: string }) {
    return (
        <div className="inline-flex items-center gap-2 bg-[#FF5100]/8 border border-[#FF5100]/15 text-[#FF5100] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5100] animate-pulse" />
            {label}
        </div>
    );
}

export default function About() {
    return (
        <div className="overflow-hidden">
            <section className="relative bg-zinc-900 overflow-hidden">
                {/* Dot grid */}
                <div
                    className="absolute inset-0 opacity-[0.07] pointer-events-none"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                    }}
                />
                <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#FF5100]/15 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#FF5100]/8 blur-3xl pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#FF5100]/50 to-transparent" />

                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        className="max-w-3xl"
                    >
                        <motion.div variants={fadeUp} custom={0}>
                            <SectionBadge label="About Vehiqo" />
                        </motion.div>
                        <motion.h1
                            variants={fadeUp}
                            custom={1}
                            className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.05] mb-6"
                        >
                            We're redefining{" "}
                            <span className="text-[#FF5100]">
                                vehicle rental
                            </span>{" "}
                            in Bangladesh
                        </motion.h1>
                        <motion.p
                            variants={fadeUp}
                            custom={2}
                            className="text-lg text-zinc-400 leading-relaxed max-w-xl"
                        >
                            Vehiqo was built with a simple mission — make
                            renting a vehicle as easy, transparent, and
                            trustworthy as possible for every person in
                            Bangladesh.
                        </motion.p>

                        <motion.div
                            variants={fadeUp}
                            custom={3}
                            className="flex flex-wrap gap-4 mt-8"
                        >
                            <Link
                                href="/vehicles"
                                className="group inline-flex items-center gap-2 bg-[#FF5100] hover:bg-[#e04800] text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-[#FF5100]/25"
                            >
                                Browse Fleet
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200"
                            >
                                Get in Touch
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                MISSION SPLIT
            ══════════════════════════════════════════ */}
            <section className="relative py-24 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-40 pointer-events-none"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                    }}
                />
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left */}
                        <motion.div
                            initial={{ opacity: 0, x: -24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.55,
                                ease: "easeOut" as const,
                            }}
                        >
                            <SectionBadge label="Our Mission" />
                            <h2 className="text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight mb-6">
                                Built for every{" "}
                                <span className="text-[#FF5100]">journey</span>,
                                <br />
                                not just every car
                            </h2>
                            <p className="text-base text-zinc-500 leading-relaxed mb-6">
                                Vehiqo started because renting a vehicle in
                                Bangladesh was unnecessarily complicated —
                                confusing prices, unreliable vehicles, and no
                                digital experience. We set out to change that.
                            </p>
                            <p className="text-base text-zinc-500 leading-relaxed">
                                Today, we operate a growing fleet of verified
                                vehicles with a fully digital booking pipeline,
                                multiple payment methods, and a customer
                                experience that actually respects your time.
                            </p>
                        </motion.div>

                        {/* Right: Why us checklist */}
                        <motion.div
                            initial={{ opacity: 0, x: 24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.55,
                                ease: "easeOut" as const,
                                delay: 0.1,
                            }}
                            className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-8"
                        >
                            <h3 className="text-base font-bold text-zinc-800 mb-6 flex items-center gap-2">
                                <Award className="w-5 h-5 text-[#FF5100]" />
                                Why choose Vehiqo
                            </h3>
                            <ul className="space-y-3.5">
                                {WHY_US.map((item, i) => (
                                    <motion.li
                                        key={item}
                                        initial={{ opacity: 0, x: 12 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.35,
                                            ease: "easeOut" as const,
                                            delay: i * 0.07,
                                        }}
                                        className="flex items-center gap-3 text-sm text-zinc-600"
                                    >
                                        <CheckCircle2 className="w-4 h-4 text-[#FF5100] shrink-0" />
                                        {item}
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                VALUES
            ══════════════════════════════════════════ */}
            <section className="relative py-24 bg-zinc-900 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.07] pointer-events-none"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                    }}
                />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#FF5100]/10 blur-3xl pointer-events-none" />

                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-14"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: "easeOut" as const }}
                    >
                        <SectionBadge label="Our Values" />
                        <h2 className="text-4xl font-extrabold text-white tracking-tight">
                            What drives us{" "}
                            <span className="text-[#FF5100]">forward</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {VALUES.map((value, i) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.4,
                                    ease: "easeOut" as const,
                                    delay: i * 0.08,
                                }}
                                className="group relative bg-zinc-800/60 border border-zinc-700 hover:border-[#FF5100]/30 rounded-2xl p-6 transition-all duration-300 overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-10 h-1 bg-[#FF5100] rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="w-11 h-11 rounded-xl bg-[#FF5100]/10 flex items-center justify-center mb-5 group-hover:bg-[#FF5100]/20 transition-colors">
                                    <value.icon
                                        className="w-5 h-5 text-[#FF5100]"
                                        strokeWidth={1.75}
                                    />
                                </div>
                                <h3 className="text-sm font-bold text-white mb-2">
                                    {value.title}
                                </h3>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                TIMELINE
            ══════════════════════════════════════════ */}
            {/* <section className="relative py-24 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-40 pointer-events-none"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                    }}
                />
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FF5100]/5 blur-3xl pointer-events-none" />

                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-14"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: "easeOut" as const }}
                    >
                        <SectionBadge label="Our Journey" />
                        <h2 className="text-4xl font-extrabold text-zinc-900 tracking-tight">
                            How we got{" "}
                            <span className="text-[#FF5100]">here</span>
                        </h2>
                    </motion.div>

                    <div className="relative">
                        <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-zinc-200 hidden lg:block" />

                        <div className="space-y-8">
                            {MILESTONES.map((m, i) => (
                                <motion.div
                                    key={m.year}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.4,
                                        ease: "easeOut" as const,
                                        delay: i * 0.1,
                                    }}
                                    className={`relative flex items-center gap-6 lg:gap-0 ${
                                        i % 2 === 0
                                            ? "lg:flex-row"
                                            : "lg:flex-row-reverse"
                                    }`}
                                >
                                    <div
                                        className={`lg:w-1/2 ${
                                            i % 2 === 0
                                                ? "lg:pr-12 lg:text-right"
                                                : "lg:pl-12 lg:text-left"
                                        }`}
                                    >
                                        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5 inline-block text-left lg:text-inherit w-full">
                                            <span className="text-xs font-black text-[#FF5100] uppercase tracking-widest">
                                                {m.year}
                                            </span>
                                            <p className="text-sm font-semibold text-zinc-800 mt-1">
                                                {m.event}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#FF5100] border-4 border-white shadow-md z-10" />
                                    <div className="hidden lg:block lg:w-1/2" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section> */}

            {/* ══════════════════════════════════════════
                TEAM
            ══════════════════════════════════════════ */}
            {/* <section className="relative py-24 bg-zinc-900 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.07] pointer-events-none"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                    }}
                />
                <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#FF5100]/8 blur-3xl pointer-events-none" />

                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: "easeOut" as const }}
                    >
                        <SectionBadge label="The Team" />
                        <h2 className="text-4xl font-extrabold text-white tracking-tight">
                            The people behind{" "}
                            <span className="text-[#FF5100]">Vehiqo</span>
                        </h2>
                    </motion.div>

                    <div className="flex justify-center">
                        {TEAM.map((member, i) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.45,
                                    ease: "easeOut" as const,
                                    delay: i * 0.1,
                                }}
                                className="group bg-zinc-800/60 border border-zinc-700 hover:border-[#FF5100]/30 rounded-3xl p-8 max-w-sm w-full transition-all duration-300"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-[#FF5100]/15 border border-[#FF5100]/20 flex items-center justify-center text-xl font-black text-[#FF5100] mb-5 group-hover:bg-[#FF5100]/25 transition-colors">
                                    {member.initials}
                                </div>

                                <h3 className="text-base font-bold text-white mb-0.5">
                                    {member.name}
                                </h3>
                                <p className="text-xs font-semibold text-[#FF5100] mb-3">
                                    {member.role}
                                </p>
                                <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                                    {member.bio}
                                </p>
                                <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {member.location}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section> */}

            {/* ══════════════════════════════════════════
                CTA
            ══════════════════════════════════════════ */}
            <section className="relative py-24 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-40 pointer-events-none"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                    }}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-150 h-75 rounded-full bg-[#FF5100]/5 blur-3xl" />
                </div>

                <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.55,
                            ease: "easeOut" as const,
                        }}
                        className="space-y-6"
                    >
                        <SectionBadge label="Ready to Ride?" />
                        <h2 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight">
                            Your next journey{" "}
                            <span className="text-[#FF5100]">starts here</span>
                        </h2>
                        <p className="text-base text-zinc-500 leading-relaxed">
                            Explore our verified fleet and book the perfect
                            vehicle for your next trip — in minutes.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 pt-2">
                            <Link
                                href="/vehicles"
                                className="group inline-flex items-center gap-2.5 bg-[#FF5100] hover:bg-[#e04800] text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-[#FF5100]/25 hover:shadow-[#FF5100]/40"
                            >
                                <Car className="w-5 h-5" />
                                Browse Vehicles
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 border border-zinc-200 hover:border-zinc-300 text-zinc-700 hover:text-zinc-900 font-semibold px-8 py-4 rounded-xl transition-all duration-200 bg-white shadow-sm"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
