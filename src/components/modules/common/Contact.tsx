"use client";

import { useState } from "react";
import { motion, type Variants  } from "framer-motion";
import {
    Mail,
    Phone,
    MapPin,
    Clock,
    Send,
    CheckCircle2,
    MessageSquare,
    ArrowRight,
    Facebook,
    Instagram,
    Twitter,
} from "lucide-react";

interface FormState {
    name: string;
    email: string;
    subject: string;
    message: string;
}

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut", delay: i * 0.08 },
    }),
};

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

function InfoCard({
    icon: Icon,
    title,
    lines,
    index,
}: {
    icon: React.ElementType;
    title: string;
    lines: string[];
    index: number;
}) {
    return (
        <motion.div
            custom={index}
            variants={fadeUp}
            className="group flex gap-4 p-5 rounded-2xl bg-white/60 border border-zinc-100 hover:border-[#FF5100]/20 hover:bg-white hover:shadow-md transition-all duration-300"
        >
            <div className="shrink-0 w-11 h-11 rounded-xl bg-[#FF5100]/8 group-hover:bg-[#FF5100]/15 flex items-center justify-center transition-colors duration-300">
                <Icon className="w-5 h-5 text-[#FF5100]" strokeWidth={1.75} />
            </div>
            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    {title}
                </p>
                {lines.map((line, i) => (
                    <p
                        key={i}
                        className="text-sm font-medium text-zinc-700 leading-relaxed"
                    >
                        {line}
                    </p>
                ))}
            </div>
        </motion.div>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                {label}
            </label>
            {children}
            {error && (
                <p className="text-xs text-rose-500 font-medium">{error}</p>
            )}
        </div>
    );
}

const inputClass =
    "w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#FF5100]/25 focus:border-[#FF5100] transition-all duration-200";

