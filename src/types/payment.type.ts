import { IBooking } from "./booking.type";
import { PaymentMethod, PaymentStatus, PaymentType } from "./enum.type";

export interface IPayment {
    id: string;
    type: PaymentType;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    transactionId?: string | null;
    stripeEventId?: string | null;
    note?: string | null;
    paidAt?: Date | null;
    invoiceUrl?: string | null;
    
    bookingId: string;
    booking?: IBooking;

    createdAt: Date;
    updatedAt: Date;
}
