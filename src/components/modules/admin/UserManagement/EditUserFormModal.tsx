"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserInfo } from "../../../../services/auth.services"; // ⚠️ adjust path
import { updateUserRole } from "../../../../services/user.services"; // ⚠️ adjust path
import { IUser } from "../../../../types/user.type";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ShieldAlert, UserCog, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { UserRole } from "../../../../types/enum.type";

// ── role option config ────────────────────────────────────────────────────────

const ROLES: {
    value: UserRole;
    label: string;
    description: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    border: string;
    selectedBorder: string;
    selectedBg: string;
}[] = [
    {
        value: "ADMIN",
        label: "Admin",
        description: "Full access to all management features",
        icon: ShieldAlert,
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-100",
        selectedBorder: "border-red-400",
        selectedBg: "bg-red-50",
    },
    {
        value: "CUSTOMER",
        label: "Customer",
        description: "Can browse and book vehicles",
        icon: ShieldCheck,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-100",
        selectedBorder: "border-emerald-400",
        selectedBg: "bg-emerald-50",
    },
];

// ── props ─────────────────────────────────────────────────────────────────────

interface EditUserFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: IUser | null;
}

export default function EditUserFormModal({
    open,
    onOpenChange,
    user,
}: EditUserFormModalProps) {
    const queryClient = useQueryClient();

    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

    // Reset selection whenever the target user changes
    useEffect(() => {
        if (user) setSelectedRole(user.role);
    }, [user]);

    const { data: meData, isLoading: isMeLoading } = useQuery({
        queryKey: ["me"],
        queryFn: () => getUserInfo(),
    });

    const myUserId = meData?.id;
    const isSelf = !!myUserId && myUserId === user?.id;
    const isUnchanged = selectedRole === user?.role;
    const canSubmit = !isMeLoading && !isSelf && !isUnchanged && !!selectedRole;

    const bookingCount = user?.bookings?.length ?? 0;
    const reviewCount = user?.reviews?.length ?? 0;
    const hasActivity = bookingCount > 0 || reviewCount > 0;

    const { mutate, isPending } = useMutation({
        mutationFn: () =>
            updateUserRole({
                userId: user!.id,
                role: selectedRole as UserRole,
            }),
        onSuccess: (result: any) => {
            if (result?.success === false) {
                toast.error(result?.message || "Failed to update role.");
                return;
            }
            toast.success(result?.message || "User role updated successfully.");
            void queryClient.invalidateQueries({ queryKey: ["users"] });
            onOpenChange(false);
        },
        onError: (error: any) => {
            toast.error(error?.message || "Something went wrong.");
        },
    });

    if (!user) return null;

    const initials = user.name
        .split(" ")
        .map((p) => p.charAt(0).toUpperCase())
        .join("")
        .slice(0, 2);

    const handleSubmit = () => {
        if (hasActivity) {
            toast.error("Cannot update role of a user with activity.");
            onOpenChange(false);
            return;
        }
        mutate();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100vw-1.5rem)] max-w-sm gap-0 overflow-hidden p-0">
                {/* Top accent bar */}
                <div className="h-1 w-full bg-linear-to-r from-orange-400 via-[#FF5100] to-orange-400" />

                <DialogHeader className="border-b px-6 py-5">
                    <DialogTitle className="text-base font-bold text-zinc-900">
                        Edit User Role
                    </DialogTitle>
                    <DialogDescription className="text-sm text-zinc-400">
                        Change the platform role for this user.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-5 space-y-5">
                    {/* ── User identity card ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3"
                    >
                        <div className="h-10 w-10 rounded-full bg-orange-50 border-2 border-orange-100 flex items-center justify-center shrink-0">
                            {user.image ? (
                                <img
                                    src={user.image}
                                    alt={initials}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            ) : (
                                <span className="text-sm font-bold text-[#FF5100]">
                                    {initials}
                                </span>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-zinc-900 truncate">
                                {user.name}
                            </p>
                            <p className="text-xs text-zinc-400 truncate">
                                {user.email}
                            </p>
                        </div>
                        <Badge
                            variant="outline"
                            className="text-[10px] font-bold uppercase tracking-widest border-zinc-200 text-zinc-500 shrink-0"
                        >
                            {user.role}
                        </Badge>
                    </motion.div>

                    {/* ── Self-edit warning ── */}
                    <AnimatePresence>
                        {isSelf && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
                            >
                                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                                <p className="text-xs text-amber-700 font-medium leading-relaxed">
                                    You cannot change your own role. Ask another
                                    admin to make this change.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!isSelf && (
                        <div className="space-y-2">
                            <p className="text-[11px] text-zinc-400 font-semibold uppercase tracking-widest">
                                Select Role
                            </p>
                            <div className="space-y-2">
                                {ROLES.map((role) => {
                                    const isSelected =
                                        selectedRole === role.value;
                                    const Icon = role.icon;
                                    return (
                                        <motion.button
                                            key={role.value}
                                            type="button"
                                            disabled={isSelf || isMeLoading}
                                            onClick={() =>
                                                setSelectedRole(role.value)
                                            }
                                            whileTap={
                                                !isSelf ? { scale: 0.98 } : {}
                                            }
                                            className={cn(
                                                "w-full flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all duration-150 cursor-pointer",
                                                isSelected
                                                    ? cn(
                                                          role.selectedBorder,
                                                          role.selectedBg,
                                                      )
                                                    : "border-zinc-100 bg-white hover:border-zinc-200 hover:bg-zinc-50",
                                                (isSelf || isMeLoading) &&
                                                    "opacity-50 cursor-not-allowed",
                                            )}
                                        >
                                            {/* Icon */}
                                            <div
                                                className={cn(
                                                    "h-9 w-9 rounded-lg border flex items-center justify-center shrink-0 transition-colors duration-150",
                                                    isSelected
                                                        ? cn(
                                                              role.bg,
                                                              role.border,
                                                          )
                                                        : "bg-zinc-50 border-zinc-100",
                                                )}
                                            >
                                                <Icon
                                                    className={cn(
                                                        "h-4 w-4 transition-colors duration-150",
                                                        isSelected
                                                            ? role.color
                                                            : "text-zinc-400",
                                                    )}
                                                />
                                            </div>

                                            {/* Label */}
                                            <div className="flex-1 min-w-0">
                                                <p
                                                    className={cn(
                                                        "text-sm font-semibold transition-colors duration-150",
                                                        isSelected
                                                            ? "text-zinc-900"
                                                            : "text-zinc-600",
                                                    )}
                                                >
                                                    {role.label}
                                                </p>
                                                <p className="text-xs text-zinc-400 mt-0.5">
                                                    {role.description}
                                                </p>
                                            </div>

                                            {/* Selected dot */}
                                            <div
                                                className={cn(
                                                    "h-4 w-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-150",
                                                    isSelected
                                                        ? cn("border-[#FF5100]")
                                                        : "border-zinc-200",
                                                )}
                                            >
                                                <AnimatePresence>
                                                    {isSelected && (
                                                        <motion.div
                                                            initial={{
                                                                scale: 0,
                                                                opacity: 0,
                                                            }}
                                                            animate={{
                                                                scale: 1,
                                                                opacity: 1,
                                                            }}
                                                            exit={{
                                                                scale: 0,
                                                                opacity: 0,
                                                            }}
                                                            transition={{
                                                                duration: 0.15,
                                                            }}
                                                            className="h-2 w-2 rounded-full bg-[#FF5100]"
                                                        />
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {!isSelf && (
                        <div className="flex gap-2 pt-1">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isPending}
                                onClick={() => onOpenChange(false)}
                                className="flex-1 border-zinc-200 text-zinc-700 hover:bg-zinc-50 h-10 cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                disabled={!canSubmit || isPending}
                                onClick={handleSubmit}
                                className="flex-1 bg-[#FF5100] hover:bg-orange-600 text-white h-10 gap-2 disabled:opacity-60 cursor-pointer"
                            >
                                {isPending ? (
                                    <>
                                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <UserCog className="w-4 h-4" />
                                        Update Role
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
