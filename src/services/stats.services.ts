"use server";

import { httpClient } from "../lib/axios/httpClient";
import { IAdminStats, ICustomerStats, IPublicStats } from "../types/stats.type";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getStats() {
    try {
        const result = await httpClient.get<ICustomerStats | IAdminStats[]>(
            "/stats",
        );

        return result;
    } catch (error: any) {
        console.log("Error fetching stats:", error);
        return error.response.data;
    }
}

export async function getPublicStats() {
    try {
        const result = await httpClient.get<IPublicStats>(
            "/stats/public",
        );

        return result;
    } catch (error: any) {
        console.log("Error fetching stats:", error);
        return error.response.data;
    }
}
