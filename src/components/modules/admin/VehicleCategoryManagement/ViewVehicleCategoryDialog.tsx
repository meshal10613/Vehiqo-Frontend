"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../../../ui/dialog";
import { Badge } from "@/components/ui/badge";
import { IVehicleCategory } from "../../../../types/vehicleCategory.type";
import Image from "next/image";
import { Calendar, Camera, FileText, Layers, Tag } from "lucide-react";

const formatDate = (date: string | Date) =>
    new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

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

// ── props ─────────────────────────────────────────────────────────────────────

interface ViewVehicleCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    vehicleCategory: IVehicleCategory | null;
}

// ── component ─────────────────────────────────────────────────────────────────

export default function ViewVehicleCategoryDialoag({
    open,
    onOpenChange,
    vehicleCategory,
}: ViewVehicleCategoryDialogProps) {
    if (!vehicleCategory) return null;

    const typeCount = vehicleCategory.types?.length ?? 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100vw-1.5rem)] max-w-md gap-0 overflow-hidden p-0">
                {/* Top accent bar */}
                <div className="h-1 w-full bg-linear-to-r from-orange-400 via-[#FF5100] to-orange-400" />

                <DialogHeader className="border-b px-6 py-5">
                    <DialogTitle className="text-base font-bold text-zinc-900">
                        Vehicle Category
                    </DialogTitle>
                    <DialogDescription className="text-sm text-zinc-400">
                        Detailed information about this category.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-5 space-y-4">
                    {/* Image */}
                    <div className="flex items-center gap-4">
                        {vehicleCategory.image ? (
                            <div className="h-20 w-20 rounded-xl border-2 border-orange-100 overflow-hidden shadow-md shrink-0">
                                <Image
                                    src={vehicleCategory.image}
                                    alt={vehicleCategory.name}
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
                                {vehicleCategory.name}
                            </h2>
                            <Badge
                                variant="outline"
                                className="border-orange-200 text-[#FF5100] bg-orange-50 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5"
                            >
                                {typeCount} {typeCount === 1 ? "type" : "types"}
                            </Badge>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-zinc-100" />

                    {/* Info rows */}
                    <div className="divide-y divide-zinc-50 -mx-2">
                        <InfoRow
                            icon={Tag}
                            label="Category Name"
                            value={vehicleCategory.name}
                        />
                        <InfoRow
                            icon={FileText}
                            label="Description"
                            value={vehicleCategory.description}
                        />
                        <InfoRow
                            icon={Layers}
                            label="Vehicle Types"
                            value={
                                typeCount > 0 ? (
                                    <span>
                                        {typeCount}{" "}
                                        {typeCount === 1 ? "type" : "types"}{" "}
                                        assigned
                                    </span>
                                ) : (
                                    <span className="text-zinc-300 italic font-normal text-sm">
                                        No types assigned
                                    </span>
                                )
                            }
                        />
                        {vehicleCategory.createdAt && (
                            <InfoRow
                                icon={Calendar}
                                label="Created At"
                                value={formatDate(vehicleCategory.createdAt)}
                            />
                        )}
                        {vehicleCategory.updatedAt && (
                            <InfoRow
                                icon={Calendar}
                                label="Last Updated"
                                value={formatDate(vehicleCategory.updatedAt)}
                            />
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
