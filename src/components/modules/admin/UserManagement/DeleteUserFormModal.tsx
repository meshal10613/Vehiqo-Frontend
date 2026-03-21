"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserInfo } from "../../../../services/auth.services";
import { deleteUser } from "../../../../services/user.services";
import { IUser } from "../../../../types/user.type";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
    Trash2,
    AlertCircle,
    CalendarCheck,
    Star,
    ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../../ui/alert-dialog";

interface DeleteUserFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: IUser | null;
}

export default function DeleteUserFormModal({
    open,
    onOpenChange,
    user,
}: DeleteUserFormModalProps) {
    const queryClient = useQueryClient();

    const { data: meData, isLoading: isMeLoading } = useQuery({
        queryKey: ["me"],
        queryFn: () => getUserInfo(),
    });

    const myUserId = meData?.id;
    const isSelf = !!myUserId && myUserId === user?.id;

    const { mutate, isPending } = useMutation({
        mutationFn: () => deleteUser(user!.id),
        onSuccess: (result: any) => {
            if (result?.success === false) {
                toast.error(result?.message || "Failed to delete user.");
                return;
            }
            toast.success(result?.message || "User deleted successfully.");
            void queryClient.invalidateQueries({ queryKey: ["users"] });
            onOpenChange(false);
        },
        onError: (error: any) => {
            toast.error(error?.message || "Something went wrong.");
        },
    });

    const handleDelete = () => {
        if (!user) return;
        if (isSelf) {
            toast.error("You can't delete yourself.");
            onOpenChange(false);
            return;
        }
        mutate();
    };

    if (!user) return null;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="animate-in fade-in-0 zoom-in-95 duration-200 max-w-sm">
                <div className="flex justify-center pt-2 pb-1">
                    <motion.div
                        className={cn(
                            "w-14 h-14 rounded-full border flex items-center justify-center",
                            isSelf
                                ? "bg-amber-50 border-amber-100"
                                : "bg-red-50 border-red-100",
                        )}
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
                            animate={
                                !isSelf
                                    ? {
                                          rotate: [0, -15, 15, -8, 8, 0],
                                      }
                                    : {}
                            }
                            transition={{
                                duration: 0.5,
                                delay: 2,
                                repeat: Infinity,
                                repeatDelay: 2,
                                ease: "easeInOut",
                            }}
                        >
                            {isSelf ? (
                                <ShieldAlert className="w-6 h-6 text-amber-500" />
                            ) : (
                                <Trash2 className="w-6 h-6 text-red-500" />
                            )}
                        </motion.div>
                    </motion.div>
                </div>

                {/* ── Title + description ── */}
                <AlertDialogHeader className="text-center items-center">
                    <AlertDialogTitle className="text-lg font-semibold text-zinc-900">
                        {isSelf
                            ? "Cannot Delete User"
                            : `Delete "${user.name}"?`}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-zinc-500">
                        {isSelf
                            ? "This user cannot be deleted for the reason below."
                            : "This action cannot be undone. The account and all associated data will be permanently removed."}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {/* ── Footer ── */}
                <AlertDialogFooter className="flex-row gap-2 mt-2">
                    <Button
                        variant="outline"
                        disabled={isPending}
                        onClick={() => onOpenChange(false)}
                        className="cursor-pointer flex-1 border-zinc-200 text-zinc-700 hover:bg-zinc-50 h-10"
                    >
                        {isSelf ? "Close" : "Cancel"}
                    </Button>

                    <Button
                        onClick={handleDelete}
                        disabled={isPending || isMeLoading}
                        className={`cursor-pointer flex-1 bg-red-600 hover:bg-red-500 text-white gap-2 h-10`}
                    >
                        {isPending ? (
                            <>
                                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </>
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
