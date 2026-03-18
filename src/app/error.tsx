"use client";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "../components/ui/button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="relative min-h-screen bg-zinc-50 flex items-center justify-center overflow-hidden px-6">
            {/* Background glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-150 h-150 rounded-full bg-rose-400/15 blur-3xl" />
            </div>

            {/* Dot grid */}
            <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, #f43f5e33 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            />

            {/* Card */}
            <div className="relative z-10 w-full max-w-2xl border border-zinc-200 bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-xl shadow-zinc-200/60">
                {/* Top badge */}
                <Badge
                    variant="outline"
                    className="border-rose-400/50 text-primary bg-rose-50 text-xs tracking-widest uppercase mb-8"
                >
                    <AlertTriangle className="w-3 h-3 mr-1.5" />
                    System Error
                </Badge>

                {/* Code + divider + content */}
                <div className="flex items-start gap-8">
                    {/* 500 */}
                    <div className="hidden sm:flex flex-col items-center gap-4 shrink-0">
                        <span className="text-[88px] font-black leading-none text-primary drop-shadow-[0_0_32px_rgba(244,63,94,0.25)] tracking-tighter select-none">
                            500
                        </span>
                    </div>

                    <Separator
                        orientation="vertical"
                        className="hidden sm:block h-28 bg-zinc-200 self-center"
                    />

                    {/* Text content */}
                    <div className="flex flex-col gap-4 flex-1">
                        <div>
                            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight leading-snug">
                                Something went wrong
                            </h1>
                            <p className="text-zinc-500 text-sm mt-2 leading-relaxed">
                                {error?.message ||
                                    "An unexpected error occurred. Please try again or return to the homepage."}
                            </p>
                        </div>

                        {error?.digest && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-zinc-400">
                                    Error ID:
                                </span>
                                <code className="text-xs bg-zinc-100 text-primary px-2 py-0.5 rounded-md border border-zinc-200 font-mono">
                                    {error.digest}
                                </code>
                            </div>
                        )}

                        <Separator className="bg-zinc-200" />

                        {/* Actions */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <Button
                                onClick={reset}
                                className="bg-primary hover:bg-rose-500 text-white gap-2 shadow-lg shadow-rose-200 transition-all duration-200 cursor-pointer"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Try Again
                            </Button>
                            <Button className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 gap-2 transition-all duration-200 cursor-pointer">
                                <Link
                                    href="/"
                                    className="flex items-center gap-2"
                                >
                                    <Home className="w-4 h-4" />
                                    Go Home
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
