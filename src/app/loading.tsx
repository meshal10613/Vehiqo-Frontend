// import LoadingSpinner from "../components/home/LoadingSpinner";

export default function LoadingPage() {
    return (
        <div className="relative min-h-screen bg-white flex flex-col items-center justify-center overflow-hidden gap-8">
            {/* Background glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-96 h-96 rounded-full bg-rose-400/10 blur-3xl" />
            </div>

            {/* Dot grid */}
            <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, #f43f5e28 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                }}
            />

            {/* Spinner */}
            <div className="relative z-10 flex items-center justify-center w-24 h-24">
                {/* Outer ring */}
                <div
                    className="absolute w-24 h-24 rounded-full border-2 border-transparent"
                    style={{
                        borderTopColor: "#FF5100",
                        borderRightColor: "#fda4af",
                        animation: "spin 1s linear infinite",
                    }}
                />
                {/* Inner ring */}
                <div
                    className="absolute w-16 h-16 rounded-full border-2 border-transparent"
                    style={{
                        borderTopColor: "#FF5100",
                        borderLeftColor: "#fecdd3",
                        animation: "spin 1.5s linear infinite reverse",
                    }}
                />
                {/* Center dot */}
                <div
                    className="w-3 h-3 rounded-full bg-primary"
                    style={{ animation: "pulse-dot 1.2s ease-in-out infinite" }}
                />
            </div>

            {/* Text */}
            <div className="relative z-10 flex flex-col items-center gap-2">
                <p
                    className="text-zinc-800 font-semibold text-lg tracking-tight"
                    style={{ animation: "breathe 2s ease-in-out infinite" }}
                >
                    Loading
                </p>
                <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-primary block"
                            style={{
                                animation: `bounce-dot 0.8s ease-in-out infinite`,
                                animationDelay: `${i * 0.15}s`,
                            }}
                        />
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse-dot {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.4); opacity: 0.5; }
                }
                @keyframes breathe {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 1; }
                }
                @keyframes bounce-dot {
                    0%, 100% { transform: translateY(0); opacity: 0.3; }
                    50% { transform: translateY(-6px); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
