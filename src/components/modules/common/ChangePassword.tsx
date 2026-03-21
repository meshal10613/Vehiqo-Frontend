"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { KeyRound, ShieldCheck, CheckCircle2, EyeOff, Eye } from "lucide-react";
import { changePassword } from "../../../services/user.services";
import { useState } from "react";

// ── SectionLabel — same as EditMyProfileModal ─────────────────────────────────

const SectionLabel = ({
    icon: Icon,
    title,
}: {
    icon: React.ElementType;
    title: string;
}) => (
    <div className="flex items-center gap-2.5 mb-4">
        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#FF5100]/10">
            <Icon className="h-3 w-3 text-[#FF5100]" />
        </div>
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
            {title}
        </p>
        <div className="flex-1 h-px bg-zinc-100" />
    </div>
);

const REQUIREMENTS = [
    { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
    { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
    { label: "One lowercase letter", test: (v: string) => /[a-z]/.test(v) },
    { label: "One number", test: (v: string) => /[0-9]/.test(v) },
    { label: "One special character", test: (v: string) => /[@$!%*?&]/.test(v) },
];

function getStrength(password: string) {
    if (!password) return { score: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 2) return { score, label: "Weak", color: "bg-red-400" };
    if (score === 3) return { score, label: "Fair", color: "bg-amber-400" };
    if (score === 4) return { score, label: "Good", color: "bg-emerald-400" };
    return { score, label: "Strong", color: "bg-emerald-500" };
}

// ── component ─────────────────────────────────────────────────────────────────

export default function ChangePassword() {
    const [showPassword, setShowPassword] = useState(false);
    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: {
            currentPassword: string;
            newPassword: string;
        }) => changePassword(payload),
    });

    const form = useForm({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        onSubmit: async ({ value }) => {
            if (value.currentPassword === value.newPassword) {
                toast.error(
                    "New password cannot be the same as the current password.",
                );
                return;
            }

            if (value.newPassword !== value.confirmPassword) {
                toast.error("New passwords do not match.");
                return;
            }
            if (value.newPassword.length < 8) {
                toast.error("New password must be at least 8 characters.");
                return;
            }

            const toastId = toast.loading("Updating password...");
            try {
                const result = (await mutateAsync({
                    currentPassword: value.currentPassword,
                    newPassword: value.newPassword,
                })) as any;

                if (!result?.success) {
                    toast.error(
                        result?.message || "Failed to change password.",
                        { id: toastId },
                    );
                    return;
                }

                toast.success(
                    result?.message || "Password changed successfully.",
                    { id: toastId },
                );
                form.reset();
            } catch (error: any) {
				console.log(error.response.data)
                toast.error(
                    error?.response?.data?.message ||
                        error?.message ||
                        "Something went wrong.",
                    { id: toastId },
                );
            }
        },
    });

    return (
        <div className="max-w-lg w-full">
            {/* ── Page header ── */}
            <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex items-center gap-3 mb-1">
                    <div className="h-9 w-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                        <KeyRound className="h-4 w-4 text-[#FF5100]" />
                    </div>
                    <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
                        Change Password
                    </h1>
                </div>
                <p className="text-sm text-zinc-400 pl-12">
                    Keep your account secure with a strong, unique password.
                </p>
            </motion.div>

            {/* ── Card ── */}
            <motion.div
                className="rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.08 }}
            >
                {/* Top accent bar */}
                <div className="h-1 w-full bg-linear-to-r from-orange-400 via-[#FF5100] to-orange-400" />

                <div className="px-6 py-5">
                    <form
                        method="POST"
                        action="#"
                        noValidate
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                        className="space-y-6"
                    >
                        {/* ── Current password ── */}
                        <div>
                            <SectionLabel
                                icon={KeyRound}
                                title="Current Password"
                            />
                            <form.Field name="currentPassword">
                                {(field) => (
                                    <AppField
                                        field={field}
                                        label="Current Password"
                                        placeholder="Enter your current password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        disabled={isPending}
                                        append={
                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword((v) => !v)
                                                }
                                                variant="ghost"
                                                size="icon"
                                                className="cursor-pointer hover:bg-white"
                                            >
                                                {showPassword ? (
                                                    <EyeOff
                                                        className="size-4"
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    <Eye
                                                        className="size-4"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                            </Button>
                                        }
                                    />
                                )}
                            </form.Field>
                        </div>

                        {/* ── New password ── */}
                        <div>
                            <SectionLabel
                                icon={ShieldCheck}
                                title="New Password"
                            />
                            <div className="space-y-4">
                                {/* New password field + strength bar */}
                                <form.Field name="newPassword">
                                    {(field) => {
                                        const value = field.state.value ?? "";
                                        const strength = getStrength(value);
                                        return (
                                            <div className="space-y-2">
                                                <AppField
                                                    field={field}
                                                    label="New Password"
                                                    placeholder="Enter a new password"
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    disabled={isPending}
                                                    append={
                                                        <Button
                                                            type="button"
                                                            onClick={() =>
                                                                setShowPassword(
                                                                    (v) => !v,
                                                                )
                                                            }
                                                            variant="ghost"
                                                            size="icon"
                                                            className="cursor-pointer hover:bg-white"
                                                        >
                                                            {showPassword ? (
                                                                <EyeOff
                                                                    className="size-4"
                                                                    aria-hidden="true"
                                                                />
                                                            ) : (
                                                                <Eye
                                                                    className="size-4"
                                                                    aria-hidden="true"
                                                                />
                                                            )}
                                                        </Button>
                                                    }
                                                />
                                                <AnimatePresence>
                                                    {value.length > 0 && (
                                                        <motion.div
                                                            initial={{
                                                                opacity: 0,
                                                                height: 0,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                height: "auto",
                                                            }}
                                                            exit={{
                                                                opacity: 0,
                                                                height: 0,
                                                            }}
                                                            transition={{
                                                                duration: 0.2,
                                                            }}
                                                            className="overflow-hidden space-y-1"
                                                        >
                                                            <div className="flex gap-1">
                                                                {[
                                                                    1, 2, 3, 4,
                                                                    5,
                                                                ].map((i) => (
                                                                    <div
                                                                        key={i}
                                                                        className={cn(
                                                                            "h-1 flex-1 rounded-full transition-colors duration-300",
                                                                            i <=
                                                                                strength.score
                                                                                ? strength.color
                                                                                : "bg-zinc-100",
                                                                        )}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <p
                                                                className={cn(
                                                                    "text-[11px] font-semibold",
                                                                    strength.label ===
                                                                        "Weak" &&
                                                                        "text-red-400",
                                                                    strength.label ===
                                                                        "Fair" &&
                                                                        "text-amber-500",
                                                                    (strength.label ===
                                                                        "Good" ||
                                                                        strength.label ===
                                                                            "Strong") &&
                                                                        "text-emerald-500",
                                                                )}
                                                            >
                                                                {strength.label}
                                                            </p>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    }}
                                </form.Field>

                                {/* Confirm password */}
                                <form.Field name="confirmPassword">
                                    {(field) => (
                                        <AppField
                                            field={field}
                                            label="Confirm New Password"
                                            placeholder="Re-enter your new password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            disabled={isPending}
                                            append={
                                                <Button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            (v) => !v,
                                                        )
                                                    }
                                                    variant="ghost"
                                                    size="icon"
                                                    className="cursor-pointer hover:bg-white"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff
                                                            className="size-4"
                                                            aria-hidden="true"
                                                        />
                                                    ) : (
                                                        <Eye
                                                            className="size-4"
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                </Button>
                                            }
                                        />
                                    )}
                                </form.Field>

                                {/* Requirements checklist — shown only when typing */}
                                <form.Field name="newPassword">
                                    {(field) => {
                                        const value = field.state.value ?? "";
                                        if (!value) return null;
                                        return (
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    height: 0,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    height: "auto",
                                                }}
                                                className="rounded-xl bg-zinc-50 border border-zinc-100 px-4 py-3 space-y-1.5 overflow-hidden"
                                            >
                                                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                                                    Requirements
                                                </p>
                                                {REQUIREMENTS.map(
                                                    ({ label, test }) => {
                                                        const met = test(value);
                                                        return (
                                                            <div
                                                                key={label}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <motion.div
                                                                    animate={{
                                                                        scale: met
                                                                            ? [
                                                                                  1,
                                                                                  1.4,
                                                                                  1,
                                                                              ]
                                                                            : 1,
                                                                    }}
                                                                    transition={{
                                                                        duration: 0.2,
                                                                    }}
                                                                >
                                                                    {met ? (
                                                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                                                    ) : (
                                                                        <div className="h-3.5 w-3.5 rounded-full border-2 border-zinc-200" />
                                                                    )}
                                                                </motion.div>
                                                                <span
                                                                    className={cn(
                                                                        "text-xs transition-colors duration-200",
                                                                        met
                                                                            ? "text-emerald-600 font-medium"
                                                                            : "text-zinc-400",
                                                                    )}
                                                                >
                                                                    {label}
                                                                </span>
                                                            </div>
                                                        );
                                                    },
                                                )}
                                            </motion.div>
                                        );
                                    }}
                                </form.Field>
                            </div>
                        </div>

                        {/* ── Footer ── */}
                        <div className="flex items-center gap-3 border-t border-zinc-100 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isPending}
                                onClick={() => form.reset()}
                                className="h-10 flex-1 cursor-pointer border-zinc-200 text-zinc-700"
                            >
                                Reset
                            </Button>

                            <form.Subscribe
                                selector={(state) =>
                                    [
                                        state.canSubmit,
                                        state.isSubmitting,
                                    ] as const
                                }
                            >
                                {([canSubmit, isSubmitting]) => (
                                    <AppSubmitButton
                                        isPending={isSubmitting || isPending}
                                        pendingLabel="Updating..."
                                        disabled={!canSubmit}
                                        className="flex-1 h-10 cursor-pointer"
                                    >
                                        Update Password
                                    </AppSubmitButton>
                                )}
                            </form.Subscribe>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
