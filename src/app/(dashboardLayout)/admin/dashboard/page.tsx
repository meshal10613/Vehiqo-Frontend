export const dynamic = 'force-dynamic';

import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import type { Metadata } from "next";
import { getStats } from "../../../../services/stats.services";
import AdminDashboardStats from "../../../../components/modules/admin/DashboardManagement/AdminDashboardStats";

export const metadata: Metadata = {
    title: "Admin Dashboard | Vehiqo",
    description: "Manage your vehicle rental system from the admin dashboard.",
};

export default async function AdminDashboardPage() {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ["stats"],
        queryFn: () => getStats(),
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 6, // 6 hour
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <AdminDashboardStats />
        </HydrationBoundary>
    );
}
