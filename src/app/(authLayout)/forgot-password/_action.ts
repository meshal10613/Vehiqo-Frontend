"use server";

import { httpClient } from "../../../lib/axios/httpClient";

interface ForgotPasswordResponse {
    success: boolean;
    message: string;
}

export const forgotPasswordAction = async (payload: { email: string }) => {
    try {
        const response = await httpClient.post<ForgotPasswordResponse>(
            "/auth/forgot-password",
            payload,
        );

        if (response.success) return response;
    } catch (error: any) {
        console.log(error.response.data);
        return {
            success: false,
            message: `forgot password failed: ${error.response.data.message}`,
        };
    }
};
