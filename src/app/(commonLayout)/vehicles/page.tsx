export const dynamic = 'force-dynamic';

import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";
import { getAllVehicles } from "../../../services/vehicle.services";
import Vehicles from "../../../components/modules/common/Vehicles";

export const metadata: Metadata = {
    title: "Vehicles | Vehiqo",
    description: "Manage your vehicle rental system from the admin dashboard.",
};

export default async function VehiclesPage({
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
        queryKey: ["vehicle", queryString],
        queryFn: () => getAllVehicles(queryString),
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 6, // 6 hour
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Vehicles initialQueryString={queryString} />
        </HydrationBoundary>
    );
}
