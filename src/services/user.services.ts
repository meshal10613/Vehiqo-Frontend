"use server";

import { httpClient } from "../lib/axios/httpClient";
import { UserRole } from "../types/enum.type";
import { IUser } from "../types/user.type";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getAllUsers(queryString?: string) {
    try {
        const result = await httpClient.get<IUser[]>(
            queryString ? `/user?${queryString}` : "/user",
        );

        return result;
    } catch (error) {
        console.log("Error fetching user:", error);
        throw error;
    }
}

export async function updateUserRole(payload: {
    userId: string;
    role: UserRole;
}) {
    try {
        const result = await httpClient.patch<IUser>(
            `/auth/update-role`,
            payload,
        );

        return result;
    } catch (error) {
        console.log("Error update user role:", error);
        throw error;
    }
}

export async function deleteUser(id: string) {
    try {
        const result = await httpClient.delete<IUser>(
            `/auth/delete-account/${id}`,
        );

        return result;
    } catch (error: any) {
        console.log("Error delete user:", error.response);
        throw error;
    }
}
