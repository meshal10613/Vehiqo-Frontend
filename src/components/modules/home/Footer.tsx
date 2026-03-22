// "use client";

// import Link from "next/link";
// import { Apple, Play } from "lucide-react";

// const companyLinks = [
//     { label: "About us", href: "/about" },
//     { label: "Pricing plan", href: "/pricing" },
//     { label: "Locations", href: "/locations" },
//     { label: "Our news", href: "/news" },
//     { label: "Contact us", href: "/contact" },
// ];

// const socialLinks = [
//     { label: "Facebook", href: "#" },
//     { label: "Twitter/X", href: "#" },
//     { label: "LinkedIn", href: "#" },
//     { label: "Instagram", href: "#" },
//     { label: "YouTube", href: "#" },
// ];

// export default function Footer() {
//     return (
//         <footer className="w-full bg-[#0f1412] text-white">
//             {/* ── main content ───────────────────────────────────────────── */}
//             <div className="container mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 py-14 sm:py-16 lg:py-20">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 xl:gap-12">

//                     {/* ── col 1 — brand + app ──────────────────────────────── */}
//                     <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-7">
//                         {/* logo */}
//                         <Link href="/" className="inline-flex items-end gap-0.5">
//                             <span className="text-2xl font-black tracking-tight text-white">
//                                 Vehiq
//                             </span>
//                             <span className="text-2xl font-black tracking-tight text-[#FF5100]">
//                                 o
//                             </span>
//                             {/* underline swoosh */}
//                             <svg
//                                 className="mb-1 ml-0.5"
//                                 width="18"
//                                 height="8"
//                                 viewBox="0 0 18 8"
//                                 fill="none"
//                             >
//                                 <path
//                                     d="M1 6.5 Q9 1 17 6.5"
//                                     stroke="#FF5100"
//                                     strokeWidth="2"
//                                     strokeLinecap="round"
//                                     fill="none"
//                                 />
//                             </svg>
//                         </Link>
//                         <p className="text-zinc-400 text-xs -mt-4">Car Rental</p>

//                         {/* app download */}
//                         <div className="flex flex-col gap-3">
//                             <p className="text-sm font-bold text-white">
//                                 Download Our App
//                             </p>
//                             <div className="flex flex-wrap gap-3">
//                                 {/* App Store */}
//                                 <a
//                                     href="#"
//                                     className="flex items-center gap-2.5 border border-zinc-600 hover:border-zinc-400 rounded-lg px-4 py-2.5 transition-colors duration-200 group"
//                                 >
//                                     <Apple className="h-5 w-5 text-white shrink-0" />
//                                     <div className="flex flex-col leading-tight">
//                                         <span className="text-[9px] text-zinc-400 group-hover:text-zinc-300 uppercase tracking-wider">
//                                             Download on the
//                                         </span>
//                                         <span className="text-xs font-semibold text-white">
//                                             App Store
//                                         </span>
//                                     </div>
//                                 </a>

//                                 {/* Google Play */}
//                                 <a
//                                     href="#"
//                                     className="flex items-center gap-2.5 border border-zinc-600 hover:border-zinc-400 rounded-lg px-4 py-2.5 transition-colors duration-200 group"
//                                 >
//                                     <Play className="h-5 w-5 text-white shrink-0" />
//                                     <div className="flex flex-col leading-tight">
//                                         <span className="text-[9px] text-zinc-400 group-hover:text-zinc-300 uppercase tracking-wider">
//                                             Get it on
//                                         </span>
//                                         <span className="text-xs font-semibold text-white">
//                                             Google Play
//                                         </span>
//                                     </div>
//                                 </a>
//                             </div>
//                         </div>
//                     </div>

//                     {/* ── col 2 — company ──────────────────────────────────── */}
//                     <div className="flex flex-col gap-5">
//                         <p className="text-sm font-bold text-white">Company</p>
//                         <ul className="flex flex-col gap-3">
//                             {companyLinks.map(({ label, href }) => (
//                                 <li key={label}>
//                                     <Link
//                                         href={href}
//                                         className="text-sm text-zinc-400 hover:text-white transition-colors duration-200"
//                                     >
//                                         {label}
//                                     </Link>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>

