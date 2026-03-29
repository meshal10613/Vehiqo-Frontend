export const dynamic = 'force-dynamic';

import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { getAllFuelPrice } from "../../../../../services/fuelPrice-services";
import FuelPriceTable from "../../../../../components/modules/admin/FuelPriceManagement/FuelPriceTable";

export const metadata: Metadata = {
    title: "Fuel Price Management | Vehiqo",
    description: "Manage your vehicle rental system from the admin dashboard.",
};

export default async function FuelPriceManagementPage({
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
        queryKey: ["fuel-price", queryString],
        queryFn: () => getAllFuelPrice(queryString),
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 6, // 6 hour
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <FuelPriceTable initialQueryString={queryString} />
        </HydrationBoundary>
    );
}
