"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse, ApiResponse } from "@/types/api.type";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { ILoginResponse } from "../../../types/auth.type";

export const loginAction = async (
    payload: ILoginPayload,
    redirectPath?: string,
): Promise<ApiResponse<ILoginResponse> | ApiErrorResponse> => {
    const parsedPayload = loginZodSchema.safeParse(payload);

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
            "/auth/login",
            parsedPayload.data,
        );

        const { accessToken, refreshToken, token, user } = response.data;

        await Promise.all(
            [
                accessToken
                    ? setTokenInCookies("accessToken", accessToken)
                    : null,
                refreshToken
                    ? setTokenInCookies("refreshToken", refreshToken)
                    : null,
                token
                    ? setTokenInCookies("better-auth.session_token", token)
                    : null,
            ].filter(Boolean),
        );

        if (user.emailVerified === false) {
            return {
                success: false,
                message: "Email not verified",
            };
        }

        return response;
    } catch (error: any) {
        console.log(error.response, "error");
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
                message: error,
            };
        }
        return {
            success: false,
            message: `Login failed: ${error.response.data}`,
        };
    }
};
