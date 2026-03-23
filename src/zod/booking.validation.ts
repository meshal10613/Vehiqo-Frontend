import z from "zod";
import { BookingStatusEnum } from "../types/enum.type";

export const customerUpdateBookingSchema = z.object({
    notes: z.string().max(500).optional(),

    // The only status transition a customer may request is PENDING → CANCELLED.
    // The service enforces this; Zod just ensures the value is a valid enum member.
    status: z
        .nativeEnum(BookingStatusEnum)
        .optional()
        .refine((val) => val === undefined || val === BookingStatusEnum.CANCELLED, {
            message:
                "Customers can only cancel a booking. Other status changes require admin.",
        }),
}).strict();