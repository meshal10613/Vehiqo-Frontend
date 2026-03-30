export const dynamic = "force-dynamic";

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
    });
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <MyProfile />
        </HydrationBoundary>
    );
}
