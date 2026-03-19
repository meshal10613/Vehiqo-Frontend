import { z } from "zod";

export const createVehicleTypeSchema = z
    .object({
        name: z
            .string({
                message: "Vehicle type name must be a string",
            })
            .min(2, { message: "Name must be at least 2 characters" })
            .max(50, { message: "Name must not exceed 50 characters" })
            .trim()
            .transform((val) => val.replace(/\s+/g, " ")),

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

        isElectric: z
            .boolean({
                message: "isElectric must be a boolean",
            })
            .optional(),

        requiresLicense: z
            .boolean({
                message: "requiresLicense must be a boolean",
            })
            .optional(),

        categoryId: z
            .string({
                message: "Category ID must be a string",
            })
            .uuid({
                message: "Category ID must be a valid UUID",
            }),
    })
    .strict();

export const updateVehicleTypeSchema = z
    .object({
        name: z
            .string({
                message: "Vehicle type name must be a string",
            })
            .min(2, { message: "Name must be at least 2 characters" })
            .max(50, { message: "Name must not exceed 50 characters" })
            .trim()
            .transform((val) => val.replace(/\s+/g, " "))
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

        isElectric: z
            .boolean({
                message: "isElectric must be a boolean",
            })
            .optional(),

        requiresLicense: z
            .boolean({
                message: "requiresLicense must be a boolean",
            })
            .optional(),

        categoryId: z
            .string({
                message: "Category ID must be a string",
            })
            .uuid({
                message: "Category ID must be a valid UUID",
            })
            .optional(),
    })
    .refine((data) => Object.values(data).some((val) => val !== undefined), {
        message: "At least one field must be provided for update",
    });

/**
 * Payload Types
 */
export type ICreateVehicleTypePayload = z.infer<typeof createVehicleTypeSchema>;

export type IUpdateVehicleTypePayload = z.infer<typeof updateVehicleTypeSchema>;
