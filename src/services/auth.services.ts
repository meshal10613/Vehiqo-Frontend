"use server";

import { setTokenInCookies } from "@/lib/tokenUtils";
import { cookies } from "next/headers";
import { IUpdateUserPayload, updateUserSchema } from "../zod/user.validation";
import { ApiErrorResponse, ApiResponse } from "../types/api.type";
import { IUser } from "../types/user.type";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getNewTokensWithRefreshToken(
    refreshToken: string,
): Promise<boolean> {
    try {
        const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Cookie: `refreshToken=${refreshToken}`,
                cache: "no-store",
            },
        });

        if (!res.ok) {
            return false;
        }

        const { data } = await res.json();

        const { accessToken, refreshToken: newRefreshToken, token } = data;

        await Promise.all(
            [
                accessToken
                    ? setTokenInCookies("accessToken", accessToken)
                    : null,
                newRefreshToken
                    ? setTokenInCookies("refreshToken", newRefreshToken)
                    : null,
                token
                    ? setTokenInCookies("better-auth.session_token", token)
                    : null,
            ].filter(Boolean),
        );

        return true;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return false;
    }
}

export async function getUserInfo() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const sessionToken = cookieStore.get(
            "better-auth.session_token",
        )?.value;

        if (!accessToken) {
            return null;
        }

        const res = await fetch(`${BASE_API_URL}/auth/me`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
            },
            // next: {
            //     tags: ["user"],
            //     revalidate: 60, // cache for 60 seconds
            // },
        });

        if (!res.ok) {
            console.error(
                "Failed to fetch user info:",
                res.status,
                res.statusText,
            );
            return null;
        }

        const { data } = await res.json();

        return data;
    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
}

export async function logoutUser() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const sessionToken = cookieStore.get(
            "better-auth.session_token",
        )?.value;

        // Call backend logout endpoint
        await fetch(`${BASE_API_URL}/auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
            },
        });

        // Clear all auth cookies
        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");
        cookieStore.delete("better-auth.session_token");

        return { success: true };
    } catch (error) {
        console.error("Error logging out:", error);
        return { success: false };
    }
}

export async function updateUserImage(
    image: File,
): Promise<ApiResponse<IUser> | ApiErrorResponse> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const sessionToken = cookieStore.get(
            "better-auth.session_token",
        )?.value;

        if (!accessToken) {
            return { success: false, message: "Unauthorized" };
        }

        // Convert File → Buffer (Node.js doesn't support Blob in fetch/FormData)
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const formData = new FormData();
        const blob = new Blob([buffer], { type: image.type });
        formData.append("image", blob, image.name);

        const res = await fetch(`${BASE_API_URL}/auth/update-profile`, {
            method: "PATCH",
            headers: {
                // ⚠️ DO NOT set Content-Type — fetch sets multipart/form-data + boundary automatically
                Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
            },
            body: formData,
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            return {
                success: false,
                message: error?.message || "Failed to update image",
            };
        }

        const { data } = await res.json();
        console.log(data);
        return {
            success: true,
            data,
            message: "Profile image updated successfully",
        };
    } catch (error: any) {
        console.error("Error updating user:", error);
        return {
            success: false,
            message: error?.message || "Something went wrong",
        };
    }
}
