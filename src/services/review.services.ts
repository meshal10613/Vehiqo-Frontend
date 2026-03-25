"use server";

import { httpClient } from "../lib/axios/httpClient";
import { IReview } from "../types/review.type";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getAllReviews(queryString?: string) {
    try {
        const result = await httpClient.get<IReview[]>(
            queryString ? `/review?${queryString}` : "/review",
        );
        return result;
    } catch (error: any) {
        console.error("Error fetching reviews:", error);
        return error.response.data;
    }
}
export async function getMyReviews(queryString?: string) {
    try {
        const result = await httpClient.get<IReview[]>(
            queryString ? `/review/my-review?${queryString}` : "/review/my-review",
        );
        return result;
    } catch (error: any) {
        console.error("Error fetching reviews:", error);
        return error.response.data;
    }
}

export async function createReview(payload: {
    bookingId: string;
    rating: number;
    comment: string;
}) {
    try {
        const result = await httpClient.post<IReview>(`/review`, payload);
        return result;
    } catch (error: any) {
        console.error("Error creating review:", error);
        return error.response.data;
    }
}

export async function deleteReview(id: string) {
    try {
        const result = await httpClient.delete<IReview>(`/review/${id}`);
        return result;
    } catch (error: any) {
        console.error("Error deleting review:", error);
        return error.response.data;
    }
}

export async function updateReview(id: string, payload: { rating: number; comment: string }) {
    try {
        const result = await httpClient.patch<IReview>(`/review/${id}`, payload);
        return result;
    } catch (error: any) {
        console.error("Error updating review:", error);
        return error.response.data;
    }
}