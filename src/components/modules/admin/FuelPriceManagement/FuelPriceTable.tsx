"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllFuelPrice } from "../../../../services/fuelPrice-services";

export default function FuelPriceTable() {
    const {
        data: fuelPriceDataResponse,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ["fuel-price"],
        queryFn: () => getAllFuelPrice(),
    });

    return (
        <div>
            <h1>This is FuelPriceManagement Page</h1>
        </div>
    );
}
