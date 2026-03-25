"use client";

import { useState, useEffect } from "react";
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
import { IReview } from "../../../../types/review.type";
import { updateReview } from "../../../../services/review.services";

interface EditReviewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    review: IReview | null;
}

const STAR_LABELS: Record<number, string> = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Great",
    5: "Excellent",
};

export default function EditReviewModal({
    open,
    onOpenChange,
    review,
}: EditReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [comment, setComment] = useState("");

    const queryClient = useQueryClient();

    // Pre-fill when review changes
    useEffect(() => {
        if (review) {
            setRating(review.rating);
            setComment(review.comment ?? "");
        }
    }, [review]);

    const { mutate, isPending } = useMutation({
        mutationFn: () =>
            updateReview(review!.id, {
                rating,
                comment: comment.trim(),
            }),
        onSuccess: (result: any) => {
            if (result?.success === false) {
                toast.error(result?.message || "Failed to update review.");
                return;
            }
            toast.success(result.message || "Review updated successfully.");
            void queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
            onOpenChange(false);
        },
        onError: (err: any) => {
            toast.error(
                err?.message ?? "Failed to update review. Please try again.",
            );
        },
    });

    if (!review) return null;

    const v = review.booking?.vehicle;
    const activeRating = hovered || rating;
    const hasChanged =
        rating !== review.rating ||
        comment.trim() !== (review.comment ?? "").trim();
    const canSubmit =
        rating > 0 && comment.trim().length > 0 && hasChanged && !isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-zinc-900">
                        Edit Your Review
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        Update your rating or comment for this rental.
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
                        Cancel
                    </Button>
                    <Button
                        onClick={() => mutate()}
                        disabled={!canSubmit}
                        className="bg-[#FF5100] hover:bg-[#e04800] text-white flex-1 cursor-pointer h-10"
                    >
                        {isPending ? "Saving…" : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
