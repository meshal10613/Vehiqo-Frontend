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
import { Camera, Plus, X } from "lucide-react";
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
    DialogTrigger,
} from "../../../ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../ui/select";
import { createVehicleSchema } from "../../../../zod/vehicle.validation";
import { createVehicle } from "../../../../services/vehicle.services";
import { IVehicleType } from "../../../../types/vehicleType.type";
import { FuelEnum, TransmissionEnum } from "../../../../types/enum.type";

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

const defaultValues = {
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    plateNo: "",
    color: "",
    transmission: "" as TransmissionEnum,
    seats: undefined as number | undefined,
    fuelType: "" as FuelEnum,
    pricePerDay: undefined as number | undefined,
    mileage: undefined as number | undefined,
    range: undefined as number | undefined,
    engineCC: undefined as number | undefined,
    description: "",
    features: "" as unknown as string,
    vehicleTypeId: "",
    image: [] as File[],
};

interface CreateVehicleFormModalProps {
    vehicleTypes: IVehicleType[];
    isLoadingVehicleTypes?: boolean;
}

export default function CreateVehicleFormModal({
    vehicleTypes,
    isLoadingVehicleTypes = false,
}: CreateVehicleFormModalProps) {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [imageError, setImageError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: createVehicle,
    });

    const form = useForm({
        defaultValues,
        onSubmit: async ({ value }) => {
            const payload: Parameters<typeof createVehicle>[0] = {
                brand: value.brand,
                model: value.model,
                year: Number(value.year),
                plateNo: value.plateNo,
                transmission: value.transmission,
                fuelType: value.fuelType,
                pricePerDay: Number(value.pricePerDay),
                vehicleTypeId: value.vehicleTypeId,
                seats: Number(value.seats),
                image: imageFiles,
            };

            if (value.color) payload.color = value.color;
            if (value.engineCC) payload.engineCC = Number(value.engineCC);
            if (value.description) payload.description = value.description;

            // ── only one of mileage or range ──────────────────────────────
            if (value.fuelType === FuelEnum.ELECTRIC) {
                if (value.range) payload.range = Number(value.range);
            } else {
                if (value.mileage) payload.mileage = Number(value.mileage);
            }

            if (value.features && typeof value.features === "string") {
                const featuresArray = (value.features as string)
                    .split(",")
                    .map((f) => f.trim())
                    .filter(Boolean);
                if (featuresArray.length > 0) payload.features = featuresArray;
            }
            console.log(payload);
            const result = await mutateAsync(payload);
            if (!result?.success) {
                toast.error(result?.message || "Failed to create vehicle");
                return;
            }

            toast.success(result?.message || "Vehicle created successfully");
            setOpen(false);
            resetForm();
            void queryClient.invalidateQueries({ queryKey: ["vehicle"] });
        },
    });

    const resetForm = () => {
        form.reset(defaultValues);
        setImageFiles([]);
        setImagePreviews([]);
        setImageError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (!nextOpen) resetForm();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;

        const totalAfter = imageFiles.length + files.length;
        if (totalAfter > 10) {
            setImageError("You can upload up to 10 images");
            return;
        }

        for (const file of files) {
            if (file.size > 5 * 1024 * 1024) {
                setImageError("Each image must be less than 5MB");
                return;
            }
            if (
                !["image/jpeg", "image/png", "image/webp"].includes(file.type)
            ) {
                setImageError("Only JPG, PNG, or WEBP images are allowed");
                return;
            }
        }

        const updated = [...imageFiles, ...files];

        setImageFiles(updated);
        setImageError(null);

        form.setFieldValue("image", updated);
        form.setFieldMeta("image", (prev) => ({
            ...prev,
            isTouched: true,
        }));
        setImageFiles((prev) => [...prev, ...files]);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () =>
                setImagePreviews((prev) => [...prev, reader.result as string]);
            reader.readAsDataURL(file);
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleRemoveImage = (index: number) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
        setImageError(null);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    className="ml-auto shrink-0 cursor-pointer h-10"
                >
                    <Plus className="size-4" />
                    Add Vehicle
                </Button>
            </DialogTrigger>

            <DialogContent
                className="w-[calc(100vw-1.5rem)] max-w-lg gap-0 overflow-hidden p-0"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <div className="h-1 w-full bg-linear-to-r from-orange-400 via-[#FF5100] to-orange-400" />

                <DialogHeader className="border-b px-6 py-5">
                    <DialogTitle className="text-base font-bold text-zinc-900">
                        Add Vehicle
                    </DialogTitle>
                    <DialogDescription className="text-sm text-zinc-400">
                        Fill in the details to register a new vehicle.
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
                            {/* ── Images ───────────────────────────────────── */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-zinc-700">
                                    Vehicle Images{" "}
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
                                                    alt={`preview-${i}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveImage(i)
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
                                        JPG, PNG or WEBP · Max 5MB each
                                    </p>
                                </div>
                                <form.Field
                                    name="image"
                                    validators={{
                                        onChange:
                                            createVehicleSchema.shape.image,
                                    }}
                                >
                                    {(field) => {
                                        const error =
                                            field.state.meta.isTouched &&
                                            field.state.meta.errors.length > 0
                                                ? field.state.meta.errors[0]
                                                : null;

                                        return (
                                            <>
                                                {/* sync form value */}
                                                <input type="hidden" value="" />

                                                {error && (
                                                    <p className="text-xs text-red-500">
                                                        {getErrorMessage(error)}
                                                    </p>
                                                )}
                                            </>
                                        );
                                    }}
                                </form.Field>
                                {/* {imageError && (
                                    <p className="text-xs text-red-500">
                                        {imageError}
                                    </p>
                                )} */}
                            </div>

                            {/* ── Identity ──────────────────────────────────── */}
                            <SectionTitle>Identity</SectionTitle>
                            <div className="grid grid-cols-2 gap-4">
                                <form.Field
                                    name="brand"
                                    validators={{
                                        onChange:
                                            createVehicleSchema.shape.brand,
                                    }}
                                >
                                    {(field) => (
                                        <AppField
                                            field={field}
                                            label="Brand"
                                            placeholder="e.g. Toyota"
                                            disabled={isPending}
                                        />
                                    )}
                                </form.Field>

                                <form.Field
                                    name="model"
                                    validators={{
                                        onChange:
                                            createVehicleSchema.shape.model,
                                    }}
                                >
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

                                <form.Field
                                    name="plateNo"
                                    validators={{
                                        onChange:
                                            createVehicleSchema.shape.plateNo,
                                    }}
                                >
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
                                <form.Field
                                    name="vehicleTypeId"
                                    validators={{
                                        onChange:
                                            createVehicleSchema.shape
                                                .vehicleTypeId,
                                    }}
                                    listeners={{
                                        onChange: ({ value, fieldApi }) => {
                                            const selected = vehicleTypes.find(
                                                (t) => t.id === value,
                                            );
                                            if (selected?.isElectric) {
                                                fieldApi.form.setFieldValue(
                                                    "fuelType",
                                                    FuelEnum.ELECTRIC,
                                                );
                                                fieldApi.form.setFieldValue(
                                                    "mileage",
                                                    undefined,
                                                );
                                            } else {
                                                // Reset fuelType if switching away from an electric type
                                                fieldApi.form.setFieldValue(
                                                    "fuelType",
                                                    "" as FuelEnum,
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
                                                    <SelectContent
                                                        className="max-h-60"
                                                        style={{
                                                            maxHeight: "240px",
                                                            overflowY: "auto",
                                                        }}
                                                        position="popper"
                                                        sideOffset={4}
                                                    >
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
                                <form.Field
                                    name="transmission"
                                    validators={{
                                        onChange:
                                            createVehicleSchema.shape
                                                .transmission,
                                    }}
                                >
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

                                {/* Fuel Type — spans full width so mileage/range sits beside engineCC */}
                                <form.Field
                                    name="fuelType"
                                    validators={{
                                        onChange:
                                            createVehicleSchema.shape.fuelType,
                                    }}
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
                                        const selectedType = vehicleTypes.find(
                                            (t) =>
                                                t.id ===
                                                form.getFieldValue(
                                                    "vehicleTypeId",
                                                ),
                                        );
                                        const isLocked =
                                            !!selectedType?.isElectric;

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
                                                    disabled={
                                                        isPending || isLocked
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
                                                {isLocked && (
                                                    <p className="text-[11px] text-zinc-400">
                                                        Fuel type is fixed to
                                                        Electric for this
                                                        vehicle type.
                                                    </p>
                                                )}
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
                                            AC, Bluetooth, GPS, Sunroof
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
                                            pendingLabel="Creating..."
                                            disabled={!canSubmit}
                                            className="flex-1 h-10 cursor-pointer"
                                        >
                                            Add Vehicle
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
