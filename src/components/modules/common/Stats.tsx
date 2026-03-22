"use client";

import { useRef } from "react";
import CountUp from "react-countup";
import { useInView } from "framer-motion";
import { Car, LayoutGrid, Star, Tag } from "lucide-react";
import { IPublicStats } from "../../../types/stats.type";

const STATS = (stat: IPublicStats) => [
    {
        icon: Car,
        value: stat.vehicle,
        suffix: "+",
        label: "Fleet Vehicles",
        description: "A diverse fleet ready to match every journey and budget.",
    },
    {
        icon: LayoutGrid,
        value: stat.vehicleCategory,
        suffix: "+",
        label: "Vehicle Categories",
        description: "From city runabouts to rugged off-roaders — we have it.",
    },
    {
        icon: Tag,
        value: stat.vehicleType,
        suffix: "+",
        label: "Vehicle Types",
        description: "Sedans, SUVs, trucks, bikes — tailored to your needs.",
    },
    {
        icon: Star,
        value: stat.review,
        suffix: "+",
        label: "Happy Reviews",
        description: "Real feedback from real customers who drove with us.",
    },
];

function StatCard({
    icon: Icon,
    value,
    suffix,
    label,
    description,
    index,
    inView,
}: {
    icon: React.ElementType;
    value: number;
    suffix: string;
    label: string;
    description: string;
    index: number;
    inView: boolean;
}) {
    return (
        <div
            className="group relative flex flex-col gap-4 p-7 rounded-3xl bg-white border border-zinc-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            style={{
                animationDelay: `${index * 120}ms`,
            }}
        >
            {/* Decorative top-left accent line */}
            <div className="absolute top-0 left-0 w-12 h-1 bg-primary rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Icon */}
            <div className="w-12 h-12 rounded-2xl bg-[#FF5100]/8 flex items-center justify-center group-hover:bg-[#FF5100]/15 transition-colors duration-300">
                <Icon className="w-5 h-5 text-primary" strokeWidth={1.75} />
            </div>

            {/* Count */}
            <div className="flex items-end gap-0.5 leading-none">
                <span className="text-5xl font-extrabold text-zinc-900 tabular-nums tracking-tight">
                    {inView ? (
                        <CountUp
                            start={0}
                            end={value}
                            duration={2.2}
                            delay={index * 0.12}
                            useEasing
                            easingFn={(t: any, b: any, c: any, d: any) => {
                                // Expo ease out
                                return t === d
                                    ? b + c
                                    : c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
                            }}
                        />
                    ) : (
                        0
                    )}
                </span>
                <span className="text-3xl font-bold text-primary mb-0.5">
                    {suffix}
                </span>
            </div>

            {/* Label + description */}
            <div>
                <p className="text-base font-bold text-zinc-800 leading-snug">
                    {label}
                </p>
                <p className="text-sm text-zinc-500 mt-1 leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
}

export default function Stats({ stat }: { stat: IPublicStats }) {
    const ref = useRef<HTMLDivElement>(null);
    // Trigger once when the section scrolls into view
    const inView = useInView(ref, { once: true, margin: "-80px" });

    const items = STATS(stat);

    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background texture — subtle dot grid */}
            <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                // style={{
                //     backgroundImage:
                //         "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
                //     backgroundSize: "28px 28px",
                // }}
            />

            {/* Orange glow blob */}
            {/* <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#FF5100]/6 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-[#FF5100]/4 blur-3xl pointer-events-none" /> */}

            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-[#FF5100]/8 border border-[#FF5100]/15 text-[#FF5100] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        By The Numbers
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight">
                        Built for every{" "}
                        <span className="text-primary">journey</span>
                    </h2>
                    <p className="mt-4 text-base text-zinc-500 leading-relaxed">
                        From weekend escapes to long hauls — Vehiqo's growing
                        fleet and community speak for themselves.
                    </p>
                </div>

                {/* Stats grid */}
                <div
                    ref={ref}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                >
                    {items.map((item, i) => (
                        <StatCard
                            key={item.label}
                            {...item}
                            index={i}
                            inView={inView}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
