import { ColumnDef } from "@tanstack/react-table";
import { IFuelPrice } from "../../../../types/fuelPrice.type";
import DateCell from "../../../shared/cell/DateCell";

export const fuelPriceColumn: ColumnDef<IFuelPrice>[] = [
    {
        id: "fuelType",
        accessorKey: "fuelType",
        header: "Fuel Type",
    },
    {
        id: "unit",
        accessorKey: "unit",
        header: "Unit",
    },
    {
        id: "pricePerUnit",
        accessorKey: "pricePerUnit",
        header: "Price Per Unit",
    },
    {
        id: "vehicle",
        accessorKey: "vehicle",
        header: "Vehicle",
        cell: ({ row }) => {
            const vehicles = row.original.vehicle;

            if (!vehicles || vehicles.length === 0) {
                return (
                    <span className="text-xs text-muted-foreground">
                        No Vehicles
                    </span>
                );
            }

            return (
                <span className="text-sm text-zinc-500">
                    {vehicles.length}{" "}
                    {vehicles.length === 1 ? "vehicle" : "vehicles"}
                </span>
            );
        },
    },
    {
        id: "updatedAt",
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ row }) => {
            return (
                <DateCell
                    date={row.original.updatedAt}
                    formatString="MMM dd, yyyy"
                />
            );
        },
    },
];
