"use client";

import Link from "next/link";
import { Apple, Play } from "lucide-react";

const companyLinks = [
    { label: "About us", href: "/about" },
    { label: "Pricing plan", href: "/pricing" },
    { label: "Locations", href: "/locations" },
    { label: "Our news", href: "/news" },
    { label: "Contact us", href: "/contact" },
];

const socialLinks = [
    { label: "Facebook", href: "#" },
    { label: "Twitter/X", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "YouTube", href: "#" },
];

export default function Footer() {
    return (
        <footer className="w-full bg-[#0f1412] text-white">
            {/* ── main content ───────────────────────────────────────────── */}
            <div className="container mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 py-14 sm:py-16 lg:py-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 xl:gap-12">

                    {/* ── col 1 — brand + app ──────────────────────────────── */}
                    <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-7">
                        {/* logo */}
                        <Link href="/" className="inline-flex items-end gap-0.5">
                            <span className="text-2xl font-black tracking-tight text-white">
                                Vehiq
                            </span>
                            <span className="text-2xl font-black tracking-tight text-[#FF5100]">
                                o
                            </span>
                            {/* underline swoosh */}
                            <svg
                                className="mb-1 ml-0.5"
                                width="18"
                                height="8"
                                viewBox="0 0 18 8"
                                fill="none"
                            >
                                <path
                                    d="M1 6.5 Q9 1 17 6.5"
                                    stroke="#FF5100"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    fill="none"
                                />
                            </svg>
                        </Link>
                        <p className="text-zinc-400 text-xs -mt-4">Car Rental</p>

                        {/* app download */}
                        <div className="flex flex-col gap-3">
                            <p className="text-sm font-bold text-white">
                                Download Our App
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {/* App Store */}
                                <a
                                    href="#"
                                    className="flex items-center gap-2.5 border border-zinc-600 hover:border-zinc-400 rounded-lg px-4 py-2.5 transition-colors duration-200 group"
                                >
                                    <Apple className="h-5 w-5 text-white shrink-0" />
                                    <div className="flex flex-col leading-tight">
                                        <span className="text-[9px] text-zinc-400 group-hover:text-zinc-300 uppercase tracking-wider">
                                            Download on the
                                        </span>
                                        <span className="text-xs font-semibold text-white">
                                            App Store
                                        </span>
                                    </div>
                                </a>

                                {/* Google Play */}
                                <a
                                    href="#"
                                    className="flex items-center gap-2.5 border border-zinc-600 hover:border-zinc-400 rounded-lg px-4 py-2.5 transition-colors duration-200 group"
                                >
                                    <Play className="h-5 w-5 text-white shrink-0" />
                                    <div className="flex flex-col leading-tight">
                                        <span className="text-[9px] text-zinc-400 group-hover:text-zinc-300 uppercase tracking-wider">
                                            Get it on
                                        </span>
                                        <span className="text-xs font-semibold text-white">
                                            Google Play
                                        </span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* ── col 2 — company ──────────────────────────────────── */}
                    <div className="flex flex-col gap-5">
                        <p className="text-sm font-bold text-white">Company</p>
                        <ul className="flex flex-col gap-3">
                            {companyLinks.map(({ label, href }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        className="text-sm text-zinc-400 hover:text-white transition-colors duration-200"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── col 3 — social ───────────────────────────────────── */}
                    <div className="flex flex-col gap-5">
                        <p className="text-sm font-bold text-white">Social</p>
                        <ul className="flex flex-col gap-3">
                            {socialLinks.map(({ label, href }) => (
                                <li key={label}>
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-zinc-400 hover:text-white transition-colors duration-200"
                                    >
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── col 4 — contact ──────────────────────────────────── */}
                    <div className="flex flex-col gap-5">
                        <p className="text-sm font-bold text-white">Contact</p>
                        <div className="flex flex-col gap-3">
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Call:{" "}
                                <span className="text-white font-semibold">
                                    +1 855 - 807 9484
                                </span>
                            </p>
                            <p className="text-sm text-zinc-400">
                                Email:{" "}
                                <a
                                    href="mailto:hello@vehiqo.com"
                                    className="text-[#FF5100] hover:text-orange-400 transition-colors font-medium"
                                >
                                    hello@vehiqo.com
                                </a>
                            </p>
                            <div>
                                <p className="text-sm text-zinc-400 mb-1">
                                    Address:
                                </p>
                                <p className="text-sm text-white font-semibold leading-relaxed">
                                    123 Business Ave, Los Angeles,
                                    <br />
                                    CA 90045
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── bottom bar ─────────────────────────────────────────────── */}
            <div className="border-t border-zinc-800">
                <div className="container mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-zinc-500 text-center sm:text-left">
                        © Vehiqo. All Rights Reserved. Powered by{" "}
                        <span className="text-[#FF5100] font-semibold">
                            Vehiqo Team
                        </span>
                    </p>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/privacy"
                            className="text-xs text-zinc-500 hover:text-white transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <span className="text-zinc-700">|</span>
                        <Link
                            href="/terms"
                            className="text-xs text-zinc-500 hover:text-white transition-colors"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}