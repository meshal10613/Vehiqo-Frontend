"use client";

import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Card, CardContent, CardFooter } from "../../ui/card";
import { ArrowLeft, Eye, EyeOff, KeyRound, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
// import { resetPasswordAction } from "../../../app/(authLayout)/reset-password/_action";
import { useRouter } from "next/navigation";
import { resetPasswordAction } from "../../../app/(authLayout)/reset-password/_action";

interface ResetPasswordFormProps {
    email: string;
    redirectPath?: string;
}

const containerVariants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.08 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
};

const ResetPasswordForm = ({ email, redirectPath }: ResetPasswordFormProps) => {
    const router = useRouter();
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const redirectTo = redirectPath ? `?redirect=${redirectPath}` : "";

    const isFormValid =
        otp.length === 6 &&
        newPassword.length >= 8 &&
        confirmPassword.length >= 8;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otp.length !== 6) {
            toast.error("Please enter the complete 6-digit code.");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 8 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        const toastId = toast.loading("Resetting your password...");
        setIsPending(true);

        try {
            const response = await resetPasswordAction({
                email: email!,
                otp,
                newPassword,
            });

            if (response?.success === false) {
                toast.error(
                    response?.message || "Reset failed. Please try again.",
                    { id: toastId },
                );
                return;
            }

            toast.success("Password reset successfully!", { id: toastId });
            await new Promise((res) => setTimeout(res, 1200)); // let the toast breathe
            router.push(`/sign-in${redirectTo}`);
        } catch (error: any) {
            toast.error(error?.message || "Reset failed. Please try again.", {
                id: toastId,
            });
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-zinc-50">
            {/* Dot grid background */}
            <div
                className="fixed inset-0 opacity-30 pointer-events-none"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, #FF510018 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                }}
            />

            {/* Glow */}
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-125 h-125 rounded-full bg-orange-300/10 blur-3xl" />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="relative z-10 w-full max-w-md"
            >
                {/* Back to sign in */}
                <motion.div variants={itemVariants} className="mb-4">
                    <Link
                        href={`/forgot-password?email=${encodeURIComponent(email)}${redirectPath ? `&redirect=${redirectPath}` : ""}`}
                        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors duration-200 group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                        Back to forgot password
                    </Link>
                </motion.div>

                <Card className="w-full shadow-xl shadow-zinc-100 border-zinc-200 overflow-hidden gap-0 py-0">
                    {/* Top accent bar */}
                    <div className="h-1 w-full bg-linear-to-r from-orange-400 via-[#FF5100] to-orange-400" />

                    {/* Header */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col items-center gap-3 px-8 pt-8 pb-6 text-center"
                    >
                        <Image
                            src="/l.svg"
                            alt="Vehiqo Logo"
                            width={50}
                            height={50}
                            className="object-contain"
                        />

                        <div className="space-y-1.5">
                            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                                Reset your password
                            </h1>
                            <motion.div
                                className="h-0.5 rounded-full bg-linear-to-r from-transparent via-primary to-transparent mx-auto"
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: "60%", opacity: 1 }}
                                transition={{
                                    duration: 0.7,
                                    delay: 0.3,
                                    ease: "easeOut",
                                }}
                            />
                            <p className="text-sm text-zinc-500 leading-relaxed pt-0.5">
                                Enter the code we sent to
                            </p>
                            {email && (
                                <div className="inline-flex items-center gap-1.5 bg-zinc-100 border border-zinc-200 rounded-lg px-3 py-1.5 mt-1">
                                    <Mail className="w-3.5 h-3.5 text-[#FF5100] shrink-0" />
                                    <span className="text-sm font-medium text-zinc-700 truncate max-w-55">
                                        {email}
                                    </span>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    <CardContent className="px-8 pb-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* OTP */}
                            <motion.div
                                variants={itemVariants}
                                className="flex flex-col items-center gap-3"
                            >
                                <label className="text-sm font-medium text-zinc-700 self-start">
                                    Verification code
                                </label>
                                <InputOTP
                                    maxLength={6}
                                    pattern={REGEXP_ONLY_DIGITS}
                                    value={otp}
                                    onChange={setOtp}
                                    disabled={isPending}
                                >
                                    <InputOTPGroup className="gap-2">
                                        {[0, 1, 2, 3, 4, 5].map((i) => (
                                            <InputOTPSlot
                                                key={i}
                                                index={i}
                                                className="w-11 h-12 text-lg font-semibold border-zinc-200 rounded-lg focus-within:border-[#FF5100] focus-within:ring-[#FF5100]/20 transition-all duration-200"
                                            />
                                        ))}
                                    </InputOTPGroup>
                                </InputOTP>
                            </motion.div>

                            {/* Divider */}
                            <motion.div
                                variants={itemVariants}
                                className="flex items-center gap-3"
                            >
                                <div className="flex-1 h-px bg-zinc-100" />
                                <KeyRound className="w-3.5 h-3.5 text-zinc-300" />
                                <div className="flex-1 h-px bg-zinc-100" />
                            </motion.div>

                            {/* New Password */}
                            <motion.div
                                variants={itemVariants}
                                className="flex flex-col gap-2"
                            >
                                <Label
                                    htmlFor="newPassword"
                                    className="text-sm font-medium text-zinc-700"
                                >
                                    New password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                                    <Input
                                        id="newPassword"
                                        type={
                                            showNewPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Min. 8 characters"
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(e.target.value)
                                        }
                                        disabled={isPending}
                                        required
                                        className="pl-9 pr-10 h-11 border-zinc-200 focus-visible:ring-[#FF5100]/20 focus-visible:border-[#FF5100] transition-all duration-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowNewPassword((p) => !p)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </motion.div>

                            {/* Confirm Password */}
                            <motion.div
                                variants={itemVariants}
                                className="flex flex-col gap-2"
                            >
                                <Label
                                    htmlFor="confirmPassword"
                                    className="text-sm font-medium text-zinc-700"
                                >
                                    Confirm password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                                    <Input
                                        id="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Re-enter your password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        disabled={isPending}
                                        required
                                        className="pl-9 pr-10 h-11 border-zinc-200 focus-visible:ring-[#FF5100]/20 focus-visible:border-[#FF5100] transition-all duration-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword((p) => !p)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>

                                {/* Mismatch hint */}
                                {confirmPassword.length > 0 &&
                                    newPassword !== confirmPassword && (
                                        <p className="text-xs text-red-500 mt-0.5">
                                            Passwords do not match.
                                        </p>
                                    )}
                            </motion.div>

                            {/* Submit */}
                            <motion.div variants={itemVariants}>
                                <AppSubmitButton
                                    isPending={isPending}
                                    pendingLabel="Resetting..."
                                    disabled={!isFormValid}
                                >
                                    Reset Password
                                </AppSubmitButton>
                            </motion.div>
                        </form>
                    </CardContent>

                    <CardFooter className="justify-center border-t border-zinc-100 py-5">
                        <motion.p
                            variants={itemVariants}
                            className="text-sm text-zinc-500"
                        >
                            Remember your password?{" "}
                            <Link
                                href={`/sign-in${redirectTo}`}
                                className="text-[#FF5100] font-medium hover:text-orange-600 hover:underline underline-offset-4 transition-colors"
                            >
                                Sign in
                            </Link>
                        </motion.p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

export default ResetPasswordForm;
