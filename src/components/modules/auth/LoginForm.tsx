"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { loginAction } from "@/app/(commonLayout)/(authRouteGroup)/login/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { loginAction } from "../../../app/(commonLayout)/(authRouteGroup)/login/_action";
import { Separator } from "../../ui/separator";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../ui/card";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

interface LoginFormProps {
    redirectPath?: string;
}

const LoginForm = ({ redirectPath }: LoginFormProps) => {
    // const queryClient = useQueryClient();

    const [serverError, setServerError] = useState<string | null>(null);
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
            setServerError(null);
            const toastId = toast.loading("Logging in...");
            try {
                const result = (await mutateAsync(value)) as any;

                if (!result.success) {
                    setServerError(result.message || "Login failed");
                    toast.error(result.message || "Login failed", {
                        id: toastId,
                    });
                    return;
                }
                toast.success(result.message || "Login successful", { id: toastId });
            } catch (error: any) {
                console.log(`Login failed: ${error.message}`);
                setServerError(`Login failed: ${error.message}`);
                toast.error(
                    `${error.message}` ||
                        "Something went wrong, please try again.",
                    {
                        id: toastId,
                    },
                );
            }
        },
    });
    return (
        <div className="min-h-screen mt-40">
            <div className="flex justify-center">
                <div className="max-w-md w-full">
                    <Card className="w-full shadow-md">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-bold">
                                Welcome Back!
                            </CardTitle>
                            <CardDescription>
                                Please enter your credentials to log in.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
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
                                            // type="text"
                                            placeholder="Enter your password"
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                            className="cursor-pointer"
                                            append={
                                                <Button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            (value) => !value,
                                                        )
                                                    }
                                                    variant="ghost"
                                                    size="icon"
                                                    className={`cursor-pointer`}
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

                                <div className="text-right mt-2">
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm text-primary hover:underline underline-offset-4"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

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
                                            pendingLabel="Logging In...."
                                            disabled={!canSubmit}
                                        >
                                            Log In
                                        </AppSubmitButton>
                                    )}
                                </form.Subscribe>
                            </form>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full cursor-pointer"
                                onClick={() => {
                                    const baseUrl =
                                        process.env.NEXT_PUBLIC_API_BASE_URL;
                                    //TODO redirect path after login in frontend
                                    window.location.href = `${baseUrl}/auth/login/google`;
                                }}
                            >
                                <FcGoogle size={24} />
                                Sign in with Google
                            </Button>
                        </CardContent>

                        <CardFooter className="justify-center border-t pt-4 bg-white">
                            <p className="text-sm text-muted-foreground">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href={`/register?redirectPath=${redirectPath}`}
                                    className="text-primary font-medium hover:underline underline-offset-4"
                                >
                                    Sign Up for an account
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
