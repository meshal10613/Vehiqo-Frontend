"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse, ApiResponse } from "@/types/api.type";
import { IRegisterPayload, registerZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";
import { ILoginResponse } from "../../../types/auth.type";

export const registerAction = async (
    payload: IRegisterPayload,
    redirectPath?: string,
): Promise<ApiResponse<ILoginResponse> | ApiErrorResponse> => {
    const parsedPayload = registerZodSchema.safeParse(payload);

    if (!parsedPayload.success) {
        const firstError =
            parsedPayload.error.issues[0].message || "Invalid input";
        return {
            success: false,
            message: firstError,
        };
    }
    try {
        const response = await httpClient.post<ILoginResponse>(
            "/auth/register",
            parsedPayload.data,
        );

        const { accessToken, refreshToken, token, user } = response.data;
        if (user.emailVerified === false) {
            return {
                success: false,
                message:
                    "Account created successfully. Please login to continue.",
            };
        }

        await setTokenInCookies("accessToken", accessToken);
        await setTokenInCookies("refreshToken", refreshToken);
        await setTokenInCookies(
            "better-auth.session_token",
            token,
            24 * 60 * 60,
        ); // 1 day in seconds

        return response;
    } catch (error: any) {
        console.log(error, "error");
        if (
            error &&
            typeof error === "object" &&
            "digest" in error &&
            typeof error.digest === "string" &&
            error.digest.startsWith("NEXT_REDIRECT")
        ) {
            throw error;
        }

        if (
            error &&
            error.response &&
            error.response.data.message === "Email not verified"
        ) {
            return {
                success: false,
                message: error.response.data.message,
            };
        }
        return {
            success: false,
            message: `Registration failed: ${error.response.data.message}`,
        };
    }
};
