"use client";

import { CarFront, IdCard, Settings2, Users, Zap } from "lucide-react";
import { IVehicle } from "../../../types/vehicle.type";
import { ImageSlider } from "./Vehicles";
import Link from "next/link";
import { VehicleStatus } from "../../../types/enum.type";
import { cn } from "../../../lib/utils";

const getStatusConfig = (status: VehicleStatus) => {
    switch (status) {
        case "AVAILABLE":
            return {
                label: "Rent Now",
                className: "bg-primary hover:bg-[#ff5a00] text-white",
                disabled: false,
            };
        case "BOOKED":
            return {
                label: "Booked",
                className: "bg-yellow-500 text-white cursor-not-allowed",
                disabled: true,
            };
        case "RENTED":
            return {
                label: "Rented",
                className: "bg-blue-500 text-white cursor-not-allowed",
                disabled: true,
            };
        case "MAINTENANCE":
            return {
                label: "Maintenance",
                className: "bg-gray-500 text-white cursor-not-allowed",
                disabled: true,
            };
        case "RETIRED":
            return {
                label: "Unavailable",
                className: "bg-red-500 text-white cursor-not-allowed",
                disabled: true,
            };
        default:
            return {
                label: "Unavailable",
                className: "bg-gray-400 text-white cursor-not-allowed",
                disabled: true,
            };
    }
};

export default function VehicleCard({ vehicle }: { vehicle: IVehicle }) {
    const formattedTransmission =
        vehicle.transmission.charAt(0).toUpperCase() +
        vehicle.transmission.slice(1).toLowerCase();

    const images = vehicle.image ?? [];
    const hasMultipleImages = images.length > 1;

    const statusConfig = getStatusConfig(vehicle.status);

    return (
        <div className="border border-zinc-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col w-92 md:w-88 lg:w-full mx-auto">
            <div className="w-full h-55 relative bg-zinc-100">
                <div className="w-full h-55 relative bg-zinc-100">
                    {hasMultipleImages ? (
                        <ImageSlider
                            images={images}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                        />
                    ) : images.length === 1 ? (
                        <img
                            src={images[0]}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-200">
                            <CarFront className="w-16 h-16 text-zinc-400" />
                        </div>
                    )}
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-zinc-900 leading-tight">
                            {vehicle.brand} {vehicle.model}
                        </h3>
                        <p className="text-zinc-500 text-sm mt-1">
                            {vehicle.vehicleType?.name || "Economy Sedan"}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-primary text-xl font-bold leading-tight">
                            ৳{vehicle.pricePerDay}
                        </p>
                        <p className="text-zinc-500 text-xs mt-1">Per day</p>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-8 px-2">
                    <div className="flex flex-col items-center gap-2">
                        <Users
                            strokeWidth={1.5}
                            className="text-zinc-600 w-6 h-6"
                        />
                        <span className="text-xs text-zinc-600">
                            {vehicle.seats || "-"} Seats
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <IdCard
                            strokeWidth={1.5}
                            className="text-zinc-600 w-6 h-6"
                        />
                        <span className="text-xs text-zinc-600 text-center">
                            {vehicle.vehicleType?.requiresLicense
                                ? "License Req"
                                : "No License"}
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Zap
                            strokeWidth={1.5}
                            className="text-zinc-600 w-6 h-6"
                        />
                        <span className="text-xs text-zinc-600">
                            {vehicle.fuelType.charAt(0).toUpperCase() +
                                vehicle.fuelType.slice(1).toLowerCase()}
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Settings2
                            strokeWidth={1.5}
                            className="text-zinc-600 w-6 h-6"
                        />
                        <span className="text-xs text-zinc-600">
                            {formattedTransmission}
                        </span>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-auto">
                    {/* <Link
                        href={`/vehicles/${vehicle.id}`}
                        className="bg-primary hover:bg-[#ff5a00] text-white font-semibold py-1.5 pl-5 pr-1.5 rounded-lg flex items-center gap-3 transition-colors cursor-pointer"
                    >
                        Rent Now
                        <span className="bg-white text-zinc-900 p-1.5 rounded-md flex items-center justify-center">
                            <CarFront className="w-4 h-4" strokeWidth={2} />
                        </span>
                    </Link> */}
                    <Link
                        href={
                            statusConfig.disabled
                                ? "#"
                                : `/vehicles/${vehicle.id}`
                        }
                        onClick={(e) =>
                            statusConfig.disabled && e.preventDefault()
                        }
                        className={cn(
                            "font-semibold py-1.5 pl-5 pr-1.5 rounded-lg flex items-center gap-3 transition-colors",
                            statusConfig.className,
                            statusConfig.disabled &&
                                "pointer-events-none opacity-70",
                        )}
                    >
                        {statusConfig.label}
                        <span className="bg-white text-zinc-900 p-1.5 rounded-md flex items-center justify-center">
                            <CarFront className="w-4 h-4" strokeWidth={2} />
                        </span>
                    </Link>
                    <Link
                        href={`/vehicles/${vehicle.id}`}
                        className="text-zinc-700 font-semibold text-sm hover:text-zinc-900 transition-colors cursor-pointer"
                    >
                        See Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
