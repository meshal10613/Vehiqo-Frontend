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
        cell: ({ row }) => {
            return (
                <span className="text-sm">৳{row.original.pricePerUnit}</span>
            );
        },
    },
    {
        id: "vehicleCount",
        accessorKey: "vehicleCount",
        header: "Vehicle",
        cell: ({ row }) => {
            const vehicles = row.original.vehicle;
            return <span className="text-sm">{vehicles.length}</span>;
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
