"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyReviews } from "../../../../services/review.services";
import { PaginationMeta } from "../../../../types/api.type";
import { useRowActionModalState } from "../../../../hooks/useRowActionModalState";
import { IReview } from "../../../../types/review.type";
import { useServerManagedDataTable } from "../../../../hooks/useServerManagedDataTable";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;

import { Pencil, Quote, Star, Trash2 } from "lucide-react";
import DataTablePagination from "../../../shared/table/DataTablePagination";
import { Avatar, timeAgo } from "../../home/Reviews";
import DeleteReviewDialog from "./DeleteReviewDialog";
import EditReviewModal from "./EditReviewModal";
import { useState } from "react";

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
    onEdit,
    onDelete,
}: {
    review: IReview;
    index: number;
    onEdit?: (review: IReview) => void;
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
            className="group relative flex flex-col bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#FF5100]/15 transition-all duration-300 overflow-hidden w-72 h-70"
        >
            {/* Top-left orange accent */}
            <div className="absolute top-0 left-0 w-10 h-1 bg-[#FF5100] rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Edit / Delete actions — visible on hover */}
            <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                <button
                    onClick={() => onEdit?.(review)}
                    className="p-1.5 rounded-full text-zinc-400 hover:text-blue-500 hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
                    aria-label="Edit review"
                >
                    <Pencil className="w-3.5 h-3.5" />
                </button>
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

export default function MyReviewCard({
    initialQueryString,
}: {
    initialQueryString: string;
}) {
    const searchParams = useSearchParams();

    const [editingReview, setEditingReview] = useState<IReview | null>(null);
    const [deletingReview, setDeletingReview] = useState<IReview | null>(null);

    const {
        queryStringFromUrl,
        optimisticSortingState,
        optimisticPaginationState,
        isRouteRefreshPending,
        updateParams,
        handleSortingChange,
        handlePaginationChange,
    } = useServerManagedDataTable({
        searchParams,
        defaultPage: DEFAULT_PAGE,
        defaultLimit: DEFAULT_LIMIT,
    });

    const queryString = queryStringFromUrl || initialQueryString;

    const {
        data: reviewData,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ["my-reviews", queryString],
        queryFn: () => getMyReviews(queryString),
    });

    const reviews: IReview[] = reviewData?.data ?? [];
    const meta: PaginationMeta | undefined = reviewData?.meta;

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 mb-10 w-fit mx-auto">
                {reviews.map((review, index) => (
                    <ReviewCard
                        review={review}
                        index={index}
                        key={index}
                        onEdit={(r) => setEditingReview(r)}
                        onDelete={(id) =>
                            setDeletingReview(
                                reviews.find((r) => r.id === id) ?? null,
                            )
                        }
                    />
                ))}
            </div>

            {/* Pagination */}
            {meta && (
                <div>
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
                                setPagination: ({ pageIndex, pageSize }) =>
                                    handlePaginationChange({
                                        pageIndex,
                                        pageSize,
                                    }),
                                getCanPreviousPage: () =>
                                    optimisticPaginationState.pageIndex > 0,
                                getCanNextPage: () =>
                                    optimisticPaginationState.pageIndex + 1 <
                                    meta.totalPages,
                            } as any
                        }
                        totalRows={meta.total}
                        totalPages={meta.totalPages}
                        isLoading={isFetching}
                    />
                </div>
            )}

            <EditReviewModal
                open={!!editingReview}
                onOpenChange={(open) => !open && setEditingReview(null)}
                review={editingReview}
            />

            <DeleteReviewDialog
                open={!!deletingReview}
                onOpenChange={(open) => !open && setDeletingReview(null)}
                review={deletingReview}
            />
        </>
    );
}