//                     {/* ── col 3 — social ───────────────────────────────────── */}
//                     <div className="flex flex-col gap-5">
//                         <p className="text-sm font-bold text-white">Social</p>
//                         <ul className="flex flex-col gap-3">
//                             {socialLinks.map(({ label, href }) => (
//                                 <li key={label}>
//                                     <a
//                                         href={href}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         className="text-sm text-zinc-400 hover:text-white transition-colors duration-200"
//                                     >
//                                         {label}
//                                     </a>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>

//                     {/* ── col 4 — contact ──────────────────────────────────── */}
//                     <div className="flex flex-col gap-5">
//                         <p className="text-sm font-bold text-white">Contact</p>
//                         <div className="flex flex-col gap-3">
//                             <p className="text-sm text-zinc-400 leading-relaxed">
//                                 Call:{" "}
//                                 <span className="text-white font-semibold">
//                                     +1 855 - 807 9484
//                                 </span>
//                             </p>
//                             <p className="text-sm text-zinc-400">
//                                 Email:{" "}
//                                 <a
//                                     href="mailto:hello@vehiqo.com"
//                                     className="text-[#FF5100] hover:text-orange-400 transition-colors font-medium"
//                                 >
//                                     hello@vehiqo.com
//                                 </a>
//                             </p>
//                             <div>
//                                 <p className="text-sm text-zinc-400 mb-1">
//                                     Address:
//                                 </p>
//                                 <p className="text-sm text-white font-semibold leading-relaxed">
//                                     123 Business Ave, Los Angeles,
//                                     <br />
//                                     CA 90045
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* ── bottom bar ─────────────────────────────────────────────── */}
//             <div className="border-t border-zinc-800">
//                 <div className="container mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
//                     <p className="text-xs text-zinc-500 text-center sm:text-left">
//                         © Vehiqo. All Rights Reserved. Powered by{" "}
//                         <span className="text-[#FF5100] font-semibold">
//                             Vehiqo Team
//                         </span>
//                     </p>
//                     <div className="flex items-center gap-4">
//                         <Link
//                             href="/privacy"
//                             className="text-xs text-zinc-500 hover:text-white transition-colors"
//                         >
//                             Privacy Policy
//                         </Link>
//                         <span className="text-zinc-700">|</span>
//                         <Link
//                             href="/terms"
//                             className="text-xs text-zinc-500 hover:text-white transition-colors"
//                         >
//                             Terms of Service
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//         </footer>
//     );
// }

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    Facebook,
    Instagram,
    Twitter,
    Github,
    Mail,
    Phone,
    MapPin,
    ArrowUpRight,
    Car,
    ChevronRight,
} from "lucide-react";

// ── DATA ──────────────────────────────────────────────────────────────────────

const LINKS = {
    company: [
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "FAQ", href: "/faq" },
        { label: "Careers", href: "/careers" },
    ],
    services: [
        { label: "Browse Vehicles", href: "/vehicles" },
        { label: "My Bookings", href: "/my-bookings" },
        { label: "My Profile", href: "/my-profile" },
        { label: "Pricing", href: "/pricing" },
    ],
    legal: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "Refund Policy", href: "/refund" },
    ],
};

const SOCIALS = [
    {
        icon: Facebook,
        href: "https://facebook.com/meshal.67",
        label: "Facebook",
    },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Github, href: "https://github.com/meshal10613", label: "GitHub" },
];

// ── SUB-COMPONENTS ────────────────────────────────────────────────────────────