export default function Contact() {
    const [form, setForm] = useState<FormState>({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [errors, setErrors] = useState<Partial<FormState>>({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const validate = (): boolean => {
        const e: Partial<FormState> = {};
        if (!form.name.trim()) e.name = "Name is required.";
        if (!form.email.trim()) e.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            e.email = "Enter a valid email address.";
        if (!form.subject.trim()) e.subject = "Subject is required.";
        if (!form.message.trim()) e.message = "Message cannot be empty.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true);
        // Simulate API call
        await new Promise((r) => setTimeout(r, 1400));
        setLoading(false);
        setSubmitted(true);
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormState]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    return (
        <section className="relative min-h-screen py-24 overflow-hidden">
            {/* Dot grid */}
            <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                // style={{
                //     backgroundImage:
                //         "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
                //     backgroundSize: "28px 28px",
                // }}
            />

            {/* Glow blobs */}
            {/* <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#FF5100]/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-[#FF5100]/4 blur-3xl pointer-events-none" /> */}

            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
                {/* ── Section Header ── */}
                <motion.div
                    className="text-center mb-16 max-w-2xl mx-auto"
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                >
                    <motion.div variants={fadeUp}>
                        <div className="inline-flex items-center gap-2 bg-[#FF5100]/8 border border-[#FF5100]/15 text-[#FF5100] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5100] animate-pulse" />
                            We're Here to Help
                        </div>
                    </motion.div>
                    <motion.h1
                        variants={fadeUp}
                        className="text-4xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight"
                    >
                        Get in <span className="text-[#FF5100]">touch</span>
                    </motion.h1>
                    <motion.p
                        variants={fadeUp}
                        className="mt-4 text-base text-zinc-500 leading-relaxed"
                    >
                        Have a question, feedback, or need help with a booking?
                        Our team is ready to assist — reach out any time.
                    </motion.p>
                </motion.div>

                {/* ── Main Grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                    {/* ── Left: Info Panel ── */}
                    <motion.div
                        className="lg:col-span-2 space-y-4"
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                    >
                        {/* Info cards */}
                        {[
                            {
                                icon: Mail,
                                title: "Email Us",
                                lines: [
                                    "support@vehiqo.com",
                                    "hello@vehiqo.com",
                                ],
                            },
                            {
                                icon: Phone,
                                title: "Call Us",
                                lines: [
                                    "+880 1764 447574",
                                    "Mon – Sat, 9 AM – 7 PM",
                                ],
                            },
                            {
                                icon: MapPin,
                                title: "Our Office",
                                lines: ["Jhalakathi, Barisal", "Bangladesh"],
                            },
                            {
                                icon: Clock,
                                title: "Support Hours",
                                lines: [
                                    "Mon – Fri: 9 AM – 7 PM",
                                    "Sat: 10 AM – 4 PM",
                                ],
                            },
                        ].map((card, i) => (
                            <InfoCard key={i} {...card} index={i} />
                        ))}

                        {/* Social links */}
                        <motion.div
                            variants={fadeUp}
                            custom={4}
                            className="flex items-center gap-3 pt-2"
                        >
                            {[
                                {
                                    icon: Facebook,
                                    href: "#",
                                    label: "Facebook",
                                },
                                {
                                    icon: Instagram,
                                    href: "#",
                                    label: "Instagram",
                                },
                                { icon: Twitter, href: "#", label: "Twitter" },
                            ].map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="w-10 h-10 rounded-xl bg-white border border-zinc-200 hover:border-[#FF5100]/30 hover:bg-[#FF5100]/5 flex items-center justify-center text-zinc-400 hover:text-[#FF5100] transition-all duration-200"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                            <span className="text-xs text-zinc-400 ml-1 font-medium">
                                Follow us
                            </span>
                        </motion.div>
                    </motion.div>

                    {/* ── Right: Contact Form ── */}
                    <motion.div
                        className="lg:col-span-3"
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.55,
                            ease: "easeOut",
                            delay: 0.15,
                        }}
                    >
                        <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-8">
                            {/* Form header */}
                            <div className="flex items-center gap-3 mb-7">
                                <div className="w-10 h-10 rounded-xl bg-[#FF5100]/10 flex items-center justify-center">
                                    <MessageSquare
                                        className="w-5 h-5 text-[#FF5100]"
                                        strokeWidth={1.75}
                                    />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-zinc-900">
                                        Send a Message
                                    </h2>
                                    <p className="text-xs text-zinc-500 mt-0.5">
                                        We typically reply within 24 hours.
                                    </p>
                                </div>
                            </div>

                            {submitted ? (
                                /* ── Success state ── */
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        duration: 0.4,
                                        ease: "easeOut",
                                    }}
                                    className="py-16 flex flex-col items-center text-center gap-4"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-2">
                                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-zinc-900">
                                        Message Sent!
                                    </h3>
                                    <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
                                        Thanks for reaching out. We've received
                                        your message and will get back to you
                                        within 24 hours.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSubmitted(false);
                                            setForm({
                                                name: "",
                                                email: "",
                                                subject: "",
                                                message: "",
                                            });
                                        }}
                                        className="mt-2 text-sm text-[#FF5100] font-semibold hover:underline underline-offset-2 cursor-pointer"
                                    >
                                        Send another message →
                                    </button>
                                </motion.div>
                            ) : (
                                /* ── Form fields ── */
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <Field
                                            label="Full Name"
                                            error={errors.name}
                                        >
                                            <input
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                placeholder="Meshal"
                                                className={inputClass}
                                            />
                                        </Field>
                                        <Field
                                            label="Email Address"
                                            error={errors.email}
                                        >
                                            <input
                                                name="email"
                                                type="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                placeholder="you@example.com"
                                                className={inputClass}
                                            />
                                        </Field>
                                    </div>

                                    <Field
                                        label="Subject"
                                        error={errors.subject}
                                    >
                                        <select
                                            name="subject"
                                            value={form.subject}
                                            onChange={handleChange}
                                            className={inputClass}
                                        >
                                            <option value="">
                                                Select a topic…
                                            </option>
                                            <option value="booking">
                                                Booking Inquiry
                                            </option>
                                            <option value="cancellation">
                                                Cancellation / Refund
                                            </option>
                                            <option value="vehicle">
                                                Vehicle Information
                                            </option>
                                            <option value="payment">
                                                Payment Issue
                                            </option>
                                            <option value="other">Other</option>
                                        </select>
                                    </Field>

                                    <Field
                                        label="Message"
                                        error={errors.message}
                                    >
                                        <textarea
                                            name="message"
                                            value={form.message}
                                            onChange={handleChange}
                                            rows={5}
                                            placeholder="Tell us how we can help you…"
                                            className={`${inputClass} resize-none`}
                                        />
                                    </Field>

                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="w-full flex items-center justify-center gap-2.5 bg-[#FF5100] hover:bg-[#e04800] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md shadow-[#FF5100]/20 hover:shadow-[#FF5100]/35 cursor-pointer"
                                    >
                                        {loading ? (
                                            <>
                                                <svg
                                                    className="animate-spin w-4 h-4"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8v8H4z"
                                                    />
                                                </svg>
                                                Sending…
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Send Message
                                                {/* <ArrowRight className="w-4 h-4" /> */}
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
