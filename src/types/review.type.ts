import { IBooking } from "./booking.type";
import { IUser } from "./user.type";

export interface IReview {
    id: string;
    rating: number;
    comment: string;

    bookingId: string;
    booking?: IBooking;

    userId: string;
    user?: IUser;

    createdAt: Date;
    updatedAt: Date;
}
