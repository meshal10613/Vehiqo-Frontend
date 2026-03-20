"use client";

import { useSearchParams } from "next/navigation";
import { useRowActionModalState } from "../../../../hooks/useRowActionModalState";
import { IVehicle } from "../../../../types/vehicle.type";
import { useServerManagedDataTable } from "../../../../hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "../../../../hooks/useServerManagedDataTableSearch";
import { useQuery } from "@tanstack/react-query";
import { getAllVehicles } from "../../../../services/vehicle.services";
import { PaginationMeta } from "../../../../types/api.type";
import DataTable from "../../../shared/table/DataTable";
import { vehicleColumn } from "./VehicleColumn";
// import CreateVehicleFormModal from "./CreateVehicleFormModal";
import {
    serverManagedFilter,
    useServerManagedDataTableFilters,
} from "../../../../hooks/useServerManagedDataTableFilters";
import {
    DataTableFilterConfig,
    DataTableFilterValues,
} from "../../../shared/table/DataTableFilters";
import { useMemo } from "react";
import { getAllVehicleType } from "../../../../services/vehicleType.services";
import { getAllVehicleCategory } from "../../../../services/vehicleCategory.services";
// import ViewVehicleDialog from "./ViewVehicleDialog";
// import DeleteVehicleFormModal from "./DeleteVehicleFormModal";
// import EditVehicleFormModal from "./EditVehicleFormModal";
import {
    Fuel,
    FuelEnum,
    Transmission,
    TransmissionEnum,
    VehicleStatus,
    VehicleStatusEnum,
} from "../../../../types/enum.type";
import ViewVehicleDialog from "./ViewVehicleDialog";
import CreateVehicleFormModal from "./CreateVehicleFormModal";
import DeleteVehicleFormModal from "./DeleteVehicleFormModal";
import EditVehicleFormModal from "./EditVehicleFormModal";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const VEHICLE_FILTER_DEFINITIONS = [
    serverManagedFilter.single("transmission"),
    serverManagedFilter.single("fuelType"),
    serverManagedFilter.single("status"),
    serverManagedFilter.multi("vehicleType.name"),
    serverManagedFilter.multi("vehicleType.categoryId"),
];

