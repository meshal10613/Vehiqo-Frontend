"use server";

import { httpClient } from "../../../../lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "../../../../types/api.type";
import { ILoginResponse } from "../../../../types/auth.type";
import { IUser } from "../../../../types/user.type";
import {
    IUpdateUserPayload,
    updateUserSchema,
} from "../../../../zod/user.validation";

export const updateProfileAction = async (
    payload: IUpdateUserPayload,
): Promise<ApiResponse<IUser> | ApiErrorResponse> => {
    const parsedPayload = updateUserSchema.safeParse(payload);

    if (!parsedPayload.success) {
        const firstError =
            parsedPayload.error.issues[0].message || "Invalid input";
        return {
            success: false,
            message: firstError,
        };
    }

    try {
        const response = await httpClient.patch<IUser>(
            "/auth/update-profile",
            parsedPayload.data,
        );

        return response;
    } catch (error: any) {
        console.log(error, "error");
        return {
            success: false,
            message: `profile update failed: ${error}`,
        };
    }
};
