import { Metadata } from "next";
import { getAllUsers } from "../../../../../services/user.services";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import UserManagementTable from "../../../../../components/modules/admin/UserManagement/UserTable";

export const metadata: Metadata = {
    title: "Users Management | Vehiqo",
    description: "Manage your vehicle rental system from the admin dashboard.",
};

export default async function UsersManagementPage({
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
        queryKey: ["users", queryString],
        queryFn: () => getAllUsers(queryString),
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 6, // 6 hour
    });
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <UserManagementTable initialQueryString={queryString} />
        </HydrationBoundary>
    );
}
