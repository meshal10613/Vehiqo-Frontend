import { cn } from "@/lib/utils";
import type { AnyFieldApi } from "@tanstack/react-form";
import { AlertCircle } from "lucide-react";
import React from "react";

const getErrorMessage = (error: unknown): string => {
    if (typeof error === "string") return error;
    if (error && typeof error === "object") {
        if ("message" in error && typeof error.message === "string") {
            return error.message;
        }
    }
    return String(error);
};

type AppFieldProps = {
    field: AnyFieldApi;
    label: string;
    type?: "text" | "email" | "password" | "number" | "date" | "time";
    placeholder?: string;
    append?: React.ReactNode;
    prepend?: React.ReactNode;
    className?: string;
    disabled?: boolean;
};

const AppField = ({
    field,
    label,
    type = "text",
    placeholder,
    append,
    prepend,
    className,
    disabled = false,
}: AppFieldProps) => {
    const firstError =
        field.state.meta.isTouched && field.state.meta.errors.length > 0
            ? getErrorMessage(field.state.meta.errors[0])
            : null;

    const hasError = firstError !== null;
    // const hasValue =
    //     field.state.value !== "" &&
    //     field.state.value !== undefined &&
    //     field.state.value !== null;

    return (
        <div className={cn("group/field flex flex-col gap-1.5", className)}>
            {/* Label */}
            <label
                htmlFor={field.name}
                className={cn(
                    "text-sm font-medium transition-colors duration-200",
                    hasError
                        ? "text-rose-500"
                        : "text-zinc-600 group-focus-within/field:text-zinc-900",
                    disabled && "opacity-50 cursor-not-allowed",
                )}
            >
                {label}
            </label>

            {/* Input wrapper */}
            <div
                className={cn(
                    "relative flex items-center rounded-lg border bg-white transition-all duration-200",
                    // default
                    "border-zinc-200 shadow-sm",
                    // focus-within
                    !hasError &&
                        "focus-within:border-rose-400 focus-within:shadow-[0_0_0_3px_rgba(244,63,94,0.08)]",
                    // error
                    hasError &&
                        "border-rose-400 shadow-[0_0_0_3px_rgba(244,63,94,0.08)]",
                    // disabled
                    disabled && "opacity-50 bg-zinc-50 cursor-not-allowed",
                )}
            >
                {/* Prepend */}
                {prepend && (
                    <div
                        className={cn(
                            "flex items-center justify-center pl-3 shrink-0 text-zinc-400 transition-colors duration-200",
                            "group-focus-within/field:text-zinc-500",
                            hasError && "text-rose-400",
                        )}
                    >
                        {prepend}
                    </div>
                )}

                {/* Input */}
                <input
                    id={field.name}
                    name={field.name}
                    type={type}
                    value={field.state.value}
                    placeholder={placeholder}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={disabled}
                    aria-invalid={hasError}
                    aria-describedby={
                        hasError ? `${field.name}-error` : undefined
                    }
                    className={cn(
                        "w-full bg-transparent px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400",
                        "outline-none border-none ring-0",
                        "disabled:cursor-not-allowed",
                        prepend && "pl-2",
                        append && "pr-2",
                    )}
                />

                {/* Append */}
                {append && (
                    <div
                        className={cn(
                            "flex items-center justify-center pr-3 shrink-0 text-zinc-400 transition-colors duration-200",
                            "group-focus-within/field:text-zinc-500",
                            hasError && "text-rose-400",
                        )}
                    >
                        {append}
                    </div>
                )}

                {/* Error icon (auto appended on error, only if no custom append) */}
                {hasError && !append && (
                    <div className="flex items-center justify-center pr-3 shrink-0">
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                    </div>
                )}
            </div>

            {/* Error message */}
            {hasError && (
                <p
                    id={`${field.name}-error`}
                    role="alert"
                    className="flex items-center gap-1.5 text-xs text-rose-500 animate-in fade-in slide-in-from-top-1 duration-200"
                >
                    {firstError}
                </p>
            )}
        </div>
    );
};

export default AppField;
