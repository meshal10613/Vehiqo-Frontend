import { Fuel, Unit } from "./enum.type";
import { IVehicle } from "./vehicle.type";

export interface IFuelPrice {
    id: string;
    fuelType: Fuel;
    pricePerUnit: number;
    unit: Unit;
    vehicle: IVehicle[];
    createdAt: Date;
    updatedAt: Date;
}
