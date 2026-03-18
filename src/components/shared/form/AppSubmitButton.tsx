import { cn } from "@/lib/utils";
import React from "react";

type AppSubmitButtonProps = {
    isPending: boolean;
    children: React.ReactNode;
    pendingLabel?: string;
    className?: string;
    disabled?: boolean;
};

const AppSubmitButton = ({
    isPending,
    children,
    pendingLabel = "Submitting...",
    className,
    disabled = false,
}: AppSubmitButtonProps) => {
    const isDisabled = disabled || isPending;

    return (
        <button
            type="submit"
            disabled={isDisabled}
            className={cn(
                // base
                "relative w-full flex items-center justify-center gap-2.5",
                "px-5 py-2.5 rounded-lg text-sm font-medium",
                "transition-all duration-200 overflow-hidden cursor-pointer",
                // default state
                !isDisabled &&
                    "bg-primary text-white shadow-sm hover:shadow-md hover:shadow-rose-200 active:scale-[0.98]",
                // disabled/pending state
                isDisabled &&
                    "bg-rose-100 text-red-500 cursor-not-allowed shadow-none",
                className,
            )}
        >
            {/* Shimmer overlay while pending */}
            {isPending && (
                <span
                    className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
                    style={{
                        background:
                            "linear-gradient(90deg, transparent 0%, rgba(244,63,94,0.08) 50%, transparent 100%)",
                    }}
                />
            )}

            {isPending ? (
                <>
                    {/* Three dot loader */}
                    <span
                        className="flex items-center gap-1"
                        aria-hidden="true"
                    >
                        {[0, 1, 2].map((i) => (
                            <span
                                key={i}
                                className="w-1.5 h-1.5 rounded-full bg-rose-400 block"
                                style={{
                                    animation:
                                        "bounce-dot 0.9s ease-in-out infinite",
                                    animationDelay: `${i * 0.18}s`,
                                }}
                            />
                        ))}
                    </span>
                    <span className="relative z-10">{pendingLabel}</span>
                </>
            ) : (
                <span className="relative z-10 flex items-center gap-2">
                    {children}
                </span>
            )}

            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(200%); }
                }
                @keyframes bounce-dot {
                    0%, 100% { transform: translateY(0); opacity: 0.4; }
                    50% { transform: translateY(-4px); opacity: 1; }
                }
            `}</style>
        </button>
    );
};

export default AppSubmitButton;
