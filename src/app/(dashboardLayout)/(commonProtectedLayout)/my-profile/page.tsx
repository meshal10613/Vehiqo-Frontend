import type { Metadata } from "next";
import { getUserInfo } from "../../../../services/auth.services";
import MyProfile from "../../../../components/modules/common/MyProfile";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export const metadata: Metadata = {
    title: "My Profile | Vehiqo",
    description: "Manage your vehicle rental system from the admin dashboard.",
};

export default async function MyProfilePage() {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ["user"],
        queryFn: () => getUserInfo(),
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 6, // 6 hour
    });
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <MyProfile />
        </HydrationBoundary>
    );
}
