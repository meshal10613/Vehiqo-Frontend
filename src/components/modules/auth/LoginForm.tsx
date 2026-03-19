"use client";

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Button } from "@/components/ui/button";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Separator } from "../../ui/separator";
import { Card, CardContent, CardFooter } from "../../ui/card";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { loginAction } from "../../../app/(authLayout)/sign-in/_action";
import { redirect, useRouter } from "next/navigation";
import { isValidRedirectForRole } from "../../../lib/authUtils";
import { UserRole } from "../../../types/enum.type";
import { motion } from "framer-motion";
import Image from "next/image";

interface LoginFormProps {
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

const LoginForm = ({ redirectPath }: LoginFormProps) => {
    const router = useRouter();
    const redirectTo = redirectPath ? `?redirect=${redirectPath}` : "";
    const [showPassword, setShowPassword] = useState(false);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: ILoginPayload) =>
            loginAction(payload, redirectPath),
    });

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },

        onSubmit: async ({ value }) => {
            const toastId = toast.loading("Sign in...");
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
                    }

                    toast.error(result.message || "Sign In failed", {
                        id: toastId,
                    });
                    return;
                }

                toast.success(result.message || "Sign In successful", {
                    id: toastId,
                });

                targetPath =
                    redirectPath &&
                    isValidRedirectForRole(
                        redirectPath,
                        result.data.user.role as UserRole,
                    )
                        ? redirectPath
                        : "/"; // getDefaultDashboardRoute(role as UserRole)
            } catch (error: any) {
                console.log(`Sign In failed: ${error.message}`);
                toast.error(
                    `${error.message}` ||
                        "Something went wrong, please try again.",
                    {
                        id: toastId,
                    },
                );
                return;
            } finally {
                toast.dismiss(toastId);
                redirect(targetPath);
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

                    {/* Header — outside CardHeader for full custom control */}
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

                        {/* Title */}
                        <div className="space-y-1.5">
                            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                                Welcome back
                            </h1>
                            {/* Animated underline accent */}
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
                                Enter your credentials to access your account
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
                            <motion.div variants={itemVariants}>
                                <form.Field
                                    name="email"
                                    validators={{
                                        onChange: loginZodSchema.shape.email,
                                    }}
                                >
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

                            <motion.div variants={itemVariants}>
                                <form.Field
                                    name="password"
                                    validators={{
                                        onChange: loginZodSchema.shape.password,
                                    }}
                                >
                                    {(field) => (
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
                                    )}
                                </form.Field>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                className="text-right"
                            >
                                <Link
                                    href={`/forgot-password${redirectTo}`}
                                    className="text-sm text-[#FF5100] hover:text-orange-600 hover:underline underline-offset-4 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </motion.div>

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
                                            pendingLabel="Signing in..."
                                            disabled={!canSubmit}
                                        >
                                            Sign In
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
                                Sign in with Google
                            </Button>
                        </motion.div>
                    </CardContent>

                    <CardFooter className="justify-center border-t border-zinc-100 py-5">
                        <motion.p
                            variants={itemVariants}
                            className="text-sm text-zinc-500"
                        >
                            Don&apos;t have an account?{" "}
                            <Link
                                href={`/sign-up${redirectTo}`}
                                className="text-[#FF5100] font-medium hover:text-orange-600 hover:underline underline-offset-4 transition-colors"
                            >
                                Sign up
                            </Link>
                        </motion.p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

export default LoginForm;
