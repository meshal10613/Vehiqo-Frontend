"use server";

import { httpClient } from "../lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "../types/api.type";
import { IFuelPrice } from "../types/fuelPrice.type";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getAllFuelPrice(queryString?: string) {
    try {
        const result = await httpClient.get<IFuelPrice[]>(
            queryString ? `/fuel-price?${queryString}` : "/fuel-price",
        );

        return result;
    } catch (error: any) {
        console.log("Error fetching fuel price:", error);
        return error.response.data;
    }
}

export async function updateFuelPriceAction(
    id: string,
    payload: { pricePerUnit: number },
): Promise<ApiResponse<IFuelPrice> | ApiErrorResponse> {
    try {
        const result = await httpClient.patch<IFuelPrice>(
            `/fuel-price/${id}`,
            payload,
        );

        return result;
    } catch (error: any) {
        console.log("Error fetching fuel price:", error);
        return {
            success: false,
            message:
                "Failed to update fuel price:" + error.response.data.message,
        };
    }
}
