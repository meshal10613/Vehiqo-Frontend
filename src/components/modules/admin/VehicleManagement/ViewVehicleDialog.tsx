"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../../../ui/dialog";
import { Badge } from "@/components/ui/badge";
import { IVehicle } from "../../../../types/vehicle.type";
import Image from "next/image";
import {
    Calendar,
    CalendarCheck,
    Camera,
    Car,
    Droplets,
    Fuel,
    Gauge,
    Hash,
    Layers,
    Palette,
    Settings2,
    Star,
    Tag,
    Users,
    Zap,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// ── helpers ───────────────────────────────────────────────────────────────────

const formatDate = (date: string | Date) =>
    new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "BDT",
        minimumFractionDigits: 0,
    }).format(amount);

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

const ImageCarousel = ({ images, alt }: { images: string[]; alt: string }) => {
    const [active, setActive] = useState(0);

    if (images.length === 0) {
        return (
            <div className="h-48 w-full rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex items-center justify-center">
                <Camera className="h-8 w-8 text-zinc-300" />
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {/* Main image */}
            <div className="relative h-48 w-full rounded-xl border border-orange-100 overflow-hidden shadow-md bg-zinc-100">
                <Image
                    src={images[active]}
                    alt={`${alt} - image ${active + 1}`}
                    fill
                    className="object-cover transition-all duration-300"
                />
                {images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        {active + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((src, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setActive(i)}
                            className={cn(
                                "relative h-12 w-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer",
                                i === active
                                    ? "border-[#FF5100] shadow-sm"
                                    : "border-zinc-200 opacity-60 hover:opacity-100 hover:border-zinc-300",
                            )}
                        >
                            <Image
                                src={src}
                                alt={`thumb-${i}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

interface ViewVehicleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    vehicle: IVehicle | null;
}

export default function ViewVehicleDialog({
    open,
    onOpenChange,
    vehicle,
}: ViewVehicleDialogProps) {
    if (!vehicle) return null;

    const bookingCount = vehicle.bookings?.length ?? 0;
    const reviewCount =
        vehicle.bookings?.reduce(
            (acc, booking) => acc + (booking?.review?.rating != null ? 1 : 0),
            0,
        ) ?? 0;

    const statusColors: Record<string, string> = {
        AVAILABLE: "border-green-200 text-green-600 bg-green-50",
        BOOKED: "border-blue-200 text-blue-600 bg-blue-50",
        RENTED: "border-purple-200 text-purple-600 bg-purple-50",
        MAINTENANCE: "border-yellow-200 text-yellow-600 bg-yellow-50",
        RETIRED: "border-zinc-200 text-zinc-500 bg-zinc-50",
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100vw-1.5rem)] max-w-md gap-0 overflow-hidden p-0">
                {/* Top accent bar */}
                <div className="h-1 w-full bg-linear-to-r from-orange-400 via-[#FF5100] to-orange-400" />

                <DialogHeader className="border-b px-6 py-5">
                    <DialogTitle className="text-base font-bold text-zinc-900">
                        Vehicle Details
                    </DialogTitle>
                    <DialogDescription className="text-sm text-zinc-400">
                        Detailed information about this vehicle.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-5 space-y-4 max-h-[calc(90vh-9rem)] overflow-y-auto">
                    {/* Image carousel */}
                    <ImageCarousel
                        images={vehicle.image ?? []}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                    />

                    {/* Name + badges */}
                    <div className="space-y-2">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-bold text-zinc-900 leading-tight">
                                    {vehicle.brand} {vehicle.model}
                                </h2>
                                <p className="text-sm text-zinc-400 mt-0.5">
                                    {vehicle.year} · {vehicle.plateNo}
                                </p>
                            </div>
                            <Badge
                                variant="outline"
                                className={cn(
                                    "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 shrink-0",
                                    statusColors[vehicle.status] ??
                                        "border-zinc-200 text-zinc-500 bg-zinc-50",
                                )}
                            >
                                {vehicle.status.replace(/_/g, " ")}
                            </Badge>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-xl font-bold text-[#FF5100]">
                                {formatCurrency(vehicle.pricePerDay)}
                            </span>
                            <span className="text-sm text-zinc-400">/ day</span>
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="flex gap-2">
                        {[
                            {
                                label: "Bookings",
                                value: bookingCount,
                                icon: CalendarCheck,
                            },
                            {
                                label: "Reviews",
                                value: reviewCount,
                                icon: Star,
                            },
                            {
                                label: "Seats",
                                value: vehicle.seats ?? "—",
                                icon: Users,
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

                    {/* Core info rows */}
                    <div className="divide-y divide-zinc-50 -mx-2">
                        <InfoRow
                            icon={Tag}
                            label="Brand & Model"
                            value={`${vehicle.brand} ${vehicle.model}`}
                        />
                        <InfoRow
                            icon={Calendar}
                            label="Year"
                            value={vehicle.year}
                        />
                        <InfoRow
                            icon={Hash}
                            label="Plate Number"
                            value={vehicle.plateNo}
                        />
                        <InfoRow
                            icon={Palette}
                            label="Color"
                            value={vehicle.color}
                        />
                        <InfoRow
                            icon={Settings2}
                            label="Transmission"
                            value={vehicle.transmission?.replace(/_/g, " ")}
                        />
                        <InfoRow
                            icon={Fuel}
                            label="Fuel Type"
                            value={
                                <div className="flex items-center gap-2">
                                    <span>{vehicle.fuelType}</span>
                                    {vehicle.fuel && (
                                        <span className="text-xs text-zinc-400">
                                            ·
                                            {formatCurrency(
                                                vehicle.fuel.pricePerUnit,
                                            )}{" "}
                                            /{" "}
                                            {vehicle.fuel.unit
                                                .replace(/_/g, " ")
                                                .toLowerCase()}
                                        </span>
                                    )}
                                </div>
                            }
                        />
                        {vehicle.engineCC && (
                            <InfoRow
                                icon={Zap}
                                label="Engine CC"
                                value={`${vehicle.engineCC} cc`}
                            />
                        )}
                        {vehicle.mileage && (
                            <InfoRow
                                icon={Gauge}
                                label="Mileage"
                                value={`${vehicle.mileage} km/l`}
                            />
                        )}
                        {vehicle.range && (
                            <InfoRow
                                icon={Gauge}
                                label="Range"
                                value={`${vehicle.range} km`}
                            />
                        )}
                        <InfoRow
                            icon={Layers}
                            label="Vehicle Type"
                            value={
                                vehicle.vehicleType ? (
                                    <div className="flex items-center gap-2">
                                        <span>{vehicle.vehicleType.name}</span>
                                        {vehicle.vehicleType.category && (
                                            <span className="text-xs text-zinc-400">
                                                ·{" "}
                                                {
                                                    vehicle.vehicleType.category
                                                        .name
                                                }
                                            </span>
                                        )}
                                    </div>
                                ) : null
                            }
                        />
                    </div>

                    {/* Description */}
                    {vehicle.description && (
                        <>
                            <div className="h-px bg-zinc-100" />
                            <div className="px-2 space-y-1.5">
                                <p className="text-[11px] text-zinc-400 font-semibold uppercase tracking-widest">
                                    Description
                                </p>
                                <p className="text-sm text-zinc-600 leading-relaxed">
                                    {vehicle.description}
                                </p>
                            </div>
                        </>
                    )}

                    {/* Features */}
                    {vehicle.features && vehicle.features.length > 0 && (
                        <>
                            <div className="h-px bg-zinc-100" />
                            <div className="px-2 space-y-2">
                                <p className="text-[11px] text-zinc-400 font-semibold uppercase tracking-widest">
                                    Features
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {vehicle.features.map((feature) => (
                                        <Badge
                                            key={feature}
                                            variant="outline"
                                            className="border-orange-100 text-zinc-600 bg-orange-50/50 text-[10px] font-medium px-2 py-0.5"
                                        >
                                            {feature}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Dates */}
                    <div className="h-px bg-zinc-100" />
                    <div className="divide-y divide-zinc-50 -mx-2">
                        {vehicle.createdAt && (
                            <InfoRow
                                icon={Calendar}
                                label="Created At"
                                value={formatDate(vehicle.createdAt)}
                            />
                        )}
                        {vehicle.updatedAt && (
                            <InfoRow
                                icon={Calendar}
                                label="Last Updated"
                                value={formatDate(vehicle.updatedAt)}
                            />
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
