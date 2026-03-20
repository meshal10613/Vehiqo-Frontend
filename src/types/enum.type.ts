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

export enum UserRoleEnum {
    ADMIN = "ADMIN",
    CUSTOMER = "CUSTOMER",
}

export enum TransmissionEnum {
    MANUAL = "MANUAL",
    AUTOMATIC = "AUTOMATIC",
    SEMI_AUTOMATIC = "SEMI_AUTOMATIC",
    NONE = "NONE",
}

export enum FuelEnum {
    PETROL = "PETROL",
    OCTANE = "OCTANE",
    DIESEL = "DIESEL",
    ELECTRIC = "ELECTRIC",
    HYBRID = "HYBRID",
    CNG = "CNG",
}

export enum VehicleStatusEnum {
    AVAILABLE = "AVAILABLE",
    BOOKED = "BOOKED",
    RENTED = "RENTED",
    MAINTENANCE = "MAINTENANCE",
    RETIRED = "RETIRED",
}

export enum UnitEnum {
    LITRE = "LITRE",
    KWH = "KWH",
    CUBIC_METRE = "CUBIC_METRE",
}

export enum PaymentTypeEnum {
    ADVANCE = "ADVANCE",
    FINAL = "FINAL",
    FULL = "FULL",
    REFUND = "REFUND",
}

export enum PaymentMethodEnum {
    CASH = "CASH",
    STRIPE = "STRIPE",
    SSLCOMMERZ = "SSLCOMMERZ",
    BKASH = "BKASH",
    NOGOD = "NOGOD",
}

export enum PaymentStatusEnum {
    UNPAID = "UNPAID",
    PENDING = "PENDING",
    PAID = "PAID",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED",
}

export enum BookingStatusEnum {
    PENDING = "PENDING",
    ADVANCE_PAID = "ADVANCE_PAID",
    PICKED_UP = "PICKED_UP",
    RETURNED = "RETURNED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}
