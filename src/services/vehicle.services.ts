"use server";

import NodeFormData from "form-data";
import { axiosInstance } from "../lib/axios/axiosInstance";
import { httpClient } from "../lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "../types/api.type";
import { IVehicle } from "../types/vehicle.type";
import { createVehicleSchema, ICreateVehiclePayload, IUpdateVehiclePayload, updateVehicleSchema } from "../zod/vehicle.validation";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getAllVehicles(queryString?: string) {
    try {
        const result = await httpClient.get<IVehicle[]>(
            queryString ? `/vehicle?${queryString}` : "/vehicle",
        );
        return result;
    } catch (error: any) {
        console.error("Error fetching vehicles:", error);
        return error.response.data;
    }
}

export async function getVehicleById(vehicleId: string) {
    try {
        const result = await httpClient.get<IVehicle>(`/vehicle/${vehicleId}`);
        return result;
    } catch (error: any) {
        console.error("Error fetching vehicle:", error);
        return error.response.data;
    }
}

export async function createVehicle(
    payload: ICreateVehiclePayload,
): Promise<ApiResponse<IVehicle> | ApiErrorResponse> {
    const parsedPayload = createVehicleSchema.safeParse(payload);

    if (!parsedPayload.success) {
        const firstError =
            parsedPayload.error.issues[0].message || "Invalid input";
        return { success: false, message: firstError };
    }

    try {
        const client = await axiosInstance();
        const d = parsedPayload.data;

        const formData = new NodeFormData();

        formData.append("brand", d.brand);
        formData.append("model", d.model);
        formData.append("year", d.year);
        formData.append("plateNo", d.plateNo);
        formData.append("transmission", d.transmission);
        formData.append("fuelType", d.fuelType);
        formData.append("pricePerDay", d.pricePerDay);
        formData.append("vehicleTypeId", d.vehicleTypeId);

        if (d.color) formData.append("color", d.color);
        if (d.seats !== undefined) formData.append("seats", String(d.seats));
        if (d.mileage !== undefined)
            formData.append("mileage", String(d.mileage));
        if (d.range !== undefined) formData.append("range", String(d.range));
        if (d.engineCC !== undefined)
            formData.append("engineCC", String(d.engineCC));
        if (d.description) formData.append("description", d.description);
        if (d.status) formData.append("status", d.status);

        // features array
        if (d.features && d.features.length > 0) {
            d.features.forEach((feature) =>
                formData.append("features", feature),
            );
        }

        // images array (multiple files)
        if (d.image && d.image.length > 0) {
            for (const file of d.image) {
                if (file instanceof File) {
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    formData.append("image", buffer, {
                        filename: file.name,
                        contentType: file.type,
                    });
                }
            }
        }

        const response = await client.post("/vehicle", formData, {
            headers: { ...formData.getHeaders() },
        });

        return response.data;
    } catch (error: any) {
        console.error(error.response?.data ?? error, "createVehicle error");
        return {
            success: false,
            message: `Failed to create vehicle: ${error.response?.data?.message ?? error.message}`,
        };
    }
}

export async function updateVehicle(
    vehicleId: string,
    payload: IUpdateVehiclePayload,
): Promise<ApiResponse<IVehicle> | ApiErrorResponse> {
    const cleanedPayload = Object.fromEntries(
        Object.entries(payload).filter(
            ([, val]) => val !== "" && val !== undefined,
        ),
    );

    const parsedPayload = updateVehicleSchema.safeParse(
        cleanedPayload as IUpdateVehiclePayload,
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

        if (d.brand) formData.append("brand", d.brand);
        if (d.model) formData.append("model", d.model);
        if (d.year !== undefined) formData.append("year", String(d.year));
        if (d.plateNo) formData.append("plateNo", d.plateNo);
        if (d.color) formData.append("color", d.color);
        if (d.transmission) formData.append("transmission", d.transmission);
        if (d.seats !== undefined) formData.append("seats", String(d.seats));
        if (d.fuelType) formData.append("fuelType", d.fuelType);
        if (d.pricePerDay !== undefined)
            formData.append("pricePerDay", String(d.pricePerDay));
        if (d.mileage !== undefined)
            formData.append("mileage", String(d.mileage));
        if (d.range !== undefined) formData.append("range", String(d.range));
        if (d.engineCC !== undefined)
            formData.append("engineCC", String(d.engineCC));
        if (d.status) formData.append("status", d.status);
        if (d.description) formData.append("description", d.description);
        if (d.vehicleTypeId) formData.append("vehicleTypeId", d.vehicleTypeId);

        // features array
        if (d.features && d.features.length > 0) {
            d.features.forEach((feature) =>
                formData.append("features", feature),
            );
        }

        // images array (multiple files)
        if (d.image && d.image.length > 0) {
            for (const file of d.image) {
                if (file instanceof File) {
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    formData.append("image", buffer, {
                        filename: file.name,
                        contentType: file.type,
                    });
                }
            }
        }

        const response = await client.patch(`/vehicle/${vehicleId}`, formData, {
            headers: { ...formData.getHeaders() },
        });

        return response.data;
    } catch (error: any) {
        console.error(error.response?.data ?? error, "updateVehicle error");
        return {
            success: false,
            message: `Failed to update vehicle: ${error.response?.data?.message ?? error.message}`,
        };
    }
}

export async function deleteVehicle(
    vehicleId: string,
): Promise<ApiResponse<IVehicle> | ApiErrorResponse> {
    try {
        const client = await axiosInstance();
        const response = await client.delete(`/vehicle/${vehicleId}`);
        return response.data;
    } catch (error: any) {
        console.error(error.response?.data ?? error, "deleteVehicle error");
        return {
            success: false,
            message: `Failed to delete vehicle: ${error.response?.data?.message ?? error.message}`,
        };
    }
}
