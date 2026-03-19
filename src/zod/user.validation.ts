import z from "zod";
import { GenderEnum } from "../types/enum.type";

export const updateUserSchema = z
    .object({
        name: z
            .string({ message: "Name must be a string" })
            .min(2, { message: "Name must be at least 2 characters" })
            .max(100, { message: "Name must not exceed 100 characters" })
            .trim()
            .transform((val) => val.replace(/\s+/g, " "))
            .optional(),

        mobileNumber: z
            .string({ message: "Mobile number must be a string" })
            .regex(/^(?:\+8801|01)[3-9]\d{8}$/, {
                message: "Mobile number must be a valid Bangladeshi number",
            })
            .optional(),

        licenseNumber: z
            .string({ message: "License number must be a string" })
            .min(5, { message: "License number must be at least 5 characters" })
            .max(50, {
                message: "License number must not exceed 50 characters",
            })
            .trim()
            .optional(),

        nidNumber: z
            .string({ message: "NID number must be a string" })
            .regex(/^\d{10}(\d{3})?$/, {
                message: "NID number must be 10 or 13 digits",
            })
            .optional(),
        gender: z.nativeEnum(GenderEnum, { message: "Invalid gender" }).optional(),

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

export type IUpdateUserPayload = z.infer<typeof updateUserSchema>;
