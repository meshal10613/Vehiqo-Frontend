"use client";

import { IUser } from "../../../types/user.type";
import { GenderEnum } from "../../../types/enum.type";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Camera, IdCard, User, X } from "lucide-react";
import { IUpdateUserPayload } from "../../../zod/user.validation";
import { updateProfileAction } from "../../../app/(dashboardLayout)/(commonProtectedLayout)/my-profile/_action";
import { updateUserImage } from "../../../services/auth.services";
// import { updateUserAction } from "../../../app/(authLayout)/my-profile/_action";

const SectionLabel = ({
    icon: Icon,
    title,
}: {
    icon: React.ElementType;
    title: string;
}) => (
    <div className="flex items-center gap-2.5 mb-4">
        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#FF5100]/10">
            <Icon className="h-3 w-3 text-[#FF5100]" />
        </div>
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
            {title}
        </p>
        <div className="flex-1 h-px bg-zinc-100" />
    </div>
);

// ── Props ─────────────────────────────────────────────────────────────────────

interface EditProfileModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: IUser;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const getDefaultValues = (user: IUser) => ({
    name: user.name ?? "",
    mobileNumber: user.mobileNumber ?? "",
    gender: (user.gender as GenderEnum) ?? ("" as GenderEnum),
    licenseNumber: user.licenseNumber ?? "",
    nidNumber: user.nidNumber ?? "",
});

// ── Component ─────────────────────────────────────────────────────────────────

