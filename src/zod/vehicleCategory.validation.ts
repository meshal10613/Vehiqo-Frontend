import { z } from "zod";

export const createVehicleCategorySchema = z.object({
    name: z
        .string({
            message: "Category name must be a string",
        })
        .min(2, { message: "Name must be at least 2 characters" })
        .max(50, { message: "Name must not exceed 50 characters" })
        .trim()
        .transform((val) => val.replace(/\s+/g, " ")), // collapse multiple spaces

    description: z
        .string({ message: "Description must be a string" })
        .min(10, { message: "Description must be at least 10 characters" })
        .max(500, { message: "Description must not exceed 500 characters" })
        .trim()
        .optional(),

    image: z
        .instanceof(File, { message: "Image must be a file" })
        .refine((file) => file.size <= 2 * 1024 * 1024, {
            message: "Image must be less than 2MB",
        })
        .refine(
            (file) =>
                ["image/jpeg", "image/png", "image/webp"].includes(file.type),
            {
                message: "Only JPG, PNG, or WEBP images are allowed",
            },
        )
        .optional(),
});

export const updateVehicleCategorySchema = z
    .object({
        name: z
            .string({ message: "Category name must be a string" })
            .min(2, { message: "Name must be at least 2 characters" })
            .max(50, { message: "Name must not exceed 50 characters" })
            .trim()
            .transform((val) => val.replace(/\s+/g, " "))
            .optional(),

        description: z
            .string({ message: "Description must be a string" })
            .min(10, { message: "Description must be at least 10 characters" })
            .max(500, { message: "Description must not exceed 500 characters" })
            .trim()
            .optional(),

        image: z
            .instanceof(File, { message: "Image must be a file" })
            .refine((file) => file.size <= 2 * 1024 * 1024, {
                message: "Image must be less than 2MB",
            })
            .refine(
                (file) =>
                    ["image/jpeg", "image/png", "image/webp"].includes(
                        file.type,
                    ),
                {
                    message: "Only JPG, PNG, or WEBP images are allowed",
                },
            )
            .optional(),
    })
    .refine((data) => Object.values(data).some((val) => val !== undefined), {
        message: "At least one field must be provided for update",
    });

export type ICreateVehicleCategoryPayload = z.infer<
    typeof createVehicleCategorySchema
>;

export type IUpdateVehicleCategoryPayload = z.infer<
    typeof updateVehicleCategorySchema
>;
