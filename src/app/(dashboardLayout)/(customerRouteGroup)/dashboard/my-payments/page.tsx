export const dynamic = 'force-dynamic';

import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import type { Metadata } from "next";
import { getMyPayments } from "../../../../../services/payment.services";
import MyPaymentTable from "../../../../../components/modules/customer/MyPaymentManagement/MyPaymentTable";

export const metadata: Metadata = {
    title: "My Payments | Vehiqo",
    description: "Manage your vehicle rental system from the dashboard.",
};

export default async function MyPaymentsPage({
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
        queryKey: ["my-payments", queryString],
        queryFn: () => getMyPayments(queryString),
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 6, // 6 hour
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <MyPaymentTable initialQueryString={queryString} />
        </HydrationBoundary>
    );
}
