import { IVehicleType } from "./vehicleType.type";

export interface IVehicleCategory {
    id: string;
    name: string;
    image?: string | null;
    description?: string | null;
    createdAt: Date;
    updatedAt: Date;
	types?: IVehicleType[]
}
