import { Fuel, Unit } from "./enum.type";

export interface IFuelPrice {
    id: string;
    fuelType: Fuel;
    pricePerUnit: number;
    unit: Unit;
    createdAt: Date;
    updatedAt: Date;
}
