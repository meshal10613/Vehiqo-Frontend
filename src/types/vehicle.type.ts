import { IBooking } from "./booking.type";
import { Fuel, Transmission, VehicleStatus } from "./enum.type";
import { IFuelPrice } from "./fuelPrice.type";
import { IReview } from "./review.type";
import { IVehicleType } from "./vehicleType.type";

export interface IVehicle {
    id: string;
    brand: string;
    model: string;
    year: number;
    plateNo: string;
    color?: string | null;
    transmission: Transmission;
    seats?: number | null;
    fuelType: Fuel;
    pricePerDay: number;
    mileage?: number | null;
    range?: number | null;
    engineCC?: number | null;
    status: VehicleStatus;
    description?: string | null;
    features: string[];
    image: string[];
    vehicleTypeId: string;
    vehicleType?: IVehicleType;
    fuel?: IFuelPrice;
    createdAt: Date;
    updatedAt: Date;

    bookings: IBooking[];
}
