"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const FAQS = [
    {
        q: "How do I make a reservation?",
        a: "You can make a reservation by selecting your desired vehicle, choosing rental dates, and completing the booking process online. Once confirmed, you'll receive a reservation confirmation via email.",
    },
    {
        q: "Is there a security deposit required?",
        a: "Yes, a small refundable security deposit is required at the time of booking. It's fully refunded once the vehicle is returned in the same condition.",
    },
    {
        q: "Can I rent a car without a credit card?",
        a: "In most cases, a valid credit card is required for security and verification purposes. However, some locations may accept alternative payment methods — please check availability before booking.",
    },
    {
        q: "Can I add an additional driver?",
        a: "Yes, you can add an additional driver during or after the booking process. The additional driver must meet our age and license requirements and may be subject to an extra fee.",
    },
    {
        q: "Can I modify or cancel my reservation?",
        a: "Yes, reservations can be modified or canceled through your account or by contacting customer support. Cancellation policies may vary depending on the booking type and timing.",
    },
    {
        q: "What is the minimum rental age?",
        a: "The minimum rental age is typically 21 years. Drivers under a certain age may be subject to additional fees or restrictions based on local regulations.",
    },
    {
        q: "What payment methods do you accept?",
        a: "We accept major credit cards and other supported payment options depending on your location. Available payment methods will be displayed during checkout.",
    },
    {
        q: "What insurance coverage is included?",
        a: "Basic insurance coverage is included with every rental. Additional coverage options are available at checkout for enhanced protection and peace of mind.",
    },
];

function FaqItem({
    q,
    a,
    index,
    isOpen,
    onToggle,
}: {
    q: string;
    a: string;
    index: number;
    isOpen: boolean;
    onToggle: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.06 }}
            className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                    ? "border-[#FF5100]/30 bg-white shadow-md shadow-[#FF5100]/6"
                    : "border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-sm"
            }`}
        >
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
            >
                {/* Number + Question */}
                <div className="flex items-center gap-4 min-w-0">
                    <span
                        className={`shrink-0 text-xs font-black tabular-nums transition-colors duration-300 ${
                            isOpen ? "text-primary" : "text-zinc-300"
                        }`}
                    >
                        {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                        className={`text-sm sm:text-base font-semibold leading-snug transition-colors duration-200 ${
                            isOpen
                                ? "text-zinc-900"
                                : "text-zinc-700 group-hover:text-zinc-900"
                        }`}
                    >
                        {q}
                    </span>
                </div>

                {/* Toggle icon */}
                <div
                    className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isOpen
                            ? "bg-primary text-white rotate-0"
                            : "bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200"
                    }`}
                >
                    {isOpen ? (
                        <Minus className="w-3.5 h-3.5" />
                    ) : (
                        <Plus className="w-3.5 h-3.5" />
                    )}
                </div>
            </button>

            {/* Answer */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-5 pl-17">
                            <div className="w-8 h-px bg-[#FF5100]/30 mb-3" />
                            <p className="text-sm text-zinc-500 leading-relaxed">
                                {a}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function Faq() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggle = (i: number) =>
        setOpenIndex((prev) => (prev === i ? null : i));

    const left = FAQS.slice(0, Math.ceil(FAQS.length / 2));
    const right = FAQS.slice(Math.ceil(FAQS.length / 2));

    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background dot grid — same as Stats */}
            <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                // style={{
                //     backgroundImage:
                //         "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
                //     backgroundSize: "28px 28px",
                // }}
            />

            {/* Glow blobs */}
            {/* <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FF5100]/6 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#FF5100]/4 blur-3xl pointer-events-none" /> */}

            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header — mirrors Stats */}
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-[#FF5100]/8 border border-[#FF5100]/15 text-[#FF5100] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Got Questions?
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight">
                        Everything you need to{" "}
                        <span className="text-primary">know</span>
                    </h2>
                    <p className="mt-4 text-base text-zinc-500 leading-relaxed">
                        Common questions about renting with Vehiqo — answered
                        clearly so you can book with confidence.
                    </p>
                </div>

                {/* Two-column FAQ grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Left column */}
                    <div className="space-y-3">
                        {left.map((item, i) => (
                            <FaqItem
                                key={i}
                                q={item.q}
                                a={item.a}
                                index={i}
                                isOpen={openIndex === i}
                                onToggle={() => toggle(i)}
                            />
                        ))}
                    </div>

                    {/* Right column */}
                    <div className="space-y-3">
                        {right.map((item, i) => {
                            const globalIndex = i + left.length;
                            return (
                                <FaqItem
                                    key={globalIndex}
                                    q={item.q}
                                    a={item.a}
                                    index={globalIndex}
                                    isOpen={openIndex === globalIndex}
                                    onToggle={() => toggle(globalIndex)}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="mt-12 text-center"
                >
                    <p className="text-sm text-zinc-400">
                        Still have questions?{" "}
                        <a
                            href="/contact"
                            className="text-[#FF5100] font-semibold hover:underline underline-offset-2 transition-colors"
                        >
                            Contact our support team →
                        </a>
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
