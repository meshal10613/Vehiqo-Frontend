"use server";

import NodeFormData from "form-data";
import { axiosInstance } from "../lib/axios/axiosInstance";
import { httpClient } from "../lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "../types/api.type";
import { IVehicleType } from "../types/vehicleType.type";
import {
    createVehicleTypeSchema,
    ICreateVehicleTypePayload,
    IUpdateVehicleTypePayload,
    updateVehicleTypeSchema,
} from "../zod/vehicleType.validation";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getAllVehicleType(queryString?: string) {
    try {
        const result = await httpClient.get<IVehicleType[]>(
            queryString ? `/vehicle-type?${queryString}` : "/vehicle-type",
        );

        return result;
    } catch (error) {
        console.error("Error fetching vehicle types:", error);
        throw error;
    }
}

export async function createVehicleType(
    payload: ICreateVehicleTypePayload,
): Promise<ApiResponse<IVehicleType> | ApiErrorResponse> {
    const parsedPayload = createVehicleTypeSchema.safeParse(payload);

    if (!parsedPayload.success) {
        const firstError =
            parsedPayload.error.issues[0].message || "Invalid input";
        return { success: false, message: firstError };
    }

    try {
        const client = await axiosInstance();
        const d = parsedPayload.data;

        const formData = new NodeFormData();

        formData.append("name", d.name);
        formData.append("categoryId", d.categoryId);
        if (d.isElectric !== undefined)
            formData.append("isElectric", String(d.isElectric));
        if (d.requiresLicense !== undefined)
            formData.append("requiresLicense", String(d.requiresLicense));

        if (d.image instanceof File) {
            const arrayBuffer = await d.image.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            formData.append("image", buffer, {
                filename: d.image.name,
                contentType: d.image.type,
            });
        }

        const response = await client.post("/vehicle-type", formData, {
            headers: { ...formData.getHeaders() },
        });

        return response.data;
    } catch (error: any) {
        console.error(error.response?.data ?? error, "createVehicleType error");
        return {
            success: false,
            message: `Failed to create vehicle type: ${error.response?.data?.message ?? error.message}`,
        };
    }
}

export async function updateVehicleType(
    typeId: string,
    payload: IUpdateVehicleTypePayload,
): Promise<ApiResponse<IVehicleType> | ApiErrorResponse> {
    const cleanedPayload = Object.fromEntries(
        Object.entries(payload).filter(
            ([, val]) => val !== "" && val !== undefined,
        ),
    );

    const parsedPayload = updateVehicleTypeSchema.safeParse(
        cleanedPayload as IUpdateVehicleTypePayload,
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
        if (d.categoryId) formData.append("categoryId", d.categoryId);
        if (d.isElectric !== undefined)
            formData.append("isElectric", String(d.isElectric));
        if (d.requiresLicense !== undefined)
            formData.append("requiresLicense", String(d.requiresLicense));

        if (d.image instanceof File) {
            const arrayBuffer = await d.image.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            formData.append("image", buffer, {
                filename: d.image.name,
                contentType: d.image.type,
            });
        }

        const response = await client.patch(
            `/vehicle-type/${typeId}`,
            formData,
            { headers: { ...formData.getHeaders() } },
        );

        return response.data;
    } catch (error: any) {
        console.error(error.response?.data ?? error, "updateVehicleType error");
        return {
            success: false,
            message: `Failed to update vehicle type: ${error.response?.data?.message ?? error.message}`,
        };
    }
}

export async function deleteVehicleType(
    typeId: string,
): Promise<ApiResponse<IVehicleType> | ApiErrorResponse> {
    try {
        const client = await axiosInstance();
        const response = await client.delete(`/vehicle-type/${typeId}`);
        return response.data;
    } catch (error: any) {
        console.error(error.response?.data ?? error, "deleteVehicleType error");
        return {
            success: false,
            message: `Failed to delete vehicle type: ${error.response?.data?.message ?? error.message}`,
        };
    }
}
