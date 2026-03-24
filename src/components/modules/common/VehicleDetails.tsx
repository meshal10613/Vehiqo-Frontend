"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getVehicleById } from "../../../services/vehicle.services";
import { IVehicle } from "../../../types/vehicle.type";
import { IReview } from "../../../types/review.type";
import { getUserInfo } from "../../../services/auth.services";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    ChevronLeft,
    ChevronRight,
    X,
    CalendarDays,
    Users,
    Zap,
    Settings2,
    IdCard,
    Gauge,
    Palette,
    Hash,
    BadgeCheck,
    Star,
    LogIn,
    Clock,
    Shield,
    Fuel,
    ArrowRight,
    Car,
    CheckCircle2,
    Info,
    MapPin,
    UserCog,
    FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BookingModal } from "./BookingModal";
import { IBooking } from "../../../types/booking.type";
import Reviews from "../home/Reviews";

function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function fmt(n: number) {
    return new Intl.NumberFormat("en-BD").format(n);
}

function diffDays(a: Date, b: Date) {
    return Math.max(
        1,
        Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)),
    );
}

function toDateInputValue(d: Date) {
    return d.toISOString().split("T")[0];
}

function Gallery({ images, alt }: { images: string[]; alt: string }) {
    const [active, setActive] = useState(0);
    const [lightbox, setLightbox] = useState(false);
    const total = images.length;

    const prev = useCallback(
        (e?: React.MouseEvent) => {
            e?.stopPropagation();
            setActive((p) => (p - 1 + total) % total);
        },
        [total],
    );
    const next = useCallback(
        (e?: React.MouseEvent) => {
            e?.stopPropagation();
            setActive((p) => (p + 1) % total);
        },
        [total],
    );

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (!lightbox) return;
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
            if (e.key === "Escape") setLightbox(false);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [lightbox, prev, next]);

    if (!images.length) {
        return (
            <div className="aspect-vedio rounded-3xl bg-zinc-100 flex items-center justify-center">
                <Car className="w-20 h-20 text-zinc-300" />
            </div>
        );
    }

    return (
        <>
            {/* Main image */}
            <div
                className="relative aspect-vedio rounded-3xl overflow-hidden bg-zinc-900 cursor-zoom-in group shadow-xl"
                onClick={() => setLightbox(true)}
            >
                <motion.img
                    key={active}
                    src={images[active]}
                    alt={`${alt} — ${active + 1}`}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35 }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />

                {total > 1 && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm cursor-pointer"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm cursor-pointer"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                {/* Counter */}
                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {active + 1} / {total}
                </div>

                {/* Zoom hint */}
                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to zoom
                </div>
            </div>

            {/* Thumbnails */}
            {total > 1 && (
                <div className="flex gap-3 mt-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-zinc-200">
                    {images.map((src, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            className={cn(
                                "shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer",
                                i === active
                                    ? "border-[#FF5100] shadow-md shadow-[#FF5100]/20"
                                    : "border-transparent opacity-60 hover:opacity-90",
                            )}
                        >
                            <img
                                src={src}
                                alt={`thumb ${i + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                        onClick={() => setLightbox(false)}
                    >
                        <button
                            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 cursor-pointer"
                            onClick={() => setLightbox(false)}
                        >
                            <X className="w-7 h-7" />
                        </button>
                        <button
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 cursor-pointer"
                            onClick={prev}
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>
                        <motion.img
                            key={active}
                            src={images[active]}
                            alt={alt}
                            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.25 }}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 cursor-pointer"
                            onClick={next}
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>
                        <div className="absolute bottom-6 text-white/60 text-sm">
                            {active + 1} / {total}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function AuthModal({
    open,
    onClose,
    vehicleId,
}: {
    open: boolean;
    onClose: () => void;
    vehicleId: string;
}) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.97 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 28,
                        }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-[#FF5100]/10 flex items-center justify-center">
                                <LogIn className="w-8 h-8 text-[#FF5100]" />
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-zinc-900 text-center mb-2">
                            Sign in to continue
                        </h2>
                        <p className="text-zinc-500 text-sm text-center mb-8 leading-relaxed">
                            You need to be logged in to book a vehicle. Create
                            an account or sign in to get started.
                        </p>

                        <div className="flex flex-col gap-3">
                            <Link
                                href={`/sign-in?redirect=/vehicles/${vehicleId}`}
                                className="w-full flex items-center justify-center gap-2 bg-[#FF5100] hover:bg-[#e04800] text-white font-semibold py-3 rounded-xl transition-colors"
                            >
                                <LogIn className="w-4 h-4" />
                                Sign In
                            </Link>
                            <button
                                onClick={onClose}
                                className="w-full py-3 rounded-xl border border-zinc-200 text-zinc-700 font-medium hover:bg-zinc-50 transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function LicenseModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.97 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 28,
                        }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center">
                                    <FileText className="w-8 h-8 text-amber-500" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF5100] rounded-full flex items-center justify-center">
                                    <span className="text-white text-[10px] font-black">
                                        !
                                    </span>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-zinc-900 text-center mb-2">
                            License Number Required
                        </h2>
                        <p className="text-zinc-500 text-sm text-center mb-4 leading-relaxed">
                            This vehicle requires a valid driving license.
                            Please add your license number to your profile
                            before booking.
                        </p>

                        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-7">
                            <IdCard className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-700 font-medium leading-relaxed">
                                Go to <strong>My Profile → Edit Profile</strong>{" "}
                                and add your driving license number to continue.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Link
                                href="/my-profile"
                                className="w-full flex items-center justify-center gap-2 bg-[#FF5100] hover:bg-[#e04800] text-white font-semibold py-3 rounded-xl transition-colors"
                            >
                                <UserCog className="w-4 h-4" />
                                Go to My Profile
                            </Link>
                            <button
                                onClick={onClose}
                                className="w-full py-3 rounded-xl border border-zinc-200 text-zinc-700 font-medium hover:bg-zinc-50 transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// function BookingModal({
//     open,
//     onClose,
//     vehicle,
// }: {
//     open: boolean;
//     onClose: () => void;
//     vehicle: IVehicle;
// }) {
//     const today = toDateInputValue(new Date());
//     const tomorrow = toDateInputValue(new Date(Date.now() + 86400000));

//     const [startDate, setStartDate] = useState(today);
//     const [endDate, setEndDate] = useState(tomorrow);

//     const days =
//         startDate && endDate
//             ? diffDays(new Date(startDate), new Date(endDate))
//             : 1;
//     const baseCost = days * vehicle.pricePerDay;
//     const advance = Math.ceil(baseCost * 0.3);

//     return (
//         <AnimatePresence>
//             {open && (
//                 <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
//                     onClick={onClose}
//                 >
//                     <motion.div
//                         initial={{ opacity: 0, y: 24, scale: 0.97 }}
//                         animate={{ opacity: 1, y: 0, scale: 1 }}
//                         exit={{ opacity: 0, y: 12, scale: 0.97 }}
//                         transition={{
//                             type: "spring",
//                             stiffness: 300,
//                             damping: 28,
//                         }}
//                         className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         {/* Header band */}
//                         <div className="bg-[#FF5100] px-6 py-5">
//                             <button
//                                 onClick={onClose}
//                                 className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors cursor-pointer"
//                             >
//                                 <X className="w-5 h-5" />
//                             </button>
//                             <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-1">
//                                 Book This Vehicle
//                             </p>
//                             <h2 className="text-white text-xl font-bold">
//                                 {vehicle.brand} {vehicle.model}{" "}
//                                 <span className="font-normal opacity-80">
//                                     {vehicle.year}
//                                 </span>
//                             </h2>
//                         </div>

//                         <div className="p-6 space-y-5">
//                             {/* Date pickers */}
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
//                                         Pick-up Date
//                                     </label>
//                                     <input
//                                         type="date"
//                                         min={today}
//                                         value={startDate}
//                                         onChange={(e) => {
//                                             setStartDate(e.target.value);
//                                             if (e.target.value >= endDate)
//                                                 setEndDate(
//                                                     toDateInputValue(
//                                                         new Date(
//                                                             new Date(
//                                                                 e.target.value,
//                                                             ).getTime() +
//                                                                 86400000,
//                                                         ),
//                                                     ),
//                                                 );
//                                         }}
//                                         className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#FF5100]/30 focus:border-[#FF5100] transition-all"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
//                                         Return Date
//                                     </label>
//                                     <input
//                                         type="date"
//                                         min={
//                                             startDate
//                                                 ? toDateInputValue(
//                                                       new Date(
//                                                           new Date(
//                                                               startDate,
//                                                           ).getTime() +
//                                                               86400000,
//                                                       ),
//                                                   )
//                                                 : tomorrow
//                                         }
//                                         value={endDate}
//                                         onChange={(e) =>
//                                             setEndDate(e.target.value)
//                                         }
//                                         className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#FF5100]/30 focus:border-[#FF5100] transition-all"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Cost breakdown */}
//                             <div className="bg-zinc-50 rounded-2xl p-4 space-y-3 border border-zinc-100">
//                                 <div className="flex justify-between text-sm">
//                                     <span className="text-zinc-500">
//                                         ৳{fmt(vehicle.pricePerDay)} × {days} day
//                                         {days > 1 ? "s" : ""}
//                                     </span>
//                                     <span className="font-semibold text-zinc-800">
//                                         ৳{fmt(baseCost)}
//                                     </span>
//                                 </div>
//                                 <div className="flex justify-between text-sm">
//                                     <span className="text-zinc-500 flex items-center gap-1">
//                                         <Info className="w-3.5 h-3.5" />
//                                         Advance (30%)
//                                     </span>
//                                     <span className="font-semibold text-[#FF5100]">
//                                         ৳{fmt(advance)}
//                                     </span>
//                                 </div>
//                                 <div className="border-t border-zinc-200 pt-3 flex justify-between">
//                                     <span className="font-bold text-zinc-900">
//                                         Total Estimate
//                                     </span>
//                                     <span className="font-bold text-zinc-900 text-lg">
//                                         ৳{fmt(baseCost)}
//                                     </span>
//                                 </div>
//                             </div>

//                             {/* Note */}
//                             <p className="text-xs text-zinc-400 flex items-start gap-1.5">
//                                 <Shield className="w-3.5 h-3.5 mt-0.5 shrink-0 text-zinc-400" />
//                                 Final cost may vary based on fuel usage, late
//                                 return, or damage charges.
//                             </p>

//                             {/* CTA */}
//                             <button className="w-full bg-[#FF5100] hover:bg-[#e04800] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-[#FF5100]/20 cursor-pointer">
//                                 Confirm Booking
//                                 <ArrowRight className="w-5 h-5" />
//                             </button>
//                         </div>
//                     </motion.div>
//                 </motion.div>
//             )}
//         </AnimatePresence>
//     );
// }

function SpecItem({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-[#FF5100]/20 hover:bg-[#FF5100]/5 transition-all group">
            <div className="w-9 h-9 rounded-xl bg-white border border-zinc-200 group-hover:border-[#FF5100]/30 flex items-center justify-center shadow-sm shrink-0 transition-colors">
                <Icon className="w-4 h-4 text-zinc-500 group-hover:text-[#FF5100] transition-colors" />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                    {label}
                </p>
                <p className="text-sm font-semibold text-zinc-800 truncate">
                    {value}
                </p>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { bg: string; text: string; dot: string }> = {
        AVAILABLE: {
            bg: "bg-emerald-50",
            text: "text-emerald-700",
            dot: "bg-emerald-500",
        },
        RENTED: {
            bg: "bg-blue-50",
            text: "text-blue-700",
            dot: "bg-blue-500",
        },
        MAINTENANCE: {
            bg: "bg-amber-50",
            text: "text-amber-700",
            dot: "bg-amber-500",
        },
        BOOKED: {
            bg: "bg-violet-50",
            text: "text-violet-700",
            dot: "bg-violet-500",
        },
        RETIRED: {
            bg: "bg-zinc-100",
            text: "text-zinc-500",
            dot: "bg-zinc-400",
        },
    };
    const s = map[status] ?? map["RETIRED"];
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold",
                s.bg,
                s.text,
            )}
        >
            <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />
            {capitalize(status)}
        </span>
    );
}

function Skeleton() {
    return (
        <div className="animate-pulse space-y-6 max-w-6xl mx-auto px-4 py-8">
            <div className="h-8 w-48 bg-zinc-200 rounded-lg" />
            <div className="aspect-vedio bg-zinc-200 rounded-3xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <div className="h-10 w-2/3 bg-zinc-200 rounded-xl" />
                    <div className="h-5 w-1/3 bg-zinc-200 rounded-lg" />
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="h-16 bg-zinc-200 rounded-2xl"
                            />
                        ))}
                    </div>
                </div>
                <div className="h-64 bg-zinc-200 rounded-3xl" />
            </div>
        </div>
    );
}

export default function VehicleDetails({ id }: { id: string }) {
    const [bookingModal, setBookingModal] = useState(false);
    const [authModal, setAuthModal] = useState(false);
    const [licenseModal, setLicenseModal] = useState(false);

    const { data: vehicleData, isLoading: isVehicleLoading } = useQuery({
        queryKey: ["vehicle-details", id],
        queryFn: () => getVehicleById(id),
    });

    const { data: userData, isLoading: isUserLoading } = useQuery({
        queryKey: ["user"],
        queryFn: () => getUserInfo(),
    });

    const vehicle: IVehicle | undefined = vehicleData?.data;
    // user can be null (unauthenticated) or the user object
    const user = userData ?? null;

    const handleBookNow = () => {
        if (!user) {
            setAuthModal(true);
        } else if (
            vehicle?.vehicleType?.requiresLicense &&
            !user.licenseNumber
        ) {
            setLicenseModal(true);
        } else {
            setBookingModal(true);
        }
    };

    if (isVehicleLoading || isUserLoading) return <Skeleton />;

    if (!vehicle) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <Car className="w-16 h-16 text-zinc-300 mb-4" />
                <h2 className="text-2xl font-bold text-zinc-800 mb-2">
                    Vehicle Not Found
                </h2>
                <p className="text-zinc-500 mb-6">
                    This vehicle may have been removed or doesn't exist.
                </p>
                <Link
                    href="/vehicles"
                    className="bg-[#FF5100] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#e04800] transition-colors"
                >
                    Browse Vehicles
                </Link>
            </div>
        );
    }

    const isAvailable = vehicle.status === "AVAILABLE";

    const bookingsWithReview: IBooking[] = vehicle?.bookings?.filter(
        (b: IBooking) => b?.review?.rating != null,
    );

    const reviews: IReview[] =
        bookingsWithReview.map((b: IBooking) => b.review!) ?? [];

    const totalReviews = bookingsWithReview?.length ?? 0;

    const avgRating =
        totalReviews > 0
            ? (
                  bookingsWithReview.reduce(
                      (acc, b) => acc + b.review!.rating,
                      0,
                  ) / totalReviews
              ).toFixed(1)
            : null;

    return (
        <>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Breadcrumb */}
                <motion.nav
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-zinc-500"
                >
                    <Link
                        href="/vehicles"
                        className="hover:text-[#FF5100] transition-colors font-medium"
                    >
                        Vehicles
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-zinc-800 font-semibold truncate">
                        {vehicle.brand} {vehicle.model}
                    </span>
                </motion.nav>

                {/* Content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 space-y-8"
                    >
                        <Gallery
                            images={vehicle.image ?? []}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                        />

                        {/* Title row */}
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <StatusBadge status={vehicle.status} />
                                {avgRating && (
                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                        {avgRating}({totalReviews} reviews)
                                    </span>
                                )}
                                {vehicle.vehicleType && (
                                    <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full">
                                        {vehicle.vehicleType.name}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
                                {vehicle.brand} {vehicle.model}
                            </h1>
                            <p className="text-zinc-400 text-base mt-1 font-medium">
                                {vehicle.year} · {capitalize(vehicle.fuelType)}{" "}
                                · {capitalize(vehicle.transmission)}
                            </p>
                        </div>

                        {/* Description */}
                        {vehicle.description && (
                            <div>
                                <h2 className="text-base font-bold text-zinc-800 mb-2">
                                    About This Vehicle
                                </h2>
                                <p className="text-zinc-600 leading-relaxed text-sm">
                                    {vehicle.description}
                                </p>
                            </div>
                        )}

                        {/* Specs grid */}
                        <div>
                            <h2 className="text-base font-bold text-zinc-800 mb-4">
                                Specifications
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <SpecItem
                                    icon={Users}
                                    label="Seats"
                                    value={
                                        vehicle.seats
                                            ? `${vehicle.seats} seats`
                                            : "—"
                                    }
                                />
                                <SpecItem
                                    icon={Settings2}
                                    label="Transmission"
                                    value={capitalize(vehicle.transmission)}
                                />
                                <SpecItem
                                    icon={Zap}
                                    label="Fuel Type"
                                    value={capitalize(vehicle.fuelType)}
                                />
                                <SpecItem
                                    icon={Palette}
                                    label="Color"
                                    value={vehicle.color ?? "—"}
                                />
                                <SpecItem
                                    icon={Hash}
                                    label="Plate No."
                                    value={vehicle.plateNo}
                                />
                                <SpecItem
                                    icon={IdCard}
                                    label="License"
                                    value={
                                        vehicle.vehicleType?.requiresLicense
                                            ? "Required"
                                            : "Not required"
                                    }
                                />
                                {vehicle.mileage && (
                                    <SpecItem
                                        icon={Gauge}
                                        label="Mileage"
                                        value={`${fmt(vehicle.mileage)} km`}
                                    />
                                )}
                                {vehicle.engineCC && (
                                    <SpecItem
                                        icon={Car}
                                        label="Engine"
                                        value={`${vehicle.engineCC} cc`}
                                    />
                                )}
                                {vehicle.range && (
                                    <SpecItem
                                        icon={MapPin}
                                        label="Range"
                                        value={`${fmt(vehicle.range)} km`}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Features */}
                        {vehicle.features?.length > 0 && (
                            <div>
                                <h2 className="text-base font-bold text-zinc-800 mb-4">
                                    Features & Extras
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {vehicle.features.map((f, i) => (
                                        <span
                                            key={i}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-700 font-medium"
                                        >
                                            <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5100]" />
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Fuel price info */}
                        {vehicle.fuel && (
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100">
                                <Fuel className="w-5 h-5 text-amber-600 shrink-0" />
                                <p className="text-sm text-amber-800">
                                    Current{" "}
                                    <strong>{vehicle.fuel.fuelType}</strong>{" "}
                                    price:{" "}
                                    <strong>
                                        ৳{vehicle.fuel.pricePerUnit}
                                    </strong>{" "}
                                    / {vehicle.fuel.unit}. Fuel charges apply
                                    based on usage.
                                </p>
                            </div>
                        )}
                    </motion.div>

                    {/* Right: Booking card */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="lg:sticky lg:top-20 self-start"
                    >
                        <div className="rounded-3xl border border-zinc-200 bg-white shadow-lg overflow-hidden">
                            {/* Price header */}
                            <div className="px-6 pt-6 pb-5 border-b border-zinc-100">
                                <p className="text-xs uppercase tracking-widest font-bold text-zinc-400 mb-1">
                                    Starting from
                                </p>
                                <div className="flex items-end gap-2">
                                    <span className="text-4xl font-extrabold text-zinc-900">
                                        ৳{fmt(vehicle.pricePerDay)}
                                    </span>
                                    <span className="text-zinc-500 text-sm mb-1 font-medium">
                                        / day
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Quick info */}
                                <div className="space-y-2.5">
                                    {[
                                        {
                                            icon: Clock,
                                            text: "Advance payment: minimum 200",
                                        },
                                        {
                                            icon: Shield,
                                            text: "Damage charge may apply on return",
                                        },
                                        {
                                            icon: BadgeCheck,
                                            text: vehicle.vehicleType
                                                ?.requiresLicense
                                                ? "Valid driving license required"
                                                : "No license required",
                                        },
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex items-start gap-2.5 text-sm text-zinc-600"
                                        >
                                            <item.icon className="w-4 h-4 text-[#FF5100] mt-0.5 shrink-0" />
                                            {item.text}
                                        </div>
                                    ))}
                                </div>

                                {/* Book button */}
                                <button
                                    onClick={handleBookNow}
                                    disabled={!isAvailable}
                                    className={cn(
                                        "w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer",
                                        isAvailable
                                            ? "bg-[#FF5100] hover:bg-[#e04800] text-white shadow-lg shadow-[#FF5100]/25 hover:shadow-[#FF5100]/40"
                                            : "bg-zinc-100 text-zinc-400 cursor-not-allowed",
                                    )}
                                >
                                    <CalendarDays className="w-5 h-5" />
                                    {isAvailable
                                        ? "Book Now"
                                        : `Unavailable · ${capitalize(vehicle.status)}`}
                                </button>

                                {!isAvailable && (
                                    <p className="text-xs text-zinc-400 text-center">
                                        This vehicle is currently not available
                                        for booking.
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <Reviews reviews={reviews} />

            {/* Modals */}
            <AuthModal
                open={authModal}
                onClose={() => setAuthModal(false)}
                vehicleId={id}
            />
            <BookingModal
                open={bookingModal}
                onClose={() => setBookingModal(false)}
                vehicle={vehicle}
            />
            <LicenseModal
                open={licenseModal}
                onClose={() => setLicenseModal(false)}
            />
        </>
    );
}
