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
import { createVehicleCategorySchema } from "../../../../zod/vehicleCategory.validation";
import { createVehicleCategory } from "../../../../services/vehicleCategory.services";

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
    description: "",
};

export default function CreateVehicleCategoryFormModal() {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: createVehicleCategory,
    });

    const form = useForm({
        defaultValues,
        onSubmit: async ({ value }) => {
            const payload: {
                name: string;
                description?: string;
                image?: File;
            } = {
                name: value.name,
            };

            if (value.description) payload.description = value.description;
            if (imageFile) payload.image = imageFile;

            const result = await mutateAsync(payload);
			console.log(result)
            if (!result?.success) {
                toast.error(result?.message || "Failed to create category");
                return;
            }

            toast.success(result?.message || "Category created successfully");
            setOpen(false);
            resetForm();
            void queryClient.invalidateQueries({
                queryKey: ["vehicle-category"],
            });
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
                    Create Category
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
                        Create Vehicle Category
                    </DialogTitle>
                    <DialogDescription className="text-sm text-zinc-400">
                        Add a new vehicle category with name, description, and
                        an optional image.
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
                                    Category Image{" "}
                                    <span className="text-zinc-400 font-normal">
                                        (optional)
                                    </span>
                                </Label>
                                <div className="flex items-center gap-5">
                                    {/* Preview */}
                                    <div className="relative shrink-0">
                                        {imagePreview ? (
                                            <div className="h-20 w-20 rounded-xl border-2 border-orange-100 overflow-hidden shadow-md">
                                                <Image
                                                    src={imagePreview}
                                                    alt="Category preview"
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

                                    {/* Upload trigger */}
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
                                        createVehicleCategorySchema.shape.name,
                                }}
                            >
                                {(field) => (
                                    <AppField
                                        field={field}
                                        label="Category Name"
                                        placeholder="e.g. SUV, Sedan, Truck"
                                        disabled={isPending}
                                    />
                                )}
                            </form.Field>

                            {/* ── Description ──────────────────────────────── */}
                            <form.Field
                                name="description"
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
                                                Description{" "}
                                                <span className="text-zinc-400 font-normal">
                                                    (optional)
                                                </span>
                                            </Label>
                                            <Textarea
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                placeholder="Describe this vehicle category..."
                                                onBlur={field.handleBlur}
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        e.target.value,
                                                    )
                                                }
                                                disabled={isPending}
                                                rows={3}
                                                aria-invalid={!!firstError}
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
                                            Create Category
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
