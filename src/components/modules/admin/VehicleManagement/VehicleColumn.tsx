import { ColumnDef } from "@tanstack/react-table";
import { IVehicle } from "../../../../types/vehicle.type";
import { VehicleStatusEnum } from "../../../../types/enum.type";
import { Badge } from "../../../ui/badge";
import { cn } from "../../../../lib/utils";

const getStatusStyle = (status: VehicleStatusEnum) => {
    switch (status) {
        case VehicleStatusEnum.AVAILABLE:
            return "border-green-200 text-green-600 bg-green-50";
        case VehicleStatusEnum.BOOKED:
            return "border-blue-200 text-blue-600 bg-blue-50";
        case VehicleStatusEnum.RENTED:
            return "border-purple-200 text-purple-600 bg-purple-50";
        case VehicleStatusEnum.MAINTENANCE:
            return "border-yellow-200 text-yellow-600 bg-yellow-50";
        case VehicleStatusEnum.RETIRED:
            return "border-zinc-200 text-zinc-500 bg-zinc-50";
        default:
            return "border-zinc-200 text-zinc-500 bg-zinc-50";
    }
};

export const vehicleColumn: ColumnDef<IVehicle>[] = [
    {
        id: "brand",
        accessorKey: "brand",
        header: "Vehicle",
        cell: ({ row }) => {
            const { brand, model, year } = row.original;
            return (
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-900">
                        {brand} {model}
                    </span>
                    <span className="text-xs text-zinc-400">{year}</span>
                </div>
            );
        },
    },
    {
        id: "plateNo",
        accessorKey: "plateNo",
        header: "Plate No",
        cell: ({ row }) => (
            <span className="text-sm font-mono text-zinc-700">
                {row.original.plateNo}
            </span>
        ),
    },
    {
        id: "vehicleType.name",
        accessorKey: "vehicleType.name",
        header: "Type / Category",
        cell: ({ row }) => {
            const type = row.original.vehicleType;
            return (
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-900">
                        {type?.name ?? "—"}
                    </span>
                    <span className="text-xs text-zinc-400">
                        {type?.category?.name ?? "—"}
                    </span>
                </div>
            );
        },
    },
    {
        id: "fuelType",
        accessorKey: "fuelType",
        header: "Fuel",
        cell: ({ row }) => (
            <span className="text-sm text-zinc-700">
                {row.original.fuelType}
            </span>
        ),
    },
    {
        id: "transmission",
        accessorKey: "transmission",
        header: "Transmission",
        cell: ({ row }) => (
            <span className="text-sm text-zinc-700">
                {row.original.transmission.replace(/_/g, " ")}
            </span>
        ),
    },
    {
        id: "pricePerDay",
        accessorKey: "pricePerDay",
        header: "Price / Day",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#FF5100]">
                    ৳{row.original.pricePerDay.toLocaleString()}
                </span>
            </div>
        ),
    },
    {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status as VehicleStatusEnum;
            return (
                <Badge
                    variant="outline"
                    className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5",
                        getStatusStyle(status),
                    )}
                >
                    {status.replace(/_/g, " ")}
                </Badge>
            );
        },
    },
];
