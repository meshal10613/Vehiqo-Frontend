import { IUser } from "./user.type";
import { IVehicle } from "./vehicle.type";

export interface IReview {
    id: string;
    rating: number;
    comment: string;
    vehicleId: string;
    vehicle?: IVehicle;
    userId: string;
    user?: IUser;
    createdAt: Date;
    updatedAt: Date;
}
