import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Metadata } from "next";
import { getAllBooking } from "../../../../../services/booking.services";
import AllBookingTable from "../../../../../components/modules/admin/BookingManagement/AllBookingTable";

export const metadata: Metadata = {
    title: "My Bookings | Vehiqo",
    description: "Manage your vehicle rental system from the dashboard.",
};

export default async function BookingsManagementPage({
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
        queryKey: ["bookings", queryString],
        queryFn: () => getAllBooking(queryString),
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 6, // 6 hour
    });

	return(
        <HydrationBoundary state={dehydrate(queryClient)}>
            <AllBookingTable initialQueryString={queryString} />
        </HydrationBoundary>
	)
}