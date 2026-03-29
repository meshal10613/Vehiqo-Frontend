"use server";

import { httpClient } from "../lib/axios/httpClient";
import { IPayment } from "../types/payment.type";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getAllPayments(queryString?: string) {
    try {
        const result = await httpClient.get<IPayment[]>(
            queryString ? `/payment?${queryString}` : "/payment",
        );
        return result;
    } catch (error: any) {
        console.error("Error fetching payments:", error);
        return error.response.data;
    }
}

export async function getMyPayments(queryString?: string) {
    try {
        const result = await httpClient.get<IPayment[]>(
            queryString
                ? `/payment/my-payment?${queryString}`
                : "/payment/my-payment",
        );
        return result;
    } catch (error: any) {
        console.error("Error fetching my payments:", error);
        return error.response.data;
    }
}

export async function createAdvancePaymentSession(id: string) {
    try {
        const result = await httpClient.post<IPayment>(
            `/payment/create-session`,
            {
                bookingId: id,
            },
        );

        return result;
    } catch (error: any) {
        console.error("Error creating session:", error.response.data);
        return error.response.data;
    }
}

export async function createRemainingPaymentSession(id: string) {
    try {
        const result = await httpClient.post<IPayment>(
            `/payment/create-remaining-session`,
            {
                bookingId: id,
            },
        );

        return result;
    } catch (error: any) {
        console.error("Error creating session:", error);
        return error.response.data;
    }
}

export async function deletePayment(id: string) {
    try {
        const result = await httpClient.delete<IPayment>(`/payment/${id}`);

        return result;
    } catch (error: any) {
        console.error("Error deleting payment:", error);
        return error.response.data;
    }
}
