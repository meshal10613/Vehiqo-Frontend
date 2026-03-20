"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../../../ui/dialog";
import { Badge } from "@/components/ui/badge";
import { IVehicleType } from "../../../../types/vehicleType.type";
import Image from "next/image";
import {
    Calendar,
    Camera,
    Car,
    ChevronLeft,
    ChevronRight,
    Cpu,
    IdCard,
    Layers,
    Star,
    Tag,
    CalendarCheck,
} from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

// ── helpers ───────────────────────────────────────────────────────────────────

const formatDate = (date: string | Date) =>
    new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

// ── InfoRow ───────────────────────────────────────────────────────────────────

const InfoRow = ({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
}) => (
    <div className="group flex items-start gap-3 rounded-xl px-4 py-3.5 transition-colors duration-150 hover:bg-zinc-50">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-50 border border-orange-100 group-hover:bg-orange-100 transition-colors duration-150">
            <Icon className="h-3.5 w-3.5 text-[#FF5100]" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[11px] text-zinc-400 font-semibold uppercase tracking-widest">
                {label}
            </p>
            <div className="text-sm font-medium text-zinc-800 mt-0.5">
                {value ?? (
                    <span className="text-zinc-300 font-normal italic text-sm">
                        Not provided
                    </span>
                )}
            </div>
        </div>
    </div>
);

// ── VehicleCarousel ───────────────────────────────────────────────────────────

interface IVehicle {
    id: string;
    brand: string;
    model: string;
    year: number;
    plateNo: string;
    image?: string[];
    bookings?: unknown[];
    reviews?: unknown[];
}

