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