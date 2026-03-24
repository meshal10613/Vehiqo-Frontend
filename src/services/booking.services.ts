"use server";

import { httpClient } from "../lib/axios/httpClient";
import { IBooking } from "../types/booking.type";
import { BookingStatus } from "../types/enum.type";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

interface ICreateBookingPayload {
    vehicleId: string;
    startDate: string; // "YYYY-MM-DD"
    endDate: string; // "YYYY-MM-DD"
    advanceAmount: number;
    notes?: string; // omitted entirely if not provided
}

export const createBooking = async (payload: ICreateBookingPayload) => {
    try {
        const result = await httpClient.post<IBooking>(`/booking`, payload);
        return result;
    } catch (error: any) {
        console.error("Error creating bookings:", error);
        return error.response.data;
    }
};

export const getMyBooking = async (queryString?: string) => {
    try {
        const result = await httpClient.get<IBooking[]>(
            queryString
                ? `/booking/my-booking?${queryString}`
                : `/booking/my-booking`,
        );
        return result;
    } catch (error: any) {
        console.error("Error fetching my bookings:", error);
        return error.response.data;
    }
};

export const cancelBooking = async ({
    id,
    status,
}: {
    id: string;
    status: BookingStatus;
}) => {
    try {
        const result = await httpClient.patch<IBooking>(`/booking/${id}`, {
            status,
        });
        return result;
    } catch (error: any) {
        console.error("Error fetching my bookings:", error);
        return error.response.data;
    }
};

export const updateBooking = async (
    id: string,
    payload: { status?: BookingStatus; pickedUpAt?: string, returnedAt?: string },
) => {
    try {
        const result = await httpClient.patch<IBooking>(
            `/booking/${id}`,
            payload,
        );

        return result;
    } catch (error: any) {
        console.error("Error updating my bookings:", error);
        return error.response.data;
    }
};

export const getBookingById = async (id: string) => {
    try {
        const result = await httpClient.get<IBooking[]>(`/booking/${id}`);
        return result;
    } catch (error: any) {
        console.error("Error fetching booking:", error);
        return error.response.data;
    }
};