export default function EditMyProfileModal({
    open,
    onOpenChange,
    user,
}: EditProfileModalProps) {
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        user.image ?? null,
    );
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: async (formData: IUpdateUserPayload) => {
            return updateProfileAction(formData);
        },
    });

    const form = useForm({
        defaultValues: getDefaultValues(user),
        onSubmit: async ({ value }) => {
            const formData = new FormData();

            // Only append fields that differ from original user data
            // (or are newly set — all optional, send only what changed)
            if (value.name && value.name !== user.name)
                formData.append("name", value.name);
            if (value.mobileNumber && value.mobileNumber !== user.mobileNumber)
                formData.append("mobileNumber", value.mobileNumber);
            if (value.gender && value.gender !== user.gender)
                formData.append("gender", value.gender);
            if (
                value.licenseNumber &&
                value.licenseNumber !== user.licenseNumber
            )
                formData.append("licenseNumber", value.licenseNumber);
            if (value.nidNumber && value.nidNumber !== user.nidNumber)
                formData.append("nidNumber", value.nidNumber);

            // Nothing changed
            if ([...formData.entries()].length === 0) {
                toast.info("No changes to save.");
                return;
            }

            const toastId = toast.loading("Updating profile...");

            try {
                const payload = Object.fromEntries(formData.entries());
                const result = (await mutateAsync(payload)) as any;

                if (!result?.success) {
                    toast.error(result?.message || "Failed to update profile", {
                        id: toastId,
                    });
                    return;
                }

                toast.success(result.message || "Profile updated!", {
                    id: toastId,
                });

                resetForm();
                onOpenChange(false);
                void queryClient.invalidateQueries({ queryKey: ["user"] });
            } catch (error: any) {
                toast.error(error?.message || "Something went wrong.", {
                    id: toastId,
                });
            }
        },
    });

    const resetForm = () => {
        form.reset(getDefaultValues(user));
        setImagePreview(user.image ?? null);
        setImageFile(null);
        setImageError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleImageChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
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

        const toastId = toast.loading("Uploading profile picture...");
        try {
            const result = await updateUserImage(file);

            if (!result?.success) {
                toast.error(result?.message || "Failed to upload image", {
                    id: toastId,
                });
                // revert preview on failure
                setImagePreview(user.image ?? null);
                setImageFile(null);
                return;
            }

            toast.success("Profile picture updated!", { id: toastId });
            void queryClient.invalidateQueries({ queryKey: ["user"] });
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong.", {
                id: toastId,
            });
            setImagePreview(user.image ?? null);
            setImageFile(null);
        }
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            resetForm();
        }
        onOpenChange(isOpen);
    };

    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="w-[calc(100vw-1.5rem)] max-w-4xl gap-0 overflow-hidden p-0"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                {/* Top accent bar */}
                <div className="h-1 w-full bg-linear-to-r from-orange-400 via-[#FF5100] to-orange-400" />

                <DialogHeader className="border-b px-6 py-5">
                    <DialogTitle className="text-base font-bold text-zinc-900">
                        Edit Profile
                    </DialogTitle>
                    <DialogDescription className="text-sm text-zinc-400">
                        Update your personal information and profile picture.
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
                            className="space-y-6"
                        >
                            {/* ── Avatar ──────────────────────────────────── */}
                            <div>
                                <SectionLabel
                                    icon={Camera}
                                    title="Profile Picture"
                                />
                                <div className="flex items-center gap-5">
                                    <div className="relative shrink-0">
                                        {imagePreview ? (
                                            <div className="h-20 w-20 rounded-2xl border-2 border-orange-100 overflow-hidden shadow-md">
                                                <Image
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    width={80}
                                                    height={80}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-20 w-20 rounded-2xl border-2 border-orange-100 bg-linear-to-br from-orange-400 to-[#FF5100] flex items-center justify-center shadow-md">
                                                <span className="text-2xl font-bold text-white">
                                                    {initials}
                                                </span>
                                            </div>
                                        )}
                                        {/* {(imagePreview || imageFile) && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-zinc-800 text-white flex items-center justify-center hover:bg-red-500 transition-colors duration-150 shadow cursor-pointer"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        )} */}
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
                                                ? "Change Photo"
                                                : "Upload Photo"}
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

                            {/* ── Personal Info ────────────────────────────── */}
                            <div>
                                <SectionLabel
                                    icon={User}
                                    title="Personal Info"
                                />
                                <div className="space-y-4">
                                    {/* Name — full width */}
                                    <form.Field name="name">
                                        {(field) => (
                                            <AppField
                                                field={field}
                                                label="Full Name"
                                                placeholder="Enter your full name"
                                                disabled={isPending}
                                            />
                                        )}
                                    </form.Field>

                                    {/* Mobile + Gender — responsive grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <form.Field name="mobileNumber">
                                            {(field) => (
                                                <AppField
                                                    field={field}
                                                    label="Mobile Number"
                                                    placeholder="01XXXXXXXXX"
                                                    disabled={isPending}
                                                />
                                            )}
                                        </form.Field>

                                        {/* Gender */}
                                        <form.Field name="gender">
                                            {(field) => {
                                                const firstError =
                                                    field.state.meta
                                                        .isTouched &&
                                                    field.state.meta.errors
                                                        .length > 0
                                                        ? field.state.meta
                                                              .errors[0]
                                                        : null;

                                                return (
                                                    <div className="flex flex-col gap-1.5">
                                                        <Label
                                                            htmlFor="gender"
                                                            className={cn(
                                                                "text-sm font-medium",
                                                                firstError
                                                                    ? "text-red-500"
                                                                    : "text-zinc-600",
                                                            )}
                                                        >
                                                            Gender
                                                        </Label>
                                                        <Select
                                                            value={
                                                                field.state
                                                                    .value
                                                            }
                                                            onValueChange={(
                                                                val,
                                                            ) => {
                                                                field.handleChange(
                                                                    val as GenderEnum,
                                                                );
                                                                field.handleBlur();
                                                            }}
                                                            disabled={isPending}
                                                        >
                                                            <SelectTrigger
                                                                id="gender"
                                                                className={cn(
                                                                    "w-full h-25 border rounded-lg shadow-sm transition-all duration-200",
                                                                    firstError
                                                                        ? "border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.08)]"
                                                                        : "border-zinc-200 focus:border-[#FF5100] focus:shadow-[0_0_0_3px_rgba(255,81,0,0.08)]",
                                                                )}
                                                            >
                                                                <SelectValue placeholder="Select gender" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem
                                                                    value={
                                                                        GenderEnum.MALE
                                                                    }
                                                                >
                                                                    Male
                                                                </SelectItem>
                                                                <SelectItem
                                                                    value={
                                                                        GenderEnum.FEMALE
                                                                    }
                                                                >
                                                                    Female
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        {firstError && (
                                                            <p className="text-xs text-red-500">
                                                                {typeof firstError ===
                                                                "string"
                                                                    ? firstError
                                                                    : "Invalid gender"}
                                                            </p>
                                                        )}
                                                    </div>
                                                );
                                            }}
                                        </form.Field>
                                    </div>
                                </div>
                            </div>

                            {/* ── Documents ───────────────────────────────── */}
                            <div>
                                <SectionLabel icon={IdCard} title="Documents" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <form.Field name="licenseNumber">
                                        {(field) => (
                                            <AppField
                                                field={field}
                                                label="License Number"
                                                placeholder="Enter license number"
                                                disabled={isPending}
                                            />
                                        )}
                                    </form.Field>

                                    <form.Field name="nidNumber">
                                        {(field) => (
                                            <AppField
                                                field={field}
                                                label="NID Number"
                                                placeholder="10 or 13 digit NID"
                                                disabled={isPending}
                                            />
                                        )}
                                    </form.Field>
                                </div>
                            </div>

                            {/* ── Footer ──────────────────────────────────── */}
                            <div className="flex items-center gap-3 border-t border-zinc-100 pt-4">
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={isPending}
                                        className="h-10 flex-1 cursor-pointer border-zinc-200 text-zinc-700"
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
