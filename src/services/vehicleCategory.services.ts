"use server";

import NodeFormData from "form-data";
import { axiosInstance } from "../lib/axios/axiosInstance";
import { httpClient } from "../lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "../types/api.type";
import { IVehicleCategory } from "../types/vehicleCategory.type";
import {
    createVehicleCategorySchema,
    ICreateVehicleCategoryPayload,
    IUpdateVehicleCategoryPayload,
    updateVehicleCategorySchema,
} from "../zod/vehicleCategory.validation";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getAllVehicleCategory(queryString?: string) {
    try {
        const result = await httpClient.get<IVehicleCategory[]>(
            queryString
                ? `/vehicle-category?${queryString}`
                : "/vehicle-category",
        );

        return result;
    } catch (error: any) {
        console.log("Error fetching fuel price:", error);
        return error.response.data;
    }
}

export async function createVehicleCategory(
    payload: ICreateVehicleCategoryPayload,
): Promise<ApiResponse<IVehicleCategory> | ApiErrorResponse> {
    const parsedPayload = createVehicleCategorySchema.safeParse(payload);

    if (!parsedPayload.success) {
        const firstError =
            parsedPayload.error.issues[0].message || "Invalid input";
        return { success: false, message: firstError };
    }

    try {
        const client = await axiosInstance();
        const d = parsedPayload.data;

        const formData = new NodeFormData(); // Node.js form-data — supports Buffer

        formData.append("name", d.name);
        if (d.description) formData.append("description", d.description);

        // Convert File → Buffer (File/Blob not supported server-side in axios)
        if (d.image instanceof File) {
            const arrayBuffer = await d.image.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            formData.append("image", buffer, {
                filename: d.image.name,
                contentType: d.image.type,
            });
        }

        const response = await client.post("/vehicle-category", formData, {
            headers: {
                ...formData.getHeaders(), // sets Content-Type: multipart/form-data; boundary=...
            },
        });

        return response.data;
    } catch (error: any) {
        console.error(
            error.response?.data ?? error,
            "createVehicleCategory error",
        );
        return {
            success: false,
            message: `Failed to create category: ${error.response?.data?.message ?? error.message}`,
        };
    }
}

export async function updateVehicleCategory(
    categoryId: string,
    payload: IUpdateVehicleCategoryPayload,
): Promise<ApiResponse<IVehicleCategory> | ApiErrorResponse> {
    const cleanedPayload = Object.fromEntries(
        Object.entries(payload).filter(
            ([, val]) => val !== "" && val !== undefined,
        ),
    );

    const parsedPayload = updateVehicleCategorySchema.safeParse(
        cleanedPayload as IUpdateVehicleCategoryPayload,
    );

    if (!parsedPayload.success) {
        const firstError =
            parsedPayload.error.issues[0].message || "Invalid input";
        return { success: false, message: firstError };
    }

    try {
        const client = await axiosInstance();
        const d = parsedPayload.data;

        const formData = new NodeFormData();

        if (d.name) formData.append("name", d.name);
        if (d.description) formData.append("description", d.description);

        if (d.image instanceof File) {
            const arrayBuffer = await d.image.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            formData.append("image", buffer, {
                filename: d.image.name,
                contentType: d.image.type,
            });
        }

        const response = await client.patch(
            `/vehicle-category/${categoryId}`,
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                },
            },
        );

        return response.data;
    } catch (error: any) {
        console.error(
            error.response?.data ?? error,
            "updateVehicleCategory error",
        );
        return {
            success: false,
            message: `Failed to update category: ${error.response?.data?.message ?? error.message}`,
        };
    }
}

export async function deleteVehicleCategory(
    categoryId: string,
): Promise<ApiResponse<IVehicleCategory> | ApiErrorResponse> {
    try {
        const client = await axiosInstance();

        const response = await client.delete(`/vehicle-category/${categoryId}`);
        console.log(response)
        return response.data;
    } catch (error: any) {
        console.error(
            error.response?.data ?? error,
            "deleteVehicleCategory error",
        );
        return {
            success: false,
            message: `Failed to delete category: ${error.response?.data?.message ?? error.message}`,
        };
    }
}
