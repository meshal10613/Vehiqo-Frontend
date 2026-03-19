"use client";

import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Card, CardContent, CardFooter } from "../../ui/card";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { forgotPasswordAction } from "../../../app/(authLayout)/forgot-password/_action";

interface ForgotPasswordFormProps {
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

const ForgotPasswordForm = ({ redirectPath }: ForgotPasswordFormProps) => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isPending, setIsPending] = useState(false);
    const redirectTo = redirectPath ? `?redirect=${redirectPath}` : "";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error("Please enter your email address.");
            return;
        }

        const toastId = toast.loading("Sending reset link...");
        setIsPending(true);

        try {
            const response = await forgotPasswordAction({ email });

            if (response?.success === false) {
                toast.error(
                    response?.message ||
                        "Failed to send reset link. Please try again.",
                    { id: toastId },
                );
                return;
            }

            toast.success("Reset link sent! Check your inbox.", {
                id: toastId,
            });
            router.push(
                `/reset-password?email=${encodeURIComponent(email)}${redirectPath ? `&redirect=${redirectPath}` : ""}`,
            );
        } catch (error: any) {
            toast.error(
                error?.message || "Something went wrong. Please try again.",
                { id: toastId },
            );
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
                        href={`/sign-in${redirectTo}`}
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
                                Forgot your password?
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
                                No worries — enter your email and we&apos;ll
                                send you a reset link.
                            </p>
                        </div>
                    </motion.div>

                    <CardContent className="px-8 pb-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Input */}
                            <motion.div
                                variants={itemVariants}
                                className="flex flex-col gap-2"
                            >
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-medium text-zinc-700"
                                >
                                    Email address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        disabled={isPending}
                                        required
                                        className="pl-9 h-11 border-zinc-200 focus-visible:ring-[#FF5100]/20 focus-visible:border-[#FF5100] transition-all duration-200"
                                    />
                                </div>
                            </motion.div>

                            {/* Submit */}
                            <motion.div variants={itemVariants}>
                                <AppSubmitButton
                                    isPending={isPending}
                                    pendingLabel="Sending..."
                                    disabled={!email.trim()}
                                >
                                    Send Reset Link
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

export default ForgotPasswordForm;
