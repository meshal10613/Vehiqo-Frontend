import { Metadata } from "next";
import { getVehicleById } from "../../../../services/vehicle.services";
import { IVehicle } from "../../../../types/vehicle.type";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import VehicleDetails from "../../../../components/modules/common/VehicleDetails";

export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata> {
    const { id } = await params;
    const vehicle = await getVehicleById(id);

    if (!vehicle.success) {
        return {
            title: "Vehicle Not Found | Vehiqo",
        };
    }

    const { brand, model, year } = vehicle.data as IVehicle;
    const name = `${brand} ${model} ${year}`;

    return {
        title: `${name} | Vehiqo`,
        description: `Rent the ${name} on Vehiqo. Browse details, pricing, and availability.`,
    };
}

export default async function VehicleDeatilsPage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = await params;
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ["vehicle"],
        queryFn: () => getVehicleById(id),
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 6, // 6 hour
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <VehicleDetails id={id} />
        </HydrationBoundary>
    );
}
