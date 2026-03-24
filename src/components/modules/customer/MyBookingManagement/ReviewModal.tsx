"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Star, Car, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import { Textarea } from "../../../ui/textarea";
import { IBooking } from "../../../../types/booking.type";
import { createReview } from "../../../../services/review.services";

interface ReviewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking: IBooking | null;
}

const STAR_LABELS: Record<number, string> = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Great",
    5: "Excellent",
};

export default function ReviewModal({
    open,
    onOpenChange,
    booking,
}: ReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [comment, setComment] = useState("");

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: () =>
            createReview({
                bookingId: booking!.id,
                rating,
                comment: comment.trim(),
            }),
        onSuccess: () => {
            toast.success("Review submitted! Thank you for your feedback.");
            queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
            onOpenChange(false);
            // Reset state
            setRating(0);
            setComment("");
        },
        onError: (err: any) => {
            toast.error(
                err?.message ?? "Failed to submit review. Please try again.",
            );
        },
    });

    if (!booking) return null;

    const v = booking.vehicle;
    const activeRating = hovered || rating;
    const canSubmit = rating > 0 && !isPending && comment.trim().length > 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-zinc-900">
                        Rate Your Experience
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        Share your feedback about this rental. Your review helps
                        other customers.
                    </DialogDescription>
                </DialogHeader>

                {/* Vehicle info */}
                <div className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 p-3">
                    {v?.image?.[0] ? (
                        <img
                            src={v.image[0]}
                            alt={`${v.brand} ${v.model}`}
                            className="w-12 h-9 rounded-lg object-cover border border-zinc-200 shrink-0"
                        />
                    ) : (
                        <div className="w-12 h-9 rounded-lg bg-zinc-200 flex items-center justify-center shrink-0">
                            <Car className="w-4 h-4 text-zinc-400" />
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-zinc-800 text-sm">
                            {v?.brand} {v?.model}
                        </p>
                        <p className="text-xs text-zinc-400">
                            {v?.year} · {v?.plateNo}
                        </p>
                    </div>
                </div>

                {/* Star rating */}
                <div className="space-y-2">
                    <p className="text-sm font-medium text-zinc-700">
                        Your rating
                        <span className="text-red-500 ml-0.5">*</span>
                    </p>
                    <div
                        className="flex items-center gap-1"
                        onMouseLeave={() => setHovered(0)}
                    >
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHovered(star)}
                                className="p-0.5 transition-transform hover:scale-110 focus:outline-none"
                                aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                            >
                                <Star
                                    className={cn(
                                        "w-8 h-8 transition-colors",
                                        star <= activeRating
                                            ? "fill-amber-400 text-amber-400"
                                            : "text-zinc-200 fill-zinc-200",
                                    )}
                                />
                            </button>
                        ))}
                        {activeRating > 0 && (
                            <span className="ml-2 text-sm font-medium text-amber-600">
                                {STAR_LABELS[activeRating]}
                            </span>
                        )}
                    </div>
                </div>

                {/* Comment */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                        Comment
                    </label>
                    <Textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="How was your experience with this vehicle?"
                        className="resize-none h-24 text-sm"
                        maxLength={500}
                    />
                    <p className="text-xs text-zinc-400 text-right">
                        {comment.length}/500
                    </p>
                </div>

                <DialogFooter className="gap-2 flex items-center">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
						className="flex-1 cursor-pointer h-10"
                    >
                        Skip
                    </Button>
                    <Button
                        onClick={() => mutate()}
                        disabled={!canSubmit}
                        className="bg-[#FF5100] hover:bg-[#e04800] text-white flex-1 cursor-pointer h-10"
                    >
                        {isPending ? "Submitting…" : "Submit Review"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
