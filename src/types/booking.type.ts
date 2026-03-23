import { BookingStatus } from "./enum.type";
import { IPayment } from "./payment.type";
import { IUser } from "./user.type";
import { IVehicle } from "./vehicle.type";

export interface IBooking {
    id: string;
    status: BookingStatus;

    startDate: string; // ISO string
    endDate: string;

    pickedUpAt?: string | null;
    returnedAt?: string | null;

    pricePerDay: number;
    totalDays: number;
    baseCost: number;
    advanceAmount: number;

    extraDays: number;
    lateFee: number;
    fuelCharge: number;
    fuelCredit: number;
    damageCharge: number;

    totalCost: number;
    remainingDue: number;

    notes?: string | null;

    fuelLevelPickup?: number | null;
    fuelLevelReturn?: number | null;

    cancelledAt?: string | null;
    cancelledBy?: string | null;
    cancellationReason?: string | null;

    vehicleId: string;
    customerId: string;

    createdAt: string;
    updatedAt: string;

    // Optional relations (if included)
    vehicle?: IVehicle;
    customer?: IUser;
    payments?: IPayment[];
}
