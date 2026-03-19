"use server";

import axios from "axios";
import { cookies, headers } from "next/headers";
import { isTokenExpiringSoon } from "../tokenUtils";
import { getNewTokensWithRefreshToken } from "../../services/auth.services";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined in environment variables");
}

// export async function tryRefreshToken(
// 	accessToken: string,
// 	refreshToken: string,
// ): Promise<void> {
// 	if (!isTokenExpiringSoon(accessToken)) {
// 		return;
// 	}

// 	const requestHeader = await headers();

// 	if (requestHeader.get("x-token-refreshed") === "1") {
// 		return; // avoid multiple refresh attempts in the same request lifecycle
// 	}

// 	try {
// 		await getNewTokensWithRefreshToken(refreshToken);
// 	} catch (error: any) {
// 		console.error("Error refreshing token in http client:", error);
// 	}
// }

export const axiosInstance = async () => {
    const cookieStore = await cookies();
    // const accessToken = cookieStore.get("accessToken")?.value;
    // const refreshToken = cookieStore.get("refreshToken")?.value;

    // if (accessToken && refreshToken) {
    //     await tryRefreshToken(accessToken, refreshToken);
    // }

    const freshCookieStore = await cookies();
    const cookieHeader = freshCookieStore
        .getAll()
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");
    // eg Cookie: "accessToken=abc123; refreshToken=def456"

    const instance = axios.create({
        baseURL: API_BASE_URL,
        timeout: 30000,
        headers: {
            "Content-Type": "application/json",
            Cookie: cookieHeader,
        },
    });

    return instance;
};