export default function VehicleTable({
    initialQueryString,
}: {
    initialQueryString: string;
}) {
    const searchParams = useSearchParams();

    const {
        viewingItem,
        editingItem,
        deletingItem,
        isViewDialogOpen,
        isEditModalOpen,
        isDeleteDialogOpen,
        onViewOpenChange,
        onEditOpenChange,
        onDeleteOpenChange,
        tableActions,
    } = useRowActionModalState<IVehicle>();

    const {
        queryStringFromUrl,
        optimisticSortingState,
        optimisticPaginationState,
        isRouteRefreshPending,
        updateParams,
        handleSortingChange,
        handlePaginationChange,
    } = useServerManagedDataTable({
        searchParams,
        defaultPage: DEFAULT_PAGE,
        defaultLimit: DEFAULT_LIMIT,
    });

    const { filterValues, handleFilterChange, clearAllFilters } =
        useServerManagedDataTableFilters({
            searchParams,
            definitions: VEHICLE_FILTER_DEFINITIONS,
            updateParams,
        });

    const queryString = queryStringFromUrl || initialQueryString;

    const { searchTermFromUrl, handleDebouncedSearchChange } =
        useServerManagedDataTableSearch({
            searchParams,
            updateParams,
        });

    // ── vehicles ──────────────────────────────────────────────────────────────
    const {
        data: vehicleData,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ["vehicle", queryString],
        queryFn: () => getAllVehicles(queryString),
    });

    const vehicles = vehicleData?.data ?? [];
    const meta: PaginationMeta | undefined = vehicleData?.meta;

    // ── vehicle types (for filters + form) ────────────────────────────────────
    const { data: vehicleTypeData, isLoading: isLoadingVehicleType } = useQuery(
        {
            queryKey: ["vehicle-type"],
            queryFn: () => getAllVehicleType(),
        },
    );
    const vehicleTypes = vehicleTypeData?.data ?? [];

    // ── vehicle categories (for filters) ─────────────────────────────────────
    const { data: vehicleCategoryData, isLoading: isLoadingVehicleCategory } =
        useQuery({
            queryKey: ["vehicle-category"],
            queryFn: () => getAllVehicleCategory(),
        });
    const vehicleCategories = vehicleCategoryData?.data ?? [];

    const filterConfigs = useMemo<DataTableFilterConfig[]>(
        () => [
            {
                id: "transmission",
                label: "Transmission",
                type: "single-select",
                options: Object.values(TransmissionEnum).map((v) => ({
                    label: v.replace(/_/g, " "),
                    value: v,
                })),
            },
            {
                id: "fuelType",
                label: "Fuel Type",
                type: "single-select",
                options: Object.values(FuelEnum).map((v) => ({
                    label: v.replace(/_/g, " "),
                    value: v,
                })),
            },
            {
                id: "status",
                label: "Status",
                type: "single-select",
                options: Object.values(VehicleStatusEnum).map((v) => ({
                    label: v.replace(/_/g, " "),
                    value: v,
                })),
            },
            {
                id: "vehicleType.name",
                label: "Vehicle Type",
                type: "multi-select",
                options: vehicleTypes.map((v) => ({
                    label: v.name,
                    value: v.name,
                })),
            },
            {
                id: "vehicleType.categoryId",
                label: "Category",
                type: "multi-select",
                options: vehicleCategories.map((v) => ({
                    label: v.name,
                    value: v.id,
                })),
            },
        ],
        [vehicleTypes, vehicleCategories],
    );

    const filterValuesForTable = useMemo<DataTableFilterValues>(
        () => ({
            transmission: filterValues.transmission,
            fuelType: filterValues.fuelType,
            status: filterValues.status,
            "vehicleType.name": filterValues["vehicleType.name"],
            "vehicleType.category.name":
                filterValues["vehicleType.category.name"],
        }),
        [filterValues],
    );

    return (
        <>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                    Vehicle Management
                </h1>
                <p className="text-sm text-zinc-500 mt-1">
                    Manage vehicles, assign types, and configure availability
                    and pricing.
                </p>
            </div>

            <DataTable
                data={vehicles}
                columns={vehicleColumn}
                isLoading={isLoading || isFetching || isRouteRefreshPending}
                emptyMessage="No vehicles found."
                sorting={{
                    state: optimisticSortingState,
                    onSortingChange: handleSortingChange,
                }}
                pagination={{
                    state: optimisticPaginationState,
                    onPaginationChange: handlePaginationChange,
                }}
                search={{
                    initialValue: searchTermFromUrl,
                    placeholder: "Search by brand, model, plate number...",
                    debounceMs: 700,
                    onDebouncedChange: handleDebouncedSearchChange,
                }}
                filters={{
                    configs: filterConfigs,
                    values: filterValuesForTable,
                    onFilterChange: handleFilterChange,
                    onClearAll: clearAllFilters,
                }}
                toolbarAction={
                    <CreateVehicleFormModal
                        vehicleTypes={vehicleTypes}
                        isLoadingVehicleTypes={isLoadingVehicleType}
                    />
                }
                meta={meta}
                actions={tableActions}
            />

            <EditVehicleFormModal
                open={isEditModalOpen}
                onOpenChange={onEditOpenChange}
                vehicle={editingItem}
                vehicleTypes={vehicleTypes}
                isLoadingVehicleTypes={isLoadingVehicleType}
            />

            <DeleteVehicleFormModal
                open={isDeleteDialogOpen}
                onOpenChange={onDeleteOpenChange}
                vehicle={deletingItem}
            />

            <ViewVehicleDialog
                open={isViewDialogOpen}
                onOpenChange={onViewOpenChange}
                vehicle={viewingItem}
            />
        </>
    );
}
