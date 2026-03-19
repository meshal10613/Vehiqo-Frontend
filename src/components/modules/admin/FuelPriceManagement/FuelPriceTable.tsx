"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllFuelPrice } from "../../../../services/fuelPrice-services";
import DataTable from "../../../shared/table/DataTable";
import { fuelPriceColumn } from "./FuelPriceColumn";
import { IFuelPrice } from "../../../../types/fuelPrice.type";
import { useRowActionModalState } from "../../../../hooks/useRowActionModalState";
import { useServerManagedDataTable } from "../../../../hooks/useServerManagedDataTable";
import { useSearchParams } from "next/navigation";
import { useServerManagedDataTableSearch } from "../../../../hooks/useServerManagedDataTableSearch";
import EditFuelPriceFormModal from "./EditFuelPriceFormModal";

export default function FuelPriceTable({
    initialQueryString,
}: {
    initialQueryString: string;
}) {
    const searchParams = useSearchParams();
    const { editingItem, isEditModalOpen, onEditOpenChange, tableActions } =
        useRowActionModalState<IFuelPrice>();

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
    });

    const queryString = queryStringFromUrl || initialQueryString;

    const { searchTermFromUrl, handleDebouncedSearchChange } =
        useServerManagedDataTableSearch({
            searchParams,
            updateParams,
        });

    const {
        data: fuelPriceData,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ["fuel-price", queryString],
        queryFn: () => getAllFuelPrice(queryString),
    });

    const fuelPrice = fuelPriceData?.data ?? [];

    return (
        <>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                    Fuel Price Management
                </h1>
                <p className="text-sm text-zinc-500 mt-1">
                    Manage fuel types, units, and pricing per unit for all
                    vehicle categories.
                </p>
            </div>

            <DataTable
                data={fuelPrice}
                columns={fuelPriceColumn}
                isLoading={isLoading || isFetching}
                emptyMessage="No fuel price found."
                sorting={{
                    state: optimisticSortingState,
                    onSortingChange: handleSortingChange,
                }}
                // pagination={{
                //     state: optimisticPaginationState,
                //     onPaginationChange: handlePaginationChange,
                // }}
                // search={{
                //     initialValue: searchTermFromUrl,
                //     placeholder: "Search fuel price by type, unit, price...",
                //     debounceMs: 700,
                //     onDebouncedChange: handleDebouncedSearchChange,
                // }}
                // filters={{
                //     configs: filterConfigs,
                //     values: filterValuesForTable,
                //     onFilterChange: handleFilterChange,
                //     onClearAll: clearAllFilters,
                // }}
                //   toolbarAction={
                //     <CreateDoctorFormModal
                //       specialties={specialties}
                //       isLoadingSpecialties={isLoadingSpecialties}
                //     />
                //   }
                //   meta={meta}
                actions={{
                    onEdit: (row) => tableActions.onEdit?.(row),
                }}
            />

            <EditFuelPriceFormModal
                open={isEditModalOpen}
                onOpenChange={onEditOpenChange}
                fuelPrice={editingItem}
            />
        </>
    );
}
