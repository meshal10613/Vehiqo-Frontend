import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { getStats } from "../../../../services/stats.services";
import AdminDashboardStats from "../../../../components/modules/admin/DashboardManagement/AdminDashboardStats";
import CustomerDashboardStats from "../../../../components/modules/customer/DashboardManagement/CustomerDashboardStats";

export const metadata: Metadata = {
    title: "Dashboard | Vehiqo",
    description: "Manage your vehicle rental system from the dashboard.",
};

export default async function DashboardPage() {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ["stats"],
        queryFn: () => getStats(),
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 6, // 6 hour
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <CustomerDashboardStats />
        </HydrationBoundary>
    );
}
