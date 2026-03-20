"use client";

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { createVehicleTypeSchema } from "../../../../zod/vehicleType.validation";
import { createVehicleType } from "../../../../services/vehicleType.services";
import { IVehicleCategory } from "../../../../types/vehicleCategory.type";
import { Switch } from "../../../ui/switch";

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

const defaultValues = {
    name: "",
    categoryId: "",
    isElectric: false,
    requiresLicense: true,
};

interface CreateVehicleTypeFormModalProps {
    vehicleCategory: IVehicleCategory[];
    isLoadingVehicleCategory?: boolean;
}

export default function CreateVehicleTypeFormModal({
    vehicleCategory,
    isLoadingVehicleCategory = false,
}: CreateVehicleTypeFormModalProps) {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: createVehicleType,
    });

    const form = useForm({
        defaultValues,
        onSubmit: async ({ value }) => {
            const payload: {
                name: string;
                categoryId: string;
                isElectric?: boolean;
                requiresLicense?: boolean;
                image?: File;
            } = {
                name: value.name,
                categoryId: value.categoryId,
                isElectric: value.isElectric,
                requiresLicense: value.requiresLicense,
            };

            if (imageFile) payload.image = imageFile;

            const result = await mutateAsync(payload);
            if (!result?.success) {
                toast.error(result?.message || "Failed to create vehicle type");
                return;
            }

            toast.success(
                result?.message || "Vehicle type created successfully",
            );
            setOpen(false);
            resetForm();
            void queryClient.invalidateQueries({ queryKey: ["vehicle-type"] });
        },
    });

    const resetForm = () => {
        form.reset(defaultValues);
        setImagePreview(null);
        setImageFile(null);
        setImageError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (!nextOpen) resetForm();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setImageError("Image must be less than 2MB");
            return;
        }
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            setImageError("Only JPG, PNG, or WEBP images are allowed");
            return;
        }

        setImageError(null);
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setImageFile(null);
        setImageError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    className="ml-auto shrink-0 cursor-pointer h-10"
                >
                    <Plus className="size-4" />
                    Create Type
                </Button>
            </DialogTrigger>

            <DialogContent
                className="w-[calc(100vw-1.5rem)] max-w-lg gap-0 overflow-hidden p-0"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                {/* Top accent bar */}
                <div className="h-1 w-full bg-linear-to-r from-orange-400 via-[#FF5100] to-orange-400" />

                <DialogHeader className="border-b px-6 py-5">
                    <DialogTitle className="text-base font-bold text-zinc-900">
                        Create Vehicle Type
                    </DialogTitle>
                    <DialogDescription className="text-sm text-zinc-400">
                        Add a new vehicle type with name, category, and optional
                        image.
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
                            {/* ── Image upload ─────────────────────────────── */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-zinc-700">
                                    Type Image{" "}
                                    <span className="text-zinc-400 font-normal">
                                        (optional)
                                    </span>
                                </Label>
                                <div className="flex items-center gap-5">
                                    <div className="relative shrink-0">
                                        {imagePreview ? (
                                            <div className="h-20 w-20 rounded-xl border-2 border-orange-100 overflow-hidden shadow-md">
                                                <Image
                                                    src={imagePreview}
                                                    alt="Type preview"
                                                    width={80}
                                                    height={80}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-20 w-20 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex items-center justify-center">
                                                <Camera className="h-6 w-6 text-zinc-300" />
                                            </div>
                                        )}
                                        {imagePreview && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-zinc-800 text-white flex items-center justify-center hover:bg-red-500 transition-colors shadow cursor-pointer"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
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
                                            className="gap-1.5 border-zinc-200 text-zinc-700 hover:text-[#FF5100] hover:border-orange-200 hover:bg-orange-50 transition-all duration-200 cursor-pointer"
                                        >
                                            <Camera className="h-3.5 w-3.5" />
                                            {imagePreview
                                                ? "Change Image"
                                                : "Upload Image"}
                                        </Button>
                                        <p className="text-[11px] text-zinc-400">
                                            JPG, PNG or WEBP · Max 2MB
                                        </p>
                                        {imageError && (
                                            <p className="text-xs text-red-500">
                                                {imageError}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* ── Name ─────────────────────────────────────── */}
                            <form.Field
                                name="name"
                                validators={{
                                    onChange:
                                        createVehicleTypeSchema.shape.name,
                                }}
                            >
                                {(field) => (
                                    <AppField
                                        field={field}
                                        label="Type Name"
                                        placeholder="e.g. Sedan, Pickup, Convertible"
                                        disabled={isPending}
                                    />
                                )}
                            </form.Field>

                            {/* ── Category Select ───────────────────────────── */}
                            <form.Field
                                name="categoryId"
                                validators={{
                                    onChange:
                                        createVehicleTypeSchema.shape
                                            .categoryId,
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
                                                Category
                                            </Label>
                                            <Select
                                                value={field.state.value}
                                                onValueChange={(val) => {
                                                    field.handleChange(val);
                                                    field.handleBlur();
                                                }}
                                                disabled={
                                                    isPending ||
                                                    isLoadingVehicleCategory
                                                }
                                            >
                                                <SelectTrigger
                                                    id={field.name}
                                                    className={cn(
                                                        "w-full transition-all duration-200",
                                                        firstError
                                                            ? "border-destructive"
                                                            : "border-zinc-200 focus:border-[#FF5100] focus:ring-[#FF5100]/20",
                                                    )}
                                                >
                                                    <SelectValue
                                                        placeholder={
                                                            isLoadingVehicleCategory
                                                                ? "Loading categories..."
                                                                : "Select a category"
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {vehicleCategory.map(
                                                        (cat) => (
                                                            <SelectItem
                                                                key={cat.id}
                                                                value={cat.id}
                                                            >
                                                                {cat.name}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FieldMessage error={firstError} />
                                        </div>
                                    );
                                }}
                            </form.Field>

                            {/* ── isElectric + requiresLicense ─────────────── */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* isElectric */}
                                <form.Field name="isElectric">
                                    {(field) => (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                field.handleChange(
                                                    !field.state.value,
                                                )
                                            }
                                            disabled={isPending}
                                            className={cn(
                                                "flex items-center justify-between rounded-lg border px-4 py-3 gap-3 w-full transition-all duration-200 cursor-pointer",
                                                field.state.value
                                                    ? "border-[#FF5100] bg-orange-50"
                                                    : "border-zinc-200 bg-white hover:border-zinc-300",
                                            )}
                                        >
                                            <div className="space-y-0.5 text-left">
                                                <p
                                                    className={cn(
                                                        "text-sm font-medium transition-colors",
                                                        field.state.value
                                                            ? "text-[#FF5100]"
                                                            : "text-zinc-700",
                                                    )}
                                                >
                                                    Electric
                                                </p>
                                                <p className="text-[11px] text-zinc-400">
                                                    EV or hybrid
                                                </p>
                                            </div>
                                            <div
                                                className={cn(
                                                    "h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-200",
                                                    field.state.value
                                                        ? "border-[#FF5100] bg-[#FF5100]"
                                                        : "border-zinc-300 bg-white",
                                                )}
                                            >
                                                {field.state.value && (
                                                    <div className="h-2 w-2 rounded-full bg-white" />
                                                )}
                                            </div>
                                        </button>
                                    )}
                                </form.Field>

                                {/* requiresLicense */}
                                <form.Field name="requiresLicense">
                                    {(field) => (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                field.handleChange(
                                                    !field.state.value,
                                                )
                                            }
                                            disabled={isPending}
                                            className={cn(
                                                "flex items-center justify-between rounded-lg border px-4 py-3 gap-3 w-full transition-all duration-200 cursor-pointer",
                                                field.state.value
                                                    ? "border-[#FF5100] bg-orange-50"
                                                    : "border-zinc-200 bg-white hover:border-zinc-300",
                                            )}
                                        >
                                            <div className="space-y-0.5 text-left">
                                                <p
                                                    className={cn(
                                                        "text-sm font-medium transition-colors",
                                                        field.state.value
                                                            ? "text-[#FF5100]"
                                                            : "text-zinc-700",
                                                    )}
                                                >
                                                    License
                                                </p>
                                                <p className="text-[11px] text-zinc-400">
                                                    Requires license
                                                </p>
                                            </div>
                                            <div
                                                className={cn(
                                                    "h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-200",
                                                    field.state.value
                                                        ? "border-[#FF5100] bg-[#FF5100]"
                                                        : "border-zinc-300 bg-white",
                                                )}
                                            >
                                                {field.state.value && (
                                                    <div className="h-2 w-2 rounded-full bg-white" />
                                                )}
                                            </div>
                                        </button>
                                    )}
                                </form.Field>
                            </div>

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
                                            Create Type
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
