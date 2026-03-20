import { ColumnDef } from "@tanstack/react-table";
import DateCell from "../../../shared/cell/DateCell";
import { IVehicleType } from "../../../../types/vehicleType.type";

export const vehicleTypeColumn: ColumnDef<IVehicleType>[] = [
    {
        id: "name",
        accessorKey: "name",
        header: "Name",
    },
    {
        id: "isElectric",
        accessorKey: "isElectric",
        header: "Is Electric",
    },
    {
        id: "requiresLicense",
        accessorKey: "requiresLicense",
        header: "Requires License",
    },
    {
        id: "category.name",
        accessorKey: "category.name",
        header: "Vehicle Category",
        cell: ({ row }) => {
            const vehicleType = row.original.category;
            return <span className="text-sm">{vehicleType?.name}</span>;
        },
    },
    {
        id: "vehicles._count",
        accessorKey: "vehicles._count",
        header: "Vehicle",
        cell: ({ row }) => {
            const vehicle = row.original.vehicles;
            return <span className="text-sm">{vehicle?.length ?? 0}</span>;
        },
    },
    {
        id: "createdAt",
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            return (
                <DateCell
                    date={row.original.createdAt}
                    formatString="MMM dd, yyyy"
                />
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
