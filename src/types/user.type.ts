import { IBooking } from "./booking.type";
import { Gender, UserRole } from "./enum.type";
import { IReview } from "./review.type";

export interface IUser {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;

    gender?: Gender;
    mobileNumber?: string | null;
    role: UserRole;
    licenseNumber?: string | null;
    nidNumber?: string | null;

    reviews: IReview[];
    bookings: IBooking[];
}