function FooterLinkGroup({
    title,
    links,
}: {
    title: string;
    links: { label: string; href: string }[];
}) {
    return (
        <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">
                {title}
            </h4>
            <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                    <li key={label}>
                        <Link
                            href={href}
                            className="group inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-white transition-colors duration-200"
                        >
                            <ChevronRight className="w-3 h-3 text-zinc-700 group-hover:text-[#FF5100] -ml-1 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-zinc-900 overflow-hidden">
            {/* Dot grid */}
            <div
                className="absolute inset-0 opacity-[0.07] pointer-events-none"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                }}
            />

            {/* Top orange accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#FF5100]/60 to-transparent" />

            {/* Glow blobs */}
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#FF5100]/6 blur-3xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#FF5100]/4 blur-3xl pointer-events-none" />

            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
                {/* ── Top Section ── */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 py-16 border-b border-zinc-800">
                    {/* Brand col — takes 2/5 */}
                    <motion.div
                        className="lg:col-span-2 space-y-6"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: "easeOut" as const }}
                    >
                        {/* Logo */}
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2.5 group"
                        >
                            <div className="w-9 h-9 rounded-xl bg-[#FF5100] flex items-center justify-center shadow-lg shadow-[#FF5100]/30 group-hover:scale-105 transition-transform duration-200">
                                <Car
                                    className="w-5 h-5 text-white"
                                    strokeWidth={2}
                                />
                            </div>
                            <span className="text-xl font-extrabold text-white tracking-tight">
                                Vehiqo
                            </span>
                        </Link>

                        <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
                            Your trusted vehicle rental platform. Choose from a
                            verified fleet of cars, bikes, and more — and hit
                            the road with confidence.
                        </p>

                        {/* Contact snippets */}
                        <div className="space-y-2.5">
                            {[
                                { icon: Mail, text: "support@vehiqo.com" },
                                { icon: Phone, text: "+880 1764 447574" },
                                {
                                    icon: MapPin,
                                    text: "Jhalakathi, Barisal, Bangladesh",
                                },
                            ].map(({ icon: Icon, text }) => (
                                <div
                                    key={text}
                                    className="flex items-center gap-2.5 text-sm text-zinc-500"
                                >
                                    <Icon
                                        className="w-4 h-4 text-[#FF5100] shrink-0"
                                        strokeWidth={1.75}
                                    />
                                    {text}
                                </div>
                            ))}
                        </div>

                        {/* Social icons */}
                        <div className="flex items-center gap-2.5">
                            {SOCIALS.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 hover:border-[#FF5100]/40 hover:bg-[#FF5100]/10 text-zinc-400 hover:text-[#FF5100] flex items-center justify-center transition-all duration-200"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Link columns — 3/5 */}
                    <motion.div
                        className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-10"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.5,
                            delay: 0.1,
                            ease: "easeOut" as const,
                        }}
                    >
                        <FooterLinkGroup
                            title="Company"
                            links={LINKS.company}
                        />
                        <FooterLinkGroup
                            title="Services"
                            links={LINKS.services}
                        />
                        <FooterLinkGroup title="Legal" links={LINKS.legal} />
                    </motion.div>
                </div>

                {/* ── Newsletter strip ── */}
                <motion.div
                    className="py-8 border-b border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                >
                    <div>
                        <p className="text-sm font-semibold text-white">
                            Stay in the loop
                        </p>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            Get updates on new vehicles and exclusive deals.
                        </p>
                    </div>
                    <div className="flex w-full sm:w-auto gap-2">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="flex-1 sm:w-56 px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FF5100]/50 focus:ring-1 focus:ring-[#FF5100]/20 transition-all"
                        />
                        <button className="flex items-center gap-1.5 px-4 py-2.5 bg-[#FF5100] hover:bg-[#e04800] text-white text-sm font-semibold rounded-xl transition-colors duration-200 shadow-md shadow-[#FF5100]/20 cursor-pointer whitespace-nowrap">
                            Subscribe
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </motion.div>

                {/* ── Bottom bar ── */}
                <motion.div
                    className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <p>
                        © {currentYear}{" "}
                        <span className="text-zinc-400 font-semibold">
                            Vehiqo
                        </span>
                        . All rights reserved.
                    </p>

                    <div className="flex items-center gap-1 text-zinc-600">
                        Built by{" "}
                        <a
                            href="https://syedmohiuddinmeshal.netlify.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-[#FF5100] font-semibold transition-colors duration-200 ml-1"
                        >
                            Meshal
                        </a>
                        <span className="mx-1.5 text-zinc-700">·</span>
                        <a
                            href="https://github.com/meshal10613"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#FF5100] transition-colors duration-200"
                        >
                            GitHub
                        </a>
                        <span className="mx-1.5 text-zinc-700">·</span>
                        <a
                            href="https://linkedin.com/in/10613-meshal"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#FF5100] transition-colors duration-200"
                        >
                            LinkedIn
                        </a>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
