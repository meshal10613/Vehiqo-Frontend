import { BookingStatus } from "./enum.type";
import { IPayment } from "./payment.type";
import { IUser } from "./user.type";
import { IVehicle } from "./vehicle.type";

export interface IBooking {
    id: string;
    status: BookingStatus;
    startDate: Date;
    endDate: Date;
    pickedUpAt?: Date | null;
    returnedAt?: Date | null;
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
    vehicleId: string;
    vehicle?: IVehicle;
    customerId: string;
    customer?: IUser;
    createdAt: Date;
    updatedAt: Date;

    payments: IPayment[];
}
