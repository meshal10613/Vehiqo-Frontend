"use client";

import { motion } from "framer-motion";
import { IReview } from "../../../types/review.type";
import { Star, Quote } from "lucide-react";

function getInitials(name?: string): string {
    if (!name) return "?";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function timeAgo(date: Date): string {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
    const years = Math.floor(months / 12);
    return `${years} year${years > 1 ? "s" : ""} ago`;
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                        i <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-zinc-200 text-zinc-200"
                    }`}
                />
            ))}
        </div>
    );
}

function Avatar({ image, name }: { image?: string | null; name?: string }) {
    if (image) {
        return (
            <img
                src={image}
                alt={name ?? "User"}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white shrink-0"
            />
        );
    }
    return (
        <div className="w-10 h-10 rounded-full bg-[#FF5100]/10 text-[#FF5100] flex items-center justify-center text-sm font-bold ring-2 ring-white shrink-0">
            {getInitials(name)}
        </div>
    );
}

function ReviewCard({ review, index }: { review: IReview; index: number }) {
    const vehicleName = review.vehicle
        ? `${review.vehicle.brand} ${review.vehicle.model}`
        : "Unknown Vehicle";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
                duration: 0.4,
                ease: "easeOut" as const,
                delay: (index % 3) * 0.08,
            }}
            className="group relative flex flex-col bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#FF5100]/15 transition-all duration-300 overflow-hidden"
        >
            {/* Top-left orange accent */}
            <div className="absolute top-0 left-0 w-10 h-1 bg-[#FF5100] rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Quote icon */}
            <Quote className="w-7 h-7 text-zinc-100 absolute top-5 right-5 rotate-180" />

            {/* Rating + vehicle */}
            <div className="flex items-start justify-between gap-3 mb-4 relative">
                <div className="space-y-1.5">
                    <StarRating rating={review.rating} />
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#FF5100] bg-[#FF5100]/8 px-2 py-0.5 rounded-full">
                        {vehicleName}
                    </span>
                </div>
                <span className="text-[10px] text-zinc-400 font-medium shrink-0 mt-0.5 absolute right-0 bottom-0">
                    {timeAgo(review.createdAt)}
                </span>
            </div>

            {/* Comment */}
            <p className="text-sm text-zinc-600 leading-relaxed flex-1 mb-5 line-clamp-4">
                "{review.comment}"
            </p>

            {/* User info */}
            <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
                <Avatar image={review.user?.image} name={review.user?.name} />
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-800 truncate">
                        {review.user?.name ?? "Anonymous"}
                    </p>
                    <p className="text-xs text-zinc-400 truncate">
                        {review.user?.email ?? ""}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

export default function Reviews({ reviews }: { reviews: IReview[] }) {
    if (!reviews.length) return null;

    const avgRating =
        reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((r) => r.rating === star).length,
        pct: Math.round(
            (reviews.filter((r) => r.rating === star).length / reviews.length) *
                100,
        ),
    }));

    return (
        <section className="relative py-20 overflow-hidden">
            {/* Dot grid */}
            <div
                className="absolute inset-0 opacity-40 pointer-events-none"
            />

            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
                {/* ── Header ── */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, ease: "easeOut" as const }}
                >
                    <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8">
                        {/* Left: title */}
                        <div>
                            <div className="flex items-center justify-center gap-2 bg-[#FF5100]/8 border border-[#FF5100]/15 text-[#FF5100] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5 w-fit mx-auto lg:mx-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5100] animate-pulse" />
                                Customer Reviews
                            </div>
                            <h2 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight">
                                What our{" "}
                                <span className="text-[#FF5100]">
                                    customers
                                </span>{" "}
                                say
                            </h2>
                            <p className="mt-4 text-base text-zinc-500 leading-relaxed text-center lg:text-left">
                                {reviews.length} verified review
                                {reviews.length !== 1 ? "s" : ""} from real
                                Vehiqo renters.
                            </p>
                        </div>

                        {/* Right: rating summary */}
                        <div className="flex items-center gap-6 bg-white rounded-2xl border border-zinc-100 shadow-sm px-6 py-4 lg:shrink-0">
                            {/* Big avg */}
                            <div className="text-center">
                                <p className="text-5xl font-extrabold text-zinc-900 leading-none">
                                    {avgRating.toFixed(1)}
                                </p>
                                <StarRating rating={Math.round(avgRating)} />
                                <p className="text-[10px] text-zinc-400 mt-1 font-medium">
                                    out of 5
                                </p>
                            </div>

                            {/* Bar breakdown */}
                            <div className="space-y-1.5 min-w-36">
                                {ratingCounts.map(({ star, count, pct }) => (
                                    <div
                                        key={star}
                                        className="flex items-center gap-2"
                                    >
                                        <span className="text-[10px] text-zinc-500 w-4 text-right font-medium">
                                            {star}
                                        </span>
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                                        <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-amber-400 rounded-full"
                                                initial={{ width: 0 }}
                                                whileInView={{
                                                    width: `${pct}%`,
                                                }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    duration: 0.7,
                                                    ease: "easeOut" as const,
                                                    delay: (5 - star) * 0.06,
                                                }}
                                            />
                                        </div>
                                        <span className="text-[10px] text-zinc-400 w-5 font-medium">
                                            {count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ── Review Grid ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {reviews.map((review, i) => (
                        <ReviewCard key={review.id} review={review} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
