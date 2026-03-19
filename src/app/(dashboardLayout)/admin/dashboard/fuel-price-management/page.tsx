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

export default async function FuelPriceManagementPage() {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ["fuel-price"],
        queryFn: () => getAllFuelPrice(),
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 6, // 6 hour
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <FuelPriceTable />
        </HydrationBoundary>
    );
}
