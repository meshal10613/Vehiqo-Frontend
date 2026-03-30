"use client";

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../../../ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../ui/select";
import { updateVehicle } from "../../../../services/vehicle.services";
import { IVehicle } from "../../../../types/vehicle.type";
import { IVehicleType } from "../../../../types/vehicleType.type";
import {
    FuelEnum,
    TransmissionEnum,
    VehicleStatusEnum,
} from "../../../../types/enum.type";

// ── helpers ───────────────────────────────────────────────────────────────────

const getErrorMessage = (error: unknown): string => {
    if (typeof error === "string") return error;
    if (error && typeof error === "object" && "message" in error)
        return String((error as { message: unknown }).message);
    return "Invalid input";
};

const FieldMessage = ({ error }: { error: unknown }) =>
    error ? (
        <p className="text-sm text-destructive">{getErrorMessage(error)}</p>
    ) : null;

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 pt-1">
        {children}
    </p>
);

// ── default values ────────────────────────────────────────────────────────────

const getDefaultValues = (vehicle: IVehicle | null) => ({
    brand: vehicle?.brand ?? "",
    model: vehicle?.model ?? "",
    year: vehicle?.year ?? new Date().getFullYear(),
    plateNo: vehicle?.plateNo ?? "",
    color: vehicle?.color ?? "",
    transmission: (vehicle?.transmission ?? "") as TransmissionEnum,
    seats: vehicle?.seats ?? undefined,
    fuelType: (vehicle?.fuelType ?? "") as FuelEnum,
    pricePerDay: vehicle?.pricePerDay ?? undefined,
    mileage: vehicle?.mileage ?? undefined,
    range: vehicle?.range ?? undefined,
    engineCC: vehicle?.engineCC ?? undefined,
    status: (vehicle?.status ??
        VehicleStatusEnum.AVAILABLE) as VehicleStatusEnum,
    description: vehicle?.description ?? "",
    features: vehicle?.features?.join(", ") ?? "",
    vehicleTypeId: vehicle?.vehicleTypeId ?? "",
});

// ── props ─────────────────────────────────────────────────────────────────────

interface EditVehicleFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    vehicle: IVehicle | null;
    vehicleTypes: IVehicleType[];
    isLoadingVehicleTypes?: boolean;
}

// ── component ─────────────────────────────────────────────────────────────────

