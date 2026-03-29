"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllVehicleCategory } from "../../../../services/vehicleCategory.services";
import { useSearchParams } from "next/navigation";
import { IVehicleCategory } from "../../../../types/vehicleCategory.type";
import { useRowActionModalState } from "../../../../hooks/useRowActionModalState";
import { useServerManagedDataTable } from "../../../../hooks/useServerManagedDataTable";
import { PaginationMeta } from "../../../../types/api.type";
import DataTable from "../../../shared/table/DataTable";
import { vehicleCategoryColumn } from "./vehicleCategoryColumn";
import CreateVehicleCategoryFormModal from "./CreateVehicleCategoryFormModal";
import { useServerManagedDataTableSearch } from "../../../../hooks/useServerManagedDataTableSearch";
import EditVehicleCategoryFormModal from "./EditVehicleCategoryFormModal";
import DeleteVehicleCategoryFormModal from "./DeleteVehicleCategoryFormModal";
import ViewVehicleCategoryDialoag from "./ViewVehicleCategoryDialog";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export default function VehicleCategoryTable({
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
    } = useRowActionModalState<IVehicleCategory>();

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

    const queryString = queryStringFromUrl || initialQueryString;

    const { searchTermFromUrl, handleDebouncedSearchChange } =
        useServerManagedDataTableSearch({
            searchParams,
            updateParams,
        });

    const {
        data: vehicleCategoryData,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ["vehicle-category", queryString],
        queryFn: () => getAllVehicleCategory(queryString),
    });

    const vehicleCategory = vehicleCategoryData?.data ?? [];
    const meta: PaginationMeta | undefined = vehicleCategoryData?.meta;

    return (
        <>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                    Vehicle Category Management
                </h1>
                <p className="text-sm text-zinc-500 mt-1">
                    Manage vehicle categories, their types, and associated
                    metadata across the platform.
                </p>
            </div>
            <DataTable
                data={vehicleCategory}
                columns={vehicleCategoryColumn}
                isLoading={isLoading || isFetching || isRouteRefreshPending}
                emptyMessage="No vehicle categories found."
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
                        "Search vehicle category by name, description...",
                    debounceMs: 700,
                    onDebouncedChange: handleDebouncedSearchChange,
                }}
                // filters={{
                //     configs: filterConfigs,
                //     values: filterValuesForTable,
                //     onFilterChange: handleFilterChange,
                //     onClearAll: clearAllFilters,
                // }}
                toolbarAction={<CreateVehicleCategoryFormModal />}
                meta={meta}
                actions={tableActions}
            />

            <EditVehicleCategoryFormModal
                open={isEditModalOpen}
                onOpenChange={onEditOpenChange}
                vehicleCategory={editingItem}
            />

            <DeleteVehicleCategoryFormModal
                open={isDeleteDialogOpen}
                onOpenChange={onDeleteOpenChange}
                vehicleCategory={deletingItem}
            />

            <ViewVehicleCategoryDialoag
                open={isViewDialogOpen}
                onOpenChange={onViewOpenChange}
                vehicleCategory={viewingItem}
            />
        </>
    );
}
