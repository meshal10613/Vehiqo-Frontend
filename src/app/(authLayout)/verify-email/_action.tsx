"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse, ApiResponse } from "@/types/api.type";
import { ILoginResponse } from "../../../types/auth.type";

interface OtpResponse {
    success: boolean;
    message: string;
}

export const verifyEmailAction = async (payload: {
    email: string;
    otp: string;
}) => {
    try {
        const response = await httpClient.post<OtpResponse>(
            "/auth/verify-email",
            payload,
        );

        if (response.success) return response;
    } catch (error: any) {
        console.log(error, "error");
        return {
            success: false,
            message: `verify email failed: ${error.response.data.message}`,
        };
    }
};
