"use client";

import { useSearchParams } from "next/navigation";
import { useRowActionModalState } from "../../../../hooks/useRowActionModalState";
import { IVehicleType } from "../../../../types/vehicleType.type";
import { useServerManagedDataTable } from "../../../../hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "../../../../hooks/useServerManagedDataTableSearch";
import { useQuery } from "@tanstack/react-query";
import { getAllVehicleType } from "../../../../services/vehicleType.services";
import { PaginationMeta } from "../../../../types/api.type";
import DataTable from "../../../shared/table/DataTable";
import { vehicleTypeColumn } from "./VehicleTypeColumn";
import CreateVehicleTypeFormModal from "./CreateVehicleTypeFormModal";
import {
    serverManagedFilter,
    useServerManagedDataTableFilters,
} from "../../../../hooks/useServerManagedDataTableFilters";
import {
    DataTableFilterConfig,
    DataTableFilterValues,
} from "../../../shared/table/DataTableFilters";
import { useMemo } from "react";
import { getAllVehicleCategory } from "../../../../services/vehicleCategory.services";
import ViewVehicleTypeDialog from "./ViewVehicleTypeDialog";
import DeleteVehicleTypeFormModal from "./DeleteVehicleTypeFormModal";
import EditVehicleTypeFormModal from "./EditVehicleTypeFormModal";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const VEHICLE_TYPE_FILTER_DEFINITIONS = [
    serverManagedFilter.single("isElectric"),
    serverManagedFilter.single("requiresLicense"),
    serverManagedFilter.single("category.name"),
];

export default function VehicleTypeTable({
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
    } = useRowActionModalState<IVehicleType>();

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
            definitions: VEHICLE_TYPE_FILTER_DEFINITIONS,
            updateParams,
        });

    const queryString = queryStringFromUrl || initialQueryString;

    const { searchTermFromUrl, handleDebouncedSearchChange } =
        useServerManagedDataTableSearch({
            searchParams,
            updateParams,
        });

    const {
        data: vehicleTypeData,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ["vehicle-type", queryString],
        queryFn: () => getAllVehicleType(queryString),
    });

    const vehicleType = vehicleTypeData?.data ?? [];
    const meta: PaginationMeta | undefined = vehicleTypeData?.meta;

    const { data: vehicleCategoryData, isLoading: isLoadingVehicleCategory } =
        useQuery({
            queryKey: ["vehicle-category", queryString],
            queryFn: () => getAllVehicleCategory(queryString),
        });

    const vehicleCategory = vehicleCategoryData?.data ?? [];

    const filterConfigs = useMemo<DataTableFilterConfig[]>(() => {
        return [
            {
                id: "isElectric",
                label: "Is Electric",
                type: "single-select",
                options: [
                    { label: "True", value: "true" },
                    { label: "False", value: "false" },
                ],
            },
            {
                id: "requiresLicense",
                label: "Requires License",
                type: "single-select",
                options: [
                    { label: "True", value: "true" },
                    { label: "False", value: "false" },
                ],
            },
            {
                id: "category.name",
                label: "Vehicle Category",
                type: "single-select",
                options: vehicleCategory.map((v: any) => ({
                    label: v.name,
                    value: v.name,
                })),
            },
        ];
    }, []);

    const filterValuesForTable = useMemo<DataTableFilterValues>(() => {
        return {
            isElectric: filterValues.isElectric,
            requiresLicense: filterValues.requiresLicense,
            "category.name": filterValues["category.name"],
        };
    }, [filterValues]);

    return (
        <>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                    Vehicle Type Management
                </h1>
                <p className="text-sm text-zinc-500 mt-1">
                    Manage vehicle types, assign them to categories, and
                    configure license and electric requirements.
                </p>
            </div>
            <DataTable
                data={vehicleType}
                columns={vehicleTypeColumn}
                isLoading={isLoading || isFetching || isRouteRefreshPending}
                emptyMessage="No doctors found."
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
                    placeholder:
                        "Search vehicle type by name, vehicle category name...",
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
                    <CreateVehicleTypeFormModal
                        vehicleCategory={vehicleCategory}
                        isLoadingVehicleCategory={isLoadingVehicleCategory}
                    />
                }
                meta={meta}
                actions={tableActions}
            />

            <EditVehicleTypeFormModal
                open={isEditModalOpen}
                onOpenChange={onEditOpenChange}
                vehicleCategory={editingItem}
                categories={vehicleCategory}
                isLoadingCategories={isLoadingVehicleCategory}
            />

            <DeleteVehicleTypeFormModal
                open={isDeleteDialogOpen}
                onOpenChange={onDeleteOpenChange}
                vehicleType={deletingItem}
            />

            <ViewVehicleTypeDialog
                open={isViewDialogOpen}
                onOpenChange={onViewOpenChange}
                vehicleType={viewingItem}
            />
        </>
    );
}
