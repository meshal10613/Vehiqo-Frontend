"use client";

import { useQuery } from "@tanstack/react-query";
import {
    getAllPayments,
    getMyPayments,
} from "../../../../services/payment.services";
import { PaginationMeta } from "../../../../types/api.type";
import { useSearchParams } from "next/navigation";
import { useRowActionModalState } from "../../../../hooks/useRowActionModalState";
import { IPayment } from "../../../../types/payment.type";
import { useServerManagedDataTable } from "../../../../hooks/useServerManagedDataTable";
import {
    serverManagedFilter,
    useServerManagedDataTableFilters,
} from "../../../../hooks/useServerManagedDataTableFilters";
import { useServerManagedDataTableSearch } from "../../../../hooks/useServerManagedDataTableSearch";
import DataTable from "../../../shared/table/DataTable";
import { PaymentColumns } from "./PaymentColumn";
import { useMemo } from "react";
import {
    DataTableFilterConfig,
    DataTableFilterValues,
} from "../../../shared/table/DataTableFilters";
import {
    PaymentMethodEnum,
    PaymentStatusEnum,
    PaymentTypeEnum,
} from "../../../../types/enum.type";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const PAYMENT_FILTER_DEFINITIONS = [
    serverManagedFilter.multi("type"),
    serverManagedFilter.multi("method"),
    serverManagedFilter.multi("status"),
];

export default function PaymentTable({
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
    } = useRowActionModalState<IPayment>();

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
            definitions: PAYMENT_FILTER_DEFINITIONS,
            updateParams,
        });

    const queryString = queryStringFromUrl || initialQueryString;

    const { searchTermFromUrl, handleDebouncedSearchChange } =
        useServerManagedDataTableSearch({
            searchParams,
            updateParams,
        });

    const {
        data: paymentData,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ["payments", queryString],
        queryFn: () => getAllPayments(queryString),
    });
    console.log(paymentData);
    const payments: IPayment[] = paymentData?.data ?? [];
    const meta: PaginationMeta | undefined = paymentData?.meta;

    const filterConfigs = useMemo<DataTableFilterConfig[]>(
        () => [
            {
                id: "type",
                label: "Type",
                type: "multi-select",
                options: [
                    { label: "Advance", value: PaymentTypeEnum.ADVANCE },
                    { label: "Final", value: PaymentTypeEnum.FINAL },
                    { label: "Full", value: PaymentTypeEnum.FULL },
                    { label: "Refund", value: PaymentTypeEnum.REFUND },
                ],
            },
            {
                id: "method",
                label: "Method",
                type: "multi-select",
                options: [
                    { label: "Stripe", value: PaymentMethodEnum.STRIPE },
                    {
                        label: "SSL Commerz",
                        value: PaymentMethodEnum.SSLCOMMERZ,
                    },
                    { label: "Bkash", value: PaymentMethodEnum.BKASH },
                    { label: "Nogod", value: PaymentMethodEnum.NOGOD },
                    { label: "Cash", value: PaymentMethodEnum.CASH },
                ],
            },
            {
                id: "status",
                label: "Status",
                type: "multi-select",
                options: [
                    { label: "Unpaid", value: PaymentStatusEnum.UNPAID },
                    { label: "Pending", value: PaymentStatusEnum.PENDING },
                    { label: "Paid", value: PaymentStatusEnum.PAID },
                    { label: "Failed", value: PaymentStatusEnum.FAILED },
                    { label: "Refunded", value: PaymentStatusEnum.REFUNDED },
                ],
            },
        ],
        [],
    );

    const filterValuesForTable = useMemo<DataTableFilterValues>(
        () => ({
            type: filterValues.type,
            method: filterValues.method,
            status: filterValues.status,
        }),
        [filterValues],
    );

    return (
        <>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                    All Payments
                </h1>
                <p className="text-sm text-zinc-500 mt-1">
                    Manage all payments.
                </p>
            </div>

            <DataTable
                data={payments}
                columns={PaymentColumns}
                isLoading={isLoading || isFetching || isRouteRefreshPending}
                emptyMessage={"No payments found."}
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
                // toolbarAction={
                //     <CreateVehicleFormModal
                //         vehicleTypes={vehicleTypes}
                //         isLoadingVehicleTypes={isLoadingVehicleType}
                //     />
                // }
                meta={meta}
                actions={{ onDelete: (row) => tableActions.onDelete?.(row) }}
            />

            {/* <EditVehicleFormModal
				open={isEditModalOpen}
				onOpenChange={onEditOpenChange}
				vehicle={editingItem}
				vehicleTypes={vehicleTypes}
				isLoadingVehicleTypes={isLoadingVehicleType}
			/> */}

            {/* <DeleteVehicleFormModal
				open={isDeleteDialogOpen}
				onOpenChange={onDeleteOpenChange}
				vehicle={deletingItem}
			/> */}

            {/* <ViewVehicleDialog
				open={isViewDialogOpen}
				onOpenChange={onViewOpenChange}
				vehicle={viewingItem}
			/> */}
        </>
    );
}
