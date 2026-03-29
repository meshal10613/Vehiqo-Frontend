export const dynamic = "force-dynamic";

import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Metadata } from "next";
import { getAllVehicleType } from "../../../../../services/vehicleType.services";
import VehicleTypeTable from "../../../../../components/modules/admin/VehicleTypeManagement/VehicleTypeTable";

export const metadata: Metadata = {
    title: "Vehicle Type Management | Vehiqo",
    description: "Manage your vehicle rental system from the admin dashboard.",
};

export default async function VehicleTypeManagementPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const queryParamsObjects = await searchParams;
    const queryString = Object.keys(queryParamsObjects)
        .map((key) => {
            const value = queryParamsObjects[key];
            if (value === undefined) {
                return "";
            }

            if (Array.isArray(value)) {
                return value
                    .map(
                        (v) =>
                            `${encodeURIComponent(key)}=${encodeURIComponent(v)}`,
                    )
                    .join("&");
            }

            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        })
        .filter(Boolean)
        .join("&");

    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ["vehicle-type", queryString],
        queryFn: () => getAllVehicleType(queryString),
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 6, // 6 hour
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <VehicleTypeTable initialQueryString={queryString} />
        </HydrationBoundary>
    );
}
