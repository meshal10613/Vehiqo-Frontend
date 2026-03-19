"use server";

import { httpClient } from "../../../lib/axios/httpClient";

interface ResetPasswordResponse {
    success: boolean;
    message: string;
}

export const resetPasswordAction = async (payload: {
    email: string;
    otp: string;
    newPassword: string;
}) => {
    try {
        const response = await httpClient.post<ResetPasswordResponse>(
            "/auth/reset-password",
            payload,
        );

        if (response.success) return response;
    } catch (error: any) {
        console.log(error.response.data);
        return {
            success: false,
            message: `reset password failed: ${error.response.data.message}`,
        };
    }
};