export default function EditVehicleFormModal({
    open,
    onOpenChange,
    vehicle,
    vehicleTypes,
    isLoadingVehicleTypes = false,
}: EditVehicleFormModalProps) {
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [imageError, setImageError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: ({
            vehicleId,
            payload,
        }: {
            vehicleId: string;
            payload: Parameters<typeof updateVehicle>[1];
        }) => updateVehicle(vehicleId, payload),
    });

    const form = useForm({
        defaultValues: getDefaultValues(vehicle),
        onSubmit: async ({ value }) => {
            if (!vehicle) {
                toast.error("Vehicle not found");
                return;
            }

            const payload: Parameters<typeof updateVehicle>[1] = {};

            if (value.brand && value.brand !== vehicle.brand)
                payload.brand = value.brand;
            if (value.model && value.model !== vehicle.model)
                payload.model = value.model;
            if (value.year && Number(value.year) !== vehicle.year)
                payload.year = Number(value.year);
            if (value.plateNo && value.plateNo !== vehicle.plateNo)
                payload.plateNo = value.plateNo;
            if (value.color !== vehicle.color) payload.color = value.color;
            if (
                value.transmission &&
                value.transmission !== vehicle.transmission
            )
                payload.transmission = value.transmission;
            if (value.seats && Number(value.seats) !== vehicle.seats)
                payload.seats = Number(value.seats);
            if (value.fuelType && value.fuelType !== vehicle.fuelType)
                payload.fuelType = value.fuelType;
            if (
                value.pricePerDay &&
                Number(value.pricePerDay) !== vehicle.pricePerDay
            )
                payload.pricePerDay = Number(value.pricePerDay);
            if (value.engineCC && Number(value.engineCC) !== vehicle.engineCC)
                payload.engineCC = Number(value.engineCC);
            if (value.status && value.status !== vehicle.status)
                payload.status = value.status;
            if (value.description !== vehicle.description)
                payload.description = value.description;
            if (
                value.vehicleTypeId &&
                value.vehicleTypeId !== vehicle.vehicleTypeId
            )
                payload.vehicleTypeId = value.vehicleTypeId;

            // ── mileage or range depending on fuelType ────────────────────
            const effectiveFuelType = value.fuelType || vehicle.fuelType;
            if (effectiveFuelType === FuelEnum.ELECTRIC) {
                if (value.range && Number(value.range) !== vehicle.range)
                    payload.range = Number(value.range);
            } else {
                if (value.mileage && Number(value.mileage) !== vehicle.mileage)
                    payload.mileage = Number(value.mileage);
            }

            // ── features ──────────────────────────────────────────────────
            if (typeof value.features === "string") {
                const featuresArray = value.features
                    .split(",")
                    .map((f) => f.trim())
                    .filter(Boolean);
                const originalFeatures = vehicle.features ?? [];
                if (
                    JSON.stringify(featuresArray) !==
                    JSON.stringify(originalFeatures)
                ) {
                    payload.features = featuresArray;
                }
            }

            if (imageFiles.length > 0) payload.image = imageFiles;

            if (Object.keys(payload).length === 0) {
                toast.info("No changes to save.");
                return;
            }

            const result = await mutateAsync({
                vehicleId: vehicle.id,
                payload,
            });

            if (!result?.success) {
                toast.error(result?.message || "Failed to update vehicle");
                return;
            }

            toast.success(result?.message || "Vehicle updated successfully");
            resetForm();
            onOpenChange(false);
            void queryClient.invalidateQueries({ queryKey: ["vehicle"] });
        },
    });

    const resetForm = () => {
        form.reset(getDefaultValues(vehicle));
        setImageFiles([]);
        setImagePreviews([]);
        setImageError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) resetForm();
        onOpenChange(isOpen);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;

        if (imageFiles.length + files.length > 10) {
            setImageError("You can upload up to 10 images");
            return;
        }
        for (const file of files) {
            if (file.size > 2 * 1024 * 1024) {
                setImageError("Each image must be less than 2MB");
                return;
            }
            if (
                !["image/jpeg", "image/png", "image/webp"].includes(file.type)
            ) {
                setImageError("Only JPG, PNG, or WEBP images are allowed");
                return;
            }
        }

        setImageError(null);
        setImageFiles((prev) => [...prev, ...files]);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () =>
                setImagePreviews((prev) => [...prev, reader.result as string]);
            reader.readAsDataURL(file);
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleRemoveNewImage = (index: number) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
        setImageError(null);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="w-[calc(100vw-1.5rem)] max-w-lg gap-0 overflow-hidden p-0"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <div className="h-1 w-full bg-linear-to-r from-orange-400 via-[#FF5100] to-orange-400" />

                <DialogHeader className="border-b px-6 py-5">
                    <DialogTitle className="text-base font-bold text-zinc-900">
                        Edit Vehicle
                    </DialogTitle>
                    <DialogDescription className="text-sm text-zinc-400">
                        Update the details for{" "}
                        <span className="font-medium text-zinc-600">
                            {vehicle?.brand} {vehicle?.model}
                        </span>
                        .
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[calc(90vh-9rem)]">
                    <div className="px-6 py-5">
                        <form
                            method="POST"
                            action="#"
                            noValidate
                            onSubmit={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                form.handleSubmit();
                            }}
                            className="space-y-5"
                        >
                            {/* ── Existing images ───────────────────────────── */}
                            {vehicle?.image && vehicle.image.length > 0 && (
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-zinc-700">
                                        Current Images
                                    </Label>
                                    <div className="flex flex-wrap gap-2">
                                        {vehicle.image.map((src, i) => (
                                            <div
                                                key={i}
                                                className="relative h-16 w-16 rounded-lg border-2 border-zinc-100 overflow-hidden shadow-sm"
                                            >
                                                <Image
                                                    src={src}
                                                    alt={`existing-${i}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── New images ────────────────────────────────── */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-zinc-700">
                                    Add New Images{" "}
                                    <span className="text-zinc-400 font-normal">
                                        (optional · max 10)
                                    </span>
                                </Label>
                                {imagePreviews.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {imagePreviews.map((src, i) => (
                                            <div
                                                key={i}
                                                className="relative h-16 w-16 rounded-lg border-2 border-orange-100 overflow-hidden shadow-sm"
                                            >
                                                <Image
                                                    src={src}
                                                    alt={`new-preview-${i}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveNewImage(i)
                                                    }
                                                    className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-zinc-800 text-white flex items-center justify-center hover:bg-red-500 transition-colors cursor-pointer"
                                                >
                                                    <X className="h-2.5 w-2.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        multiple
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        disabled={imageFiles.length >= 10}
                                        className="gap-1.5 border-zinc-200 text-zinc-700 hover:text-[#FF5100] hover:border-orange-200 hover:bg-orange-50 transition-all duration-200 cursor-pointer"
                                    >
                                        <Camera className="h-3.5 w-3.5" />
                                        {imagePreviews.length > 0
                                            ? `Add More (${imagePreviews.length}/10)`
                                            : "Upload Images"}
                                    </Button>
                                    <p className="text-[11px] text-zinc-400">
                                        JPG, PNG or WEBP · Max 2MB each
                                    </p>
                                </div>
                                {imageError && (
                                    <p className="text-xs text-red-500">
                                        {imageError}
                                    </p>
                                )}
                            </div>

                            {/* ── Identity ──────────────────────────────────── */}
                            <SectionTitle>Identity</SectionTitle>
                            <div className="grid grid-cols-2 gap-4">
                                <form.Field name="brand">
                                    {(field) => (
                                        <AppField
                                            field={field}
                                            label="Brand"
                                            placeholder="e.g. Toyota"
                                            disabled={isPending}
                                        />
                                    )}
                                </form.Field>

                                <form.Field name="model">
                                    {(field) => (
                                        <AppField
                                            field={field}
                                            label="Model"
                                            placeholder="e.g. Corolla"
                                            disabled={isPending}
                                        />
                                    )}
                                </form.Field>

                                <form.Field name="year">
                                    {(field) => (
                                        <AppField
                                            field={field}
                                            label="Year"
                                            placeholder="e.g. 2022"
                                            type="number"
                                            disabled={isPending}
                                        />
                                    )}
                                </form.Field>

                                <form.Field name="plateNo">
                                    {(field) => (
                                        <AppField
                                            field={field}
                                            label="Plate Number"
                                            placeholder="e.g. DHA-KA-1234"
                                            disabled={isPending}
                                        />
                                    )}
                                </form.Field>

                                <form.Field name="color">
                                    {(field) => (
                                        <AppField
                                            field={field}
                                            label="Color"
                                            placeholder="e.g. Red"
                                            disabled={isPending}
                                        />
                                    )}
                                </form.Field>

                                <form.Field name="seats">
                                    {(field) => (
                                        <AppField
                                            field={field}
                                            label="Seats"
                                            placeholder="e.g. 5"
                                            type="number"
                                            disabled={isPending}
                                        />
                                    )}
                                </form.Field>
                            </div>

                            {/* ── Classification ────────────────────────────── */}
                            <SectionTitle>Classification</SectionTitle>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Vehicle Type */}
                                <form.Field name="vehicleTypeId">
                                    {(field) => {
                                        const firstError =
                                            field.state.meta.isTouched &&
                                            field.state.meta.errors.length > 0
                                                ? field.state.meta.errors[0]
                                                : null;
                                        return (
                                            <div className="space-y-1.5">
                                                <Label
                                                    htmlFor={field.name}
                                                    className={cn(
                                                        "text-sm font-medium",
                                                        firstError
                                                            ? "text-destructive"
                                                            : "text-zinc-700",
                                                    )}
                                                >
                                                    Vehicle Type
                                                </Label>
                                                <Select
                                                    value={field.state.value}
                                                    onValueChange={(val) => {
                                                        field.handleChange(val);
                                                        field.handleBlur();
                                                    }}
                                                    disabled={
                                                        isPending ||
                                                        isLoadingVehicleTypes
                                                    }
                                                >
                                                    <SelectTrigger
                                                        id={field.name}
                                                        className={cn(
                                                            "w-full transition-all duration-200 h-10!",
                                                            firstError
                                                                ? "border-destructive"
                                                                : "border-zinc-200 focus:border-[#FF5100] focus:ring-[#FF5100]/20",
                                                        )}
                                                    >
                                                        <SelectValue
                                                            placeholder={
                                                                isLoadingVehicleTypes
                                                                    ? "Loading types..."
                                                                    : "Select type"
                                                            }
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {vehicleTypes.map(
                                                            (t) => (
                                                                <SelectItem
                                                                    key={t.id}
                                                                    value={t.id}
                                                                >
                                                                    {t.name}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FieldMessage
                                                    error={firstError}
                                                />
                                            </div>
                                        );
                                    }}
                                </form.Field>

                                {/* Transmission */}
                                <form.Field name="transmission">
                                    {(field) => {
                                        const firstError =
                                            field.state.meta.isTouched &&
                                            field.state.meta.errors.length > 0
                                                ? field.state.meta.errors[0]
                                                : null;
                                        return (
                                            <div className="space-y-1.5">
                                                <Label
                                                    htmlFor={field.name}
                                                    className={cn(
                                                        "text-sm font-medium",
                                                        firstError
                                                            ? "text-destructive"
                                                            : "text-zinc-700",
                                                    )}
                                                >
                                                    Transmission
                                                </Label>
                                                <Select
                                                    value={field.state.value}
                                                    onValueChange={(val) => {
                                                        field.handleChange(
                                                            val as TransmissionEnum,
                                                        );
                                                        field.handleBlur();
                                                    }}
                                                    disabled={isPending}
                                                >
                                                    <SelectTrigger
                                                        id={field.name}
                                                        className={cn(
                                                            "w-full transition-all duration-200 h-10!",
                                                            firstError
                                                                ? "border-destructive"
                                                                : "border-zinc-200 focus:border-[#FF5100] focus:ring-[#FF5100]/20",
                                                        )}
                                                    >
                                                        <SelectValue placeholder="Select transmission" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.values(
                                                            TransmissionEnum,
                                                        ).map((v) => (
                                                            <SelectItem
                                                                key={v}
                                                                value={v}
                                                            >
                                                                {v.replace(
                                                                    /_/g,
                                                                    " ",
                                                                )}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FieldMessage
                                                    error={firstError}
                                                />
                                            </div>
                                        );
                                    }}
                                </form.Field>

                                {/* Fuel Type */}
                                <form.Field
                                    name="fuelType"
                                    listeners={{
                                        onChange: ({ value, fieldApi }) => {
                                            if (value === FuelEnum.ELECTRIC) {
                                                fieldApi.form.setFieldValue(
                                                    "mileage",
                                                    undefined,
                                                );
                                            } else {
                                                fieldApi.form.setFieldValue(
                                                    "range",
                                                    undefined,
                                                );
                                            }
                                        },
                                    }}
                                >
                                    {(field) => {
                                        const firstError =
                                            field.state.meta.isTouched &&
                                            field.state.meta.errors.length > 0
                                                ? field.state.meta.errors[0]
                                                : null;
                                        return (
                                            <div className="space-y-1.5 col-span-2">
                                                <Label
                                                    htmlFor={field.name}
                                                    className={cn(
                                                        "text-sm font-medium",
                                                        firstError
                                                            ? "text-destructive"
                                                            : "text-zinc-700",
                                                    )}
                                                >
                                                    Fuel Type
                                                </Label>
                                                <Select
                                                    value={field.state.value}
                                                    onValueChange={(val) => {
                                                        field.handleChange(
                                                            val as FuelEnum,
                                                        );
                                                        field.handleBlur();
                                                    }}
                                                    disabled={isPending}
                                                >
                                                    <SelectTrigger
                                                        id={field.name}
                                                        className={cn(
                                                            "w-full transition-all duration-200 h-10!",
                                                            firstError
                                                                ? "border-destructive"
                                                                : "border-zinc-200 focus:border-[#FF5100] focus:ring-[#FF5100]/20",
                                                        )}
                                                    >
                                                        <SelectValue placeholder="Select fuel type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.values(
                                                            FuelEnum,
                                                        ).map((v) => (
                                                            <SelectItem
                                                                key={v}
                                                                value={v}
                                                            >
                                                                {v}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FieldMessage
                                                    error={firstError}
                                                />
                                            </div>
                                        );
                                    }}
                                </form.Field>

                                {/* Status */}
                                <form.Field name="status">
                                    {(field) => {
                                        const firstError =
                                            field.state.meta.isTouched &&
                                            field.state.meta.errors.length > 0
                                                ? field.state.meta.errors[0]
                                                : null;
                                        return (
                                            <div className="space-y-1.5 col-span-2">
                                                <Label
                                                    htmlFor={field.name}
                                                    className={cn(
                                                        "text-sm font-medium",
                                                        firstError
                                                            ? "text-destructive"
                                                            : "text-zinc-700",
                                                    )}
                                                >
                                                    Status
                                                </Label>
                                                <Select
                                                    value={field.state.value}
                                                    onValueChange={(val) => {
                                                        field.handleChange(
                                                            val as VehicleStatusEnum,
                                                        );
                                                        field.handleBlur();
                                                    }}
                                                    disabled={isPending}
                                                >
                                                    <SelectTrigger
                                                        id={field.name}
                                                        className={cn(
                                                            "w-full transition-all duration-200 h-10!",
                                                            firstError
                                                                ? "border-destructive"
                                                                : "border-zinc-200 focus:border-[#FF5100] focus:ring-[#FF5100]/20",
                                                        )}
                                                    >
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.values(
                                                            VehicleStatusEnum,
                                                        ).map((v) => (
                                                            <SelectItem
                                                                key={v}
                                                                value={v}
                                                            >
                                                                {v.replace(
                                                                    /_/g,
                                                                    " ",
                                                                )}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FieldMessage
                                                    error={firstError}
                                                />
                                            </div>
                                        );
                                    }}
                                </form.Field>
                            </div>

                            {/* ── Pricing & Specs ───────────────────────────── */}
                            <SectionTitle>Pricing & Specs</SectionTitle>
                            <div className="grid grid-cols-2 gap-4">
                                <form.Field name="pricePerDay">
                                    {(field) => (
                                        <AppField
                                            field={field}
                                            label="Price Per Day (৳)"
                                            placeholder="e.g. 50"
                                            type="number"
                                            disabled={isPending}
                                        />
                                    )}
                                </form.Field>

                                <form.Field name="engineCC">
                                    {(field) => (
                                        <AppField
                                            field={field}
                                            label="Engine CC"
                                            placeholder="e.g. 1600"
                                            type="number"
                                            disabled={isPending}
                                        />
                                    )}
                                </form.Field>

                                {/* mileage OR range based on fuelType */}
                                <form.Subscribe
                                    selector={(state) => state.values.fuelType}
                                >
                                    {(fuelType) =>
                                        fuelType === FuelEnum.ELECTRIC ? (
                                            <form.Field name="range">
                                                {(field) => (
                                                    <AppField
                                                        field={field}
                                                        label="Range (km)"
                                                        placeholder="e.g. 400"
                                                        type="number"
                                                        disabled={isPending}
                                                    />
                                                )}
                                            </form.Field>
                                        ) : (
                                            <form.Field name="mileage">
                                                {(field) => (
                                                    <AppField
                                                        field={field}
                                                        label="Mileage (km/l)"
                                                        placeholder="e.g. 15"
                                                        type="number"
                                                        disabled={isPending}
                                                    />
                                                )}
                                            </form.Field>
                                        )
                                    }
                                </form.Subscribe>
                            </div>

                            {/* ── Description ───────────────────────────────── */}
                            <form.Field name="description">
                                {(field) => {
                                    const firstError =
                                        field.state.meta.isTouched &&
                                        field.state.meta.errors.length > 0
                                            ? field.state.meta.errors[0]
                                            : null;
                                    return (
                                        <div className="space-y-1.5">
                                            <Label
                                                htmlFor={field.name}
                                                className={cn(
                                                    "text-sm font-medium",
                                                    firstError
                                                        ? "text-destructive"
                                                        : "text-zinc-700",
                                                )}
                                            >
                                                Description{" "}
                                                <span className="text-zinc-400 font-normal">
                                                    (optional)
                                                </span>
                                            </Label>
                                            <Textarea
                                                id={field.name}
                                                name={field.name}
                                                value={
                                                    field.state.value as string
                                                }
                                                placeholder="Describe this vehicle..."
                                                onBlur={field.handleBlur}
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        e.target.value as never,
                                                    )
                                                }
                                                disabled={isPending}
                                                rows={3}
                                                className={cn(
                                                    "resize-none transition-all duration-200",
                                                    firstError
                                                        ? "border-destructive"
                                                        : "border-zinc-200 focus-visible:border-[#FF5100] focus-visible:ring-[#FF5100]/20",
                                                )}
                                            />
                                            <FieldMessage error={firstError} />
                                        </div>
                                    );
                                }}
                            </form.Field>

                            {/* ── Features ──────────────────────────────────── */}
                            <form.Field name="features">
                                {(field) => (
                                    <div className="space-y-1.5">
                                        <Label
                                            htmlFor={field.name}
                                            className="text-sm font-medium text-zinc-700"
                                        >
                                            Features{" "}
                                            <span className="text-zinc-400 font-normal">
                                                (optional · comma separated)
                                            </span>
                                        </Label>
                                        <input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value as string}
                                            placeholder="e.g. AC, Bluetooth, GPS"
                                            onBlur={field.handleBlur}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value as never,
                                                )
                                            }
                                            disabled={isPending}
                                            className={cn(
                                                "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                                                "border-zinc-200 focus-visible:border-[#FF5100] focus-visible:ring-[#FF5100]/20",
                                            )}
                                        />
                                        <p className="text-[11px] text-zinc-400">
                                            Separate features with commas e.g.
                                            AC, Bluetooth, GPS
                                        </p>
                                    </div>
                                )}
                            </form.Field>

                            {/* ── Footer ───────────────────────────────────── */}
                            <div className="flex items-center gap-3 border-t border-zinc-100 pt-4">
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={isPending}
                                        className="flex-1 h-10 cursor-pointer border-zinc-200 text-zinc-700"
                                    >
                                        Cancel
                                    </Button>
                                </DialogClose>

                                <form.Subscribe
                                    selector={(state) =>
                                        [
                                            state.canSubmit,
                                            state.isSubmitting,
                                        ] as const
                                    }
                                >
                                    {([canSubmit, isSubmitting]) => (
                                        <AppSubmitButton
                                            isPending={
                                                isSubmitting || isPending
                                            }
                                            pendingLabel="Saving..."
                                            disabled={!canSubmit}
                                            className="flex-1 h-10 cursor-pointer"
                                        >
                                            Save Changes
                                        </AppSubmitButton>
                                    )}
                                </form.Subscribe>
                            </div>
                        </form>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
