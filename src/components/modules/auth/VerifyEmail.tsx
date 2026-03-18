"use client";

import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "../../ui/card";
import { ArrowLeft, Mail, RotateCcw } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { verifyEmailAction } from "../../../app/(authLayout)/verify-email/_action";
import { useRouter } from "next/navigation";

interface VerifyEmailFormProps {
    email?: string;
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

const VerifyEmailForm = ({ email, redirectPath }: VerifyEmailFormProps) => {
    const router = useRouter();
    const [otp, setOtp] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const redirectTo = redirectPath ? `?redirect=${redirectPath}` : "";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otp.length !== 6) {
            toast.error("Please enter the complete 6-digit code.");
            return;
        }

        const toastId = toast.loading("Verifying your email...");
        setIsPending(true);

        try {
            // TODO: replace with verifyEmailAction(email, otp, redirectPath)
            const serverData: {
                email: string;
                otp: string;
            } = {
                email: email!,
                otp: otp,
            };
            const response = await verifyEmailAction(serverData);

            if (response?.success === false) {
                toast.error(
                    response?.message ||
                        "Verification failed. Please try again.",
                    {
                        id: toastId,
                    },
                );
                return;
            }

            toast.success("Email verified successfully!", { id: toastId });
            router.push(`/sign-in${redirectTo}`);
        } catch (error: any) {
            toast.error(
                error?.message || "Verification failed. Please try again.",
                {
                    id: toastId,
                },
            );
        } finally {
            setIsPending(false);
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        const toastId = toast.loading("Resending verification code...");
        try {
            // TODO: replace with resendOtpAction(email)
            await new Promise((res) => setTimeout(res, 1200));
            toast.success("A new code has been sent to your email.", {
                id: toastId,
            });
            setOtp("");
        } catch (error: any) {
            toast.error(error?.message || "Failed to resend code.", {
                id: toastId,
            });
        } finally {
            setIsResending(false);
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
                        href="/sign-in"
                        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors duration-200 group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                        Back to sign in
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
                                Verify your email
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
                                We sent a 6-digit code to
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
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* OTP Input */}
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

                            {/* Submit */}
                            <motion.div variants={itemVariants}>
                                <AppSubmitButton
                                    isPending={isPending}
                                    pendingLabel="Verifying..."
                                    disabled={otp.length !== 6}
                                >
                                    Verify Email
                                </AppSubmitButton>
                            </motion.div>
                        </form>

                        {/* Resend */}
                        <motion.div
                            variants={itemVariants}
                            className="flex items-center justify-center gap-1.5 mt-5"
                        >
                            <span className="text-sm text-zinc-500">
                                Didn&apos;t receive the code?
                            </span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={isResending}
                                onClick={handleResend}
                                className="text-[#FF5100] hover:text-orange-600 hover:bg-orange-50 gap-1.5 h-auto py-1 px-2 text-sm font-medium cursor-pointer"
                            >
                                {isResending ? (
                                    <>
                                        <span className="w-3.5 h-3.5 rounded-full border-2 border-[#FF5100]/30 border-t-[#FF5100] animate-spin" />
                                        Resending...
                                    </>
                                ) : (
                                    <>
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        Resend code
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    </CardContent>

                    <CardFooter className="justify-center border-t border-zinc-100 py-5">
                        <motion.p
                            variants={itemVariants}
                            className="text-sm text-zinc-500"
                        >
                            Wrong email?{" "}
                            <Link
                                href="/sign-up"
                                className="text-[#FF5100] font-medium hover:text-orange-600 hover:underline underline-offset-4 transition-colors"
                            >
                                Go back and change it
                            </Link>
                        </motion.p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

export default VerifyEmailForm;
