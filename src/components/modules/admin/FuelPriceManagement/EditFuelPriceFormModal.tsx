"use client";

import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IFuelPrice } from "../../../../types/fuelPrice.type";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
// import { updateFuelPriceAction } from "../../../../app/(dashboardLayout)/admin/dashboard/fuel-price-management/_action";
import { z } from "zod";
import { updateFuelPriceAction } from "../../../../services/fuelPrice-services";

interface EditFuelPriceFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fuelPrice: IFuelPrice | null;
}

const priceSchema = z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Price must be a positive number",
    });

const ReadonlyField = ({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) => (
    <div className="space-y-1.5">
        <Label className="text-sm font-medium text-zinc-500">{label}</Label>
        <div className="bg-muted text-muted-foreground rounded-md border px-3 py-2 text-sm">
            {value}
        </div>
    </div>
);

export default function EditFuelPriceFormModal({
    open,
    onOpenChange,
    fuelPrice,
}: EditFuelPriceFormModalProps) {
    const queryClient = useQueryClient();

    const { mutateAsync, isPending } = useMutation({
        mutationFn: ({
            fuelPriceId,
            payload,
        }: {
            fuelPriceId: string;
            payload: { pricePerUnit: number };
        }) => updateFuelPriceAction(fuelPriceId, payload),
    });

    const form = useForm({
        defaultValues: {
            pricePerUnit: fuelPrice?.pricePerUnit?.toString() ?? "",
        },
        onSubmit: async ({ value }) => {
            if (!fuelPrice) {
                toast.error("Fuel price not found");
                return;
            }

            const result = await mutateAsync({
                fuelPriceId: fuelPrice.id,
                payload: { pricePerUnit: Number(value.pricePerUnit) },
            });

            if (!result?.success) {
                toast.error(result?.message || "Failed to update fuel price");
                return;
            }

            toast.success(result?.message || "Fuel price updated successfully");
            onOpenChange(false);

            void queryClient.invalidateQueries({ queryKey: ["fuel-price"] });
        },
    });

    // reset form when fuelPrice changes
    const handleOpenChange = (isOpen: boolean) => {
        if (isOpen) {
            form.reset({
                pricePerUnit: fuelPrice?.pricePerUnit?.toString() ?? "",
            });
        }
        onOpenChange(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="w-[calc(100vw-1.5rem)] max-w-md gap-0 overflow-hidden p-0"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                {/* Top accent bar */}
                <div className="h-1 w-full bg-linear-to-r from-orange-400 via-[#FF5100] to-orange-400" />

                <DialogHeader className="border-b px-6 py-5">
                    <DialogTitle>Edit Fuel Price</DialogTitle>
                    <DialogDescription>
                        Update the price per unit for this fuel type.
                    </DialogDescription>
                </DialogHeader>

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
                        className="space-y-4"
                    >
                        {/* Readonly fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <ReadonlyField
                                label="Fuel Type"
                                value={fuelPrice?.fuelType ?? "—"}
                            />
                            <ReadonlyField
                                label="Unit"
                                value={fuelPrice?.unit ?? "—"}
                            />
                        </div>

                        <ReadonlyField
                            label="Vehicles Using This Fuel"
                            value={
                                fuelPrice?.vehicle?.length
                                    ? `${fuelPrice.vehicle.length} ${fuelPrice.vehicle.length === 1 ? "vehicle" : "vehicles"}`
                                    : "No vehicles"
                            }
                        />

                        {/* Editable field */}
                        <form.Field
                            name="pricePerUnit"
                            validators={{
                                onChange: priceSchema,
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
                                            htmlFor="pricePerUnit"
                                            className="text-sm font-medium"
                                        >
                                            Price Per Unit (৳)
                                        </Label>
                                        <Input
                                            id="pricePerUnit"
                                            type="string"
                                            placeholder="Enter price per unit"
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value,
                                                )
                                            }
                                            onBlur={field.handleBlur}
                                            className={
                                                firstError
                                                    ? "border-destructive focus-visible:ring-destructive/20 h-10"
                                                    : "focus-visible:border-[#FF5100] focus-visible:ring-[#FF5100]/20 h-10"
                                            }
                                        />
                                        {firstError && (
                                            <p className="text-sm text-destructive">
                                                {typeof firstError === "string"
                                                    ? firstError
                                                    : "Invalid value"}
                                            </p>
                                        )}
                                    </div>
                                );
                            }}
                        </form.Field>

                        <div className="flex items-center justify-end gap-3 border-t pt-4">
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isPending}
                                    className="h-10 w-fit cursor-pointer flex-1"
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
                                        isPending={isSubmitting || isPending}
                                        pendingLabel="Updating..."
                                        disabled={!canSubmit}
                                        className="w-auto min-w-32 h-10 cursor-pointer flex-1"
                                    >
                                        Update Price
                                    </AppSubmitButton>
                                )}
                            </form.Subscribe>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// export default EditFuelPriceFormModal;
