"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllReviews } from "../../../../services/review.services";
import { IReview } from "../../../../types/review.type";
import { PaginationMeta } from "../../../../types/api.type";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useServerManagedDataTable } from "../../../../hooks/useServerManagedDataTable";
import {
    ChevronDown,
    Quote,
    SlidersHorizontal,
    Star,
    StarOff,
    Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, timeAgo } from "../../home/Reviews";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { Button } from "../../../ui/button";
import DataTablePagination from "../../../shared/table/DataTablePagination";
import DeleteReviewDialog from "../../customer/MyReviewManagement/DeleteReviewDialog";
import LoadingSpinner from "../../../shared/LoadingSpinner";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star
                    key={i}
                    className={`w-4 h-4 ${
                        i <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-zinc-300"
                    }`}
                />
            ))}
        </div>
    );
}

function ReviewCard({
    review,
    index,
    onDelete,
}: {
    review: IReview;
    index: number;
    onDelete?: (reviewId: string) => void;
}) {
    const vehicleName = review.booking?.vehicle
        ? `${review?.booking?.vehicle.brand} ${review?.booking?.vehicle.model}`
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
            className="group relative flex flex-col bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#FF5100]/15 transition-all duration-300 overflow-hidden w-full min-h-70"
        >
            {/* Top-left orange accent */}
            <div className="absolute top-0 left-0 w-10 h-1 bg-[#FF5100] rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Delete action — visible on hover */}
            <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                <button
                    onClick={() => onDelete?.(review.id)}
                    className="p-1.5 rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-150 cursor-pointer"
                    aria-label="Delete review"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>

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

function StarSortFilter({
    value,
    onChange,
}: {
    value: string;
    onChange: (val: string) => void;
}) {
    const label = value
        ? `${value} Star${value === "1" ? "" : "s"}`
        : "All ratings";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-9 gap-2 border-zinc-200 text-zinc-600 cursor-pointer"
                >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    {label}
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="text-xs text-zinc-400 font-medium">
                    Filter by rating
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                    value={value}
                    onValueChange={(val) => onChange(val === value ? "" : val)}
                >
                    <DropdownMenuRadioItem value="" className="cursor-pointer">
                        All ratings
                    </DropdownMenuRadioItem>
                    {["5", "4", "3", "2", "1"].map((star) => (
                        <DropdownMenuRadioItem
                            key={star}
                            value={star}
                            className="cursor-pointer"
                        >
                            <div className="flex items-center gap-1.5">
                                <div className="flex items-center gap-0.5">
                                    {Array.from({ length: Number(star) }).map(
                                        (_, i) => (
                                            <Star
                                                key={i}
                                                className="w-3 h-3 fill-amber-400 text-amber-400"
                                            />
                                        ),
                                    )}
                                    {Array.from({
                                        length: 5 - Number(star),
                                    }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-3 h-3 fill-zinc-200 text-zinc-200"
                                        />
                                    ))}
                                </div>
                            </div>
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function EmptyReviews({ isFiltered }: { isFiltered: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center justify-center py-24 text-center"
        >
            {/* Animated icon */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    delay: 0.1,
                    duration: 0.4,
                    type: "spring",
                    stiffness: 200,
                    damping: 18,
                }}
                className="relative mb-6"
            >
                {/* Soft glow ring */}
                <motion.div
                    animate={{ scale: [1, 1.12, 1] }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-full bg-zinc-100"
                />
                <div className="relative w-20 h-20 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                    <StarOff className="w-8 h-8 text-zinc-300" />
                </div>

                {/* Floating stars */}
                {[
                    { delay: 0, x: -28, y: -10 },
                    { delay: 0.3, x: 28, y: -14 },
                    { delay: 0.6, x: 0, y: -32 },
                ].map((config, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0.5, 1, 0.5],
                            y: [config.y, config.y - 8, config.y],
                        }}
                        transition={{
                            delay: config.delay + 0.5,
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute"
                        style={{ left: `calc(50% + ${config.x}px)`, top: 0 }}
                    >
                        <Star className="w-3 h-3 fill-zinc-200 text-zinc-200" />
                    </motion.div>
                ))}
            </motion.div>

            {/* Text */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.35 }}
                className="space-y-2"
            >
                <h3 className="text-base font-semibold text-zinc-700">
                    {isFiltered
                        ? "No reviews match this rating"
                        : "No reviews yet"}
                </h3>
                <p className="text-sm text-zinc-400 max-w-xs">
                    {isFiltered
                        ? "Try selecting a different star rating or clear the filter to see all your reviews."
                        : "Once you complete a booking, you'll be able to leave a review for the vehicle."}
                </p>
            </motion.div>
        </motion.div>
    );
}

export default function AllReviewCard({
    initialQueryString,
}: {
    initialQueryString: string;
}) {
    const searchParams = useSearchParams();
    const [deletingReview, setDeletingReview] = useState<IReview | null>(null);

    const {
        queryStringFromUrl,
        optimisticPaginationState,
        updateParams,
        handlePaginationChange,
    } = useServerManagedDataTable({
        searchParams,
        defaultPage: DEFAULT_PAGE,
        defaultLimit: DEFAULT_LIMIT,
    });

    const queryString = queryStringFromUrl || initialQueryString;
    const activeSortBy = searchParams.get("rating") ?? "";

    const handleSortByChange = (val: string) => {
        updateParams(
            (params) => {
                if (val) {
                    params.set("rating", val);
                } else {
                    params.delete("rating");
                }
            },
            { resetPage: true },
        );
    };

    const {
        data: reviewData,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ["reviews", queryString],
        queryFn: () => getAllReviews(queryString),
    });

    const reviews: IReview[] = reviewData?.data ?? [];
    const meta: PaginationMeta | undefined = reviewData?.meta;

    if (isLoading) return <LoadingSpinner />;

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                        All Reviews
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">
                        Manage all reviews.
                    </p>
                </div>
                <StarSortFilter
                    value={activeSortBy}
                    onChange={handleSortByChange}
                />
            </div>

            {reviews.length === 0 ? (
                <EmptyReviews isFiltered={!!activeSortBy} />
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 mb-10">
                        {reviews.map((review, index) => (
                            <ReviewCard
                                review={review}
                                index={index}
                                key={review.id}
                                onDelete={(id) =>
                                    setDeletingReview(
                                        reviews.find((r) => r.id === id) ??
                                            null,
                                    )
                                }
                            />
                        ))}
                    </div>

                    {meta && (
                        <DataTablePagination
                            table={
                                {
                                    getState: () => ({
                                        pagination: optimisticPaginationState,
                                    }),
                                    getPageCount: () => meta.totalPages,
                                    previousPage: () =>
                                        handlePaginationChange({
                                            pageIndex:
                                                optimisticPaginationState.pageIndex -
                                                1,
                                            pageSize:
                                                optimisticPaginationState.pageSize,
                                        }),
                                    nextPage: () =>
                                        handlePaginationChange({
                                            pageIndex:
                                                optimisticPaginationState.pageIndex +
                                                1,
                                            pageSize:
                                                optimisticPaginationState.pageSize,
                                        }),
                                    setPageIndex: (pageIndex: number) =>
                                        handlePaginationChange({
                                            pageIndex,
                                            pageSize:
                                                optimisticPaginationState.pageSize,
                                        }),
                                    setPagination: ({
                                        pageIndex,
                                        pageSize,
                                    }: {
                                        pageIndex: number;
                                        pageSize: number;
                                    }) =>
                                        handlePaginationChange({
                                            pageIndex,
                                            pageSize,
                                        }),
                                    getCanPreviousPage: () =>
                                        optimisticPaginationState.pageIndex > 0,
                                    getCanNextPage: () =>
                                        optimisticPaginationState.pageIndex +
                                            1 <
                                        meta.totalPages,
                                } as any
                            }
                            totalRows={meta.total}
                            totalPages={meta.totalPages}
                            isLoading={isFetching}
                        />
                    )}
                </>
            )}

            <DeleteReviewDialog
                open={!!deletingReview}
                onOpenChange={(open) => !open && setDeletingReview(null)}
                review={deletingReview}
            />
        </>
    );
}
