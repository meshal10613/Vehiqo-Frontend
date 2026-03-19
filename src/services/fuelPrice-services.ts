"use server";

import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getAllFuelPrice() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const sessionToken = cookieStore.get(
            "better-auth.session_token",
        )?.value;

        if (!accessToken) {
            return null;
        }
        const res = await fetch(`${BASE_API_URL}/fuel-price`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
            },
        });

        if (!res.ok) {
            console.error(
                "Failed to fetch fuel price info:",
                res.status,
                res.statusText,
            );
            return null;
        }

        const { data } = await res.json();

        return data;
    } catch (error: any) {
        console.error("Error fuel price:", error);
        return { success: false, message: error.response.data.message };
    }
}
