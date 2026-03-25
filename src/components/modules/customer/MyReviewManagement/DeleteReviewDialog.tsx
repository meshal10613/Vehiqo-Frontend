"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { IReview } from "../../../../types/review.type";
import { deleteReview } from "../../../../services/review.services";

interface DeleteReviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    review: IReview | null;
}

export default function DeleteReviewDialog({
    open,
    onOpenChange,
    review,
}: DeleteReviewDialogProps) {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: () => deleteReview(review!.id),
        onSuccess: (result: any) => {
            if (result?.success === false) {
                toast.error(result?.message || "Failed to delete review.");
                return;
            }
            toast.success(result.message || "Review deleted successfully.");
            void queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
            void queryClient.invalidateQueries({ queryKey: ["reviews"] });
            onOpenChange(false);
        },
        onError: (error: any) => {
            toast.error(error.message || "Something went wrong.");
        },
    });

    if (!review) return null;

    const vehicleName = review.booking?.vehicle
        ? `${review.booking.vehicle.brand} ${review.booking.vehicle.model}`
        : "Unknown Vehicle";

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="animate-in fade-in-0 zoom-in-95 duration-200 max-w-sm">
                {/* Icon */}
                <div className="flex justify-center pt-2 pb-1">
                    <motion.div
                        className="w-14 h-14 rounded-full border bg-red-50 border-red-100 flex items-center justify-center"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                            delay: 0.1,
                        }}
                    >
                        <motion.div
                            animate={{ rotate: [0, -15, 15, -8, 8, 0] }}
                            transition={{
                                duration: 0.5,
                                delay: 2,
                                repeat: Infinity,
                                repeatDelay: 2,
                                ease: "easeInOut",
                            }}
                        >
                            <Trash2 className="w-6 h-6 text-red-500" />
                        </motion.div>
                    </motion.div>
                </div>

                {/* Title + description */}
                <AlertDialogHeader className="text-center items-center">
                    <AlertDialogTitle className="text-lg font-semibold text-zinc-900">
                        Delete this review?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-zinc-500">
                        You're about to permanently delete your review for{" "}
                        <span className="font-semibold text-zinc-700">
                            {vehicleName}
                        </span>
                        . This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {/* Footer */}
                <AlertDialogFooter className="flex-row gap-2 mt-2">
                    <Button
                        variant="outline"
                        disabled={isPending}
                        onClick={() => onOpenChange(false)}
                        className="cursor-pointer flex-1 border-zinc-200 text-zinc-700 hover:bg-zinc-50 h-10"
                    >
                        Keep review
                    </Button>
                    <Button
                        onClick={() => mutate()}
                        disabled={isPending}
                        className="cursor-pointer flex-1 bg-red-600 hover:bg-red-500 text-white gap-2 h-10"
                    >
                        {isPending ? (
                            <>
                                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4" />
                                Yes, delete
                            </>
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}