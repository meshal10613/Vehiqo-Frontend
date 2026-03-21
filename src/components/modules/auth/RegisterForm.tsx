"use client";

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Separator } from "../../ui/separator";
import { Card, CardContent, CardFooter } from "../../ui/card";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { IRegisterPayload } from "../../../zod/auth.validation";
import { registerAction } from "../../../app/(authLayout)/sign-up/_action";
import { cn } from "../../../lib/utils";

const REQUIREMENTS = [
    { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
    { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
    { label: "One lowercase letter", test: (v: string) => /[a-z]/.test(v) },
    { label: "One number", test: (v: string) => /[0-9]/.test(v) },
    {
        label: "One special character",
        test: (v: string) => /[@$!%*?&]/.test(v),
    },
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

interface RegisterFormProps {
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

const RegisterForm = ({ redirectPath }: RegisterFormProps) => {
    const router = useRouter();
    const redirectTo = redirectPath ? `?redirect=${redirectPath}` : "";
    const [showPassword, setShowPassword] = useState(false);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IRegisterPayload) =>
            registerAction(payload, redirectPath),
    });

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },

        onSubmit: async ({ value }) => {
            const toastId = toast.loading("Creating account...");
            let targetPath = "/";
            try {
                const result = (await mutateAsync(value)) as any;

                if (!result.success) {
                    if (result.message === "Email not verified") {
                        const email = value.email;
                        const query = redirectTo
                            ? `${redirectTo}&email=${email}`
                            : `?email=${email}`;
                        router.push(`/verify-email${query}`);
                        return;
                    }

                    toast.error(result.message || "Registration failed", {
                        id: toastId,
                    });
                    return;
                }

                toast.success(
                    result.message || "Account created successfully",
                    {
                        id: toastId,
                    },
                );
                targetPath = redirectPath ? redirectPath : "/";

                router.push(targetPath);
            } catch (error: any) {
                console.log(`Registration failed: ${error.message}`);
                toast.error(
                    `${error.message}` ||
                        "Something went wrong, please try again.",
                    { id: toastId },
                );
            } finally {
                toast.dismiss(toastId);
            }
        },
    });

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
                {/* Back to home */}
                <motion.div variants={itemVariants} className="mb-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors duration-200 group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                        Back to home
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
                                Create an account
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
                                Fill in your details to get started
                            </p>
                        </div>
                    </motion.div>

                    <CardContent className="px-8 pb-6">
                        <form
                            method="POST"
                            action="#"
                            noValidate
                            onSubmit={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                form.handleSubmit();
                            }}
                            className="space-y-4"
                        >
                            {/* Name */}
                            <motion.div variants={itemVariants}>
                                <form.Field name="name">
                                    {(field) => (
                                        <AppField
                                            field={field}
                                            label="Name"
                                            type="text"
                                            placeholder="Enter your full name"
                                        />
                                    )}
                                </form.Field>
                            </motion.div>

                            {/* Email */}
                            <motion.div variants={itemVariants}>
                                <form.Field name="email">
                                    {(field) => (
                                        <AppField
                                            field={field}
                                            label="Email"
                                            type="email"
                                            placeholder="Enter your email"
                                        />
                                    )}
                                </form.Field>
                            </motion.div>

                            {/* Password */}
                            <motion.div variants={itemVariants}>
                                <form.Field name="password">
                                    {(field) => {
                                        const value = field.state.value ?? "";
                                        const strength = getStrength(value);

                                        return (
                                            <div>
                                                <AppField
                                                    field={field}
                                                    label="Password"
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    placeholder="Enter your password"
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
                            </motion.div>

                            <form.Field name="password">
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

                            <motion.div variants={itemVariants}>
                                <form.Subscribe
                                    selector={(s) =>
                                        [s.canSubmit, s.isSubmitting] as const
                                    }
                                >
                                    {([canSubmit, isSubmitting]) => (
                                        <AppSubmitButton
                                            isPending={
                                                isSubmitting || isPending
                                            }
                                            pendingLabel="Creating account..."
                                            disabled={!canSubmit}
                                        >
                                            Sign Up
                                        </AppSubmitButton>
                                    )}
                                </form.Subscribe>
                            </motion.div>
                        </form>

                        {/* Divider */}
                        <motion.div
                            variants={itemVariants}
                            className="flex items-center gap-3 my-5"
                        >
                            <Separator className="flex-1 bg-zinc-100" />
                            <span className="text-xs text-zinc-400 shrink-0">
                                or continue with
                            </span>
                            <Separator className="flex-1 bg-zinc-100" />
                        </motion.div>

                        {/* Google */}
                        <motion.div variants={itemVariants}>
                            <Button
                                variant="outline"
                                className="w-full cursor-pointer h-10 border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 gap-2.5 transition-all duration-200"
                                onClick={() => {
                                    const baseUrl =
                                        process.env.NEXT_PUBLIC_API_BASE_URL;
                                    window.location.href = `${baseUrl}/auth/login/google`;
                                }}
                            >
                                <FcGoogle size={18} />
                                Sign up with Google
                            </Button>
                        </motion.div>
                    </CardContent>

                    <CardFooter className="justify-center border-t border-zinc-100 py-5">
                        <motion.p
                            variants={itemVariants}
                            className="text-sm text-zinc-500"
                        >
                            Already have an account?{" "}
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

export default RegisterForm;