const VehicleCarousel = ({ vehicles }: { vehicles: IVehicle[] }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const prev = () =>
        setActiveIndex((i) => (i - 1 + vehicles.length) % vehicles.length);
    const next = () => setActiveIndex((i) => (i + 1) % vehicles.length);

    const getRelativeIndex = (i: number) => {
        const diff = i - activeIndex;
        if (diff === 0) return 0;
        if (diff === 1 || diff === -(vehicles.length - 1)) return 1;
        if (diff === -1 || diff === vehicles.length - 1) return -1;
        return diff > 0 ? 2 : -2;
    };

    return (
        <div className="space-y-3">
            <p className="text-[11px] text-zinc-400 font-semibold uppercase tracking-widest px-4">
                Vehicles
            </p>

            <div className="relative flex items-center justify-center h-36 overflow-hidden">
                {/* Left button */}
                {vehicles.length > 1 && (
                    <button
                        type="button"
                        onClick={prev}
                        className="absolute left-2 z-20 h-7 w-7 rounded-full bg-white border border-zinc-200 shadow-sm flex items-center justify-center hover:bg-orange-50 hover:border-orange-200 transition-all cursor-pointer"
                    >
                        <ChevronLeft className="h-4 w-4 text-zinc-600" />
                    </button>
                )}

                {/* Cards */}
                <div className="relative w-full h-full flex items-center justify-center">
                    {vehicles.map((vehicle, i) => {
                        const rel = getRelativeIndex(i);
                        const isCenter = rel === 0;
                        const isHidden = Math.abs(rel) > 1;

                        return (
                            <div
                                key={vehicle.id}
                                onClick={() => !isCenter && setActiveIndex(i)}
                                className={cn(
                                    "absolute transition-all duration-300 ease-in-out rounded-xl border bg-white shadow-sm overflow-hidden",
                                    isCenter
                                        ? "z-10 w-48 h-28 cursor-default opacity-100 scale-100 shadow-md border-orange-200"
                                        : Math.abs(rel) === 1
                                          ? "z-0 w-40 h-24 cursor-pointer opacity-40 scale-95 border-zinc-100"
                                          : "opacity-0 pointer-events-none w-40 h-24 scale-90",
                                    rel === -1 && "-translate-x-36",
                                    rel === 1 && "translate-x-36",
                                    rel === -2 && "-translate-x-60",
                                    rel === 2 && "translate-x-60",
                                )}
                            >
                                {/* Card image strip */}
                                {vehicle.image?.[0] ? (
                                    <div className="h-12 w-full relative overflow-hidden bg-zinc-100">
                                        <Image
                                            src={vehicle.image[0]}
                                            alt={vehicle.model}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-12 w-full bg-linear-to-br from-orange-50 to-zinc-100 flex items-center justify-center">
                                        <Car className="h-5 w-5 text-zinc-300" />
                                    </div>
                                )}

                                {/* Card info */}
                                <div className="px-3 py-2 space-y-0.5">
                                    <p className="text-xs font-bold text-zinc-800 truncate leading-tight">
                                        {vehicle.brand} {vehicle.model}
                                    </p>
                                    <p className="text-[10px] text-zinc-400 leading-tight">
                                        {vehicle.year} · {vehicle.plateNo}
                                    </p>
                                    {isCenter && (
                                        <div className="flex gap-2 pt-0.5">
                                            <span className="text-[9px] text-zinc-400">
                                                <span className="font-semibold text-zinc-600">
                                                    {vehicle.bookings?.length ??
                                                        0}
                                                </span>{" "}
                                                bookings
                                            </span>
                                            <span className="text-[9px] text-zinc-400">
                                                <span className="font-semibold text-zinc-600">
                                                    {vehicle.reviews?.length ??
                                                        0}
                                                </span>{" "}
                                                reviews
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Right button */}
                {vehicles.length > 1 && (
                    <button
                        type="button"
                        onClick={next}
                        className="absolute right-2 z-20 h-7 w-7 rounded-full bg-white border border-zinc-200 shadow-sm flex items-center justify-center hover:bg-orange-50 hover:border-orange-200 transition-all cursor-pointer"
                    >
                        <ChevronRight className="h-4 w-4 text-zinc-600" />
                    </button>
                )}
            </div>

            {/* Dots */}
            {vehicles.length > 1 && (
                <div className="flex justify-center gap-1.5">
                    {vehicles.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setActiveIndex(i)}
                            className={cn(
                                "rounded-full transition-all duration-200 cursor-pointer",
                                i === activeIndex
                                    ? "w-4 h-1.5 bg-[#FF5100]"
                                    : "w-1.5 h-1.5 bg-zinc-200 hover:bg-zinc-300",
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// ── props ─────────────────────────────────────────────────────────────────────

interface ViewVehicleTypeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    vehicleType: IVehicleType | null;
}

// ── component ─────────────────────────────────────────────────────────────────

export default function ViewVehicleTypeDialog({
    open,
    onOpenChange,
    vehicleType,
}: ViewVehicleTypeDialogProps) {
    if (!vehicleType) return null;

    const vehicleCount = vehicleType.vehicles?.length ?? 0;
    const totalBookings =
        vehicleType.vehicles?.reduce(
            (acc, v) => acc + (v.bookings?.length ?? 0),
            0,
        ) ?? 0;
    const totalReviews =
        vehicleType.vehicles?.reduce(
            (acc, v) => acc + (v.reviews?.length ?? 0),
            0,
        ) ?? 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100vw-1.5rem)] max-w-md gap-0 overflow-hidden p-0">
                {/* Top accent bar */}
                <div className="h-1 w-full bg-linear-to-r from-orange-400 via-[#FF5100] to-orange-400" />

                <DialogHeader className="border-b px-6 py-5">
                    <DialogTitle className="text-base font-bold text-zinc-900">
                        Vehicle Type
                    </DialogTitle>
                    <DialogDescription className="text-sm text-zinc-400">
                        Detailed information about this vehicle type.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-5 space-y-4 max-h-[calc(90vh-9rem)] overflow-y-auto">
                    {/* Header — image + name + badges */}
                    <div className="flex items-center gap-4">
                        {vehicleType.image ? (
                            <div className="h-20 w-20 rounded-xl border-2 border-orange-100 overflow-hidden shadow-md shrink-0">
                                <Image
                                    src={vehicleType.image}
                                    alt={vehicleType.name}
                                    width={80}
                                    height={80}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        ) : (
                            <div className="h-20 w-20 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex items-center justify-center shrink-0">
                                <Camera className="h-6 w-6 text-zinc-300" />
                            </div>
                        )}

                        <div className="space-y-1.5 min-w-0">
                            <h2 className="text-lg font-bold text-zinc-900 truncate">
                                {vehicleType.name}
                            </h2>
                            <div className="flex flex-wrap gap-1.5">
                                <Badge
                                    variant="outline"
                                    className="border-orange-200 text-[#FF5100] bg-orange-50 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5"
                                >
                                    {vehicleCount}{" "}
                                    {vehicleCount === 1
                                        ? "vehicle"
                                        : "vehicles"}
                                </Badge>
                                {vehicleType.isElectric && (
                                    <Badge
                                        variant="outline"
                                        className="border-green-200 text-green-600 bg-green-50 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5"
                                    >
                                        Electric
                                    </Badge>
                                )}
                                {vehicleType.requiresLicense && (
                                    <Badge
                                        variant="outline"
                                        className="border-blue-200 text-blue-600 bg-blue-50 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5"
                                    >
                                        License Required
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="flex gap-2">
                        {[
                            {
                                label: "Vehicles",
                                value: vehicleCount,
                                icon: Car,
                            },
                            {
                                label: "Bookings",
                                value: totalBookings,
                                icon: CalendarCheck,
                            },
                            {
                                label: "Reviews",
                                value: totalReviews,
                                icon: Star,
                            },
                        ].map(({ label, value, icon: Icon }) => (
                            <div
                                key={label}
                                className="flex-1 flex flex-col items-center justify-center gap-1 rounded-xl border border-zinc-100 bg-zinc-50 py-3"
                            >
                                <Icon className="h-4 w-4 text-[#FF5100]" />
                                <p className="text-base font-bold text-zinc-800">
                                    {value}
                                </p>
                                <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="h-px bg-zinc-100" />

                    {/* Info rows */}
                    <div className="divide-y divide-zinc-50 -mx-2">
                        <InfoRow
                            icon={Tag}
                            label="Type Name"
                            value={vehicleType.name}
                        />
                        <InfoRow
                            icon={Layers}
                            label="Category"
                            value={vehicleType.category?.name}
                        />
                        <InfoRow
                            icon={Cpu}
                            label="Electric"
                            value={
                                <span
                                    className={cn(
                                        "font-semibold",
                                        vehicleType.isElectric
                                            ? "text-green-600"
                                            : "text-zinc-400",
                                    )}
                                >
                                    {vehicleType.isElectric ? "Yes" : "No"}
                                </span>
                            }
                        />
                        <InfoRow
                            icon={IdCard}
                            label="Requires License"
                            value={
                                <span
                                    className={cn(
                                        "font-semibold",
                                        vehicleType.requiresLicense
                                            ? "text-blue-600"
                                            : "text-zinc-400",
                                    )}
                                >
                                    {vehicleType.requiresLicense ? "Yes" : "No"}
                                </span>
                            }
                        />
                        {vehicleType.createdAt && (
                            <InfoRow
                                icon={Calendar}
                                label="Created At"
                                value={formatDate(vehicleType.createdAt)}
                            />
                        )}
                        {vehicleType.updatedAt && (
                            <InfoRow
                                icon={Calendar}
                                label="Last Updated"
                                value={formatDate(vehicleType.updatedAt)}
                            />
                        )}
                    </div>

                    {/* Vehicle carousel */}
                    {vehicleCount > 0 && (
                        <>
                            <div className="h-px bg-zinc-100" />
                            <VehicleCarousel vehicles={vehicleType.vehicles!} />
                        </>
                    )}

                    {vehicleCount === 0 && (
                        <div className="flex flex-col items-center justify-center py-6 gap-2 rounded-xl border border-dashed border-zinc-200 bg-zinc-50">
                            <Car className="h-8 w-8 text-zinc-200" />
                            <p className="text-sm text-zinc-400 italic">
                                No vehicles assigned yet
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
