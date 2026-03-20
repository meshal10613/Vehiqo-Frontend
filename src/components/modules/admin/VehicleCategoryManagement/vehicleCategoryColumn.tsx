import { ColumnDef } from "@tanstack/react-table";
import { IFuelPrice } from "../../../../types/fuelPrice.type";
import DateCell from "../../../shared/cell/DateCell";
import { IVehicleCategory } from "../../../../types/vehicleCategory.type";

export const vehicleCategoryColumn: ColumnDef<IVehicleCategory>[] = [
	{
		id: "name",
		accessorKey: "name",
		header: "Name",
	},
	{
		id: "types._count",
		accessorKey: "vehicleTypeCount",
		header: "Vehicle Type",
		cell: ({ row }) => {
			const vehicleType = row.original.types;
			return <span className="text-sm">{vehicleType?.length ?? 0}</span>;
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
