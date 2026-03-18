import { IVehicle } from "./vehicle.type";
import { IVehicleCategory } from "./vehicleCategory.type";

export interface IVehicleType {
    id: string;
    name: string;
    image?: string | null;
    isElectric: boolean;
    requiresLicense: boolean;
    categoryId: string;
    category?: IVehicleCategory;

	vehicles: IVehicle[]
}
