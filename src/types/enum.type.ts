export type UserRole = "ADMIN" | "CUSTOMER";

export type Transmission = "MANUAL" | "AUTOMATIC" | "SEMI_AUTOMATIC" | "NONE";

export type Fuel =
    | "PETROL"
    | "OCTANE"
    | "DIESEL"
    | "ELECTRIC"
    | "HYBRID"
    | "CNG";

export type VehicleStatus =
    | "AVAILABLE"
    | "BOOKED"
    | "RENTED"
    | "MAINTENANCE"
    | "RETIRED";

export type Unit = "LITRE" | "KWH" | "CUBIC_METRE";

export type PaymentType = "ADVANCE" | "FINAL" | "FULL" | "REFUND";

export type PaymentMethod =
    | "CASH"
    | "STRIPE"
    | "SSLCOMMERZ"
    | "BKASH"
    | "NOGOD";

export type PaymentStatus =
    | "UNPAID"
    | "PENDING"
    | "PAID"
    | "FAILED"
    | "REFUNDED";

export type BookingStatus =
    | "PENDING"
    | "ADVANCE_PAID"
    | "PICKED_UP"
    | "RETURNED"
    | "COMPLETED"
    | "CANCELLED";

export type Gender = "MALE" | "FEMALE";

export enum GenderEnum {
    MALE = "MALE",
    FEMALE = "FEMALE",
}
