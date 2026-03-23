"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRowActionModalState } from "../../../../hooks/useRowActionModalState";
import { IBooking } from "../../../../types/booking.type";
import { useServerManagedDataTable } from "../../../../hooks/useServerManagedDataTable";
import {
    useServerManagedDataTableFilters,
    serverManagedFilter,
} from "../../../../hooks/useServerManagedDataTableFilters";
import { useServerManagedDataTableSearch } from "../../../../hooks/useServerManagedDataTableSearch";
import { getMyBooking } from "../../../../services/booking.services";
import { PaginationMeta } from "../../../../types/api.type";
import DataTable, { RowAction } from "../../../shared/table/DataTable";
import {
    DataTableFilterConfig,
    DataTableFilterValues,
} from "../../../shared/table/DataTableFilters";
import { Eye, XCircle, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { MyBookingColumns } from "./MyBookingColumn";
import PayModal from "./PayModal";
import CancelBookingDialog from "./CancelBookingDialog";
import { createAdvancePaymentSession } from "../../../../services/payment.services";
import { toast } from "sonner";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const BOOKING_FILTER_DEFINITIONS = [serverManagedFilter.single("status")];

export default function MyBookingTable({
    initialQueryString,
}: {
    initialQueryString: string;
}) {
    const [payModalOpen, setPayModalOpen] = useState(false);
    const [payingBooking, setPayingBooking] = useState<IBooking | null>(null);

    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [cancelingBooking, setCancelingBooking] = useState<IBooking | null>(
        null,
    );

    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewingBooking, setViewingBooking] = useState<IBooking | null>(null);

    const searchParams = useSearchParams();
    const router = useRouter();

    const {
        viewingItem,
        deletingItem,
        isViewDialogOpen,
        isDeleteDialogOpen,
        onViewOpenChange,
        onDeleteOpenChange,
    } = useRowActionModalState<IBooking>();

    // ── Server-managed table state ────────────────────────────────────────────
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
            definitions: BOOKING_FILTER_DEFINITIONS,
            updateParams,
        });

    const queryString = queryStringFromUrl || initialQueryString;

    const { searchTermFromUrl, handleDebouncedSearchChange } =
        useServerManagedDataTableSearch({ searchParams, updateParams });

    // ── Data fetch ────────────────────────────────────────────────────────────
    const {
        data: myBookingsData,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ["my-bookings", queryString],
        queryFn: () => getMyBooking(queryString),
    });

    const myBookings: IBooking[] = myBookingsData?.data ?? [];
    const meta: PaginationMeta | undefined = myBookingsData?.meta;

    const filterConfigs = useMemo<DataTableFilterConfig[]>(
        () => [
            {
                id: "status",
                label: "Status",
                type: "single-select",
                options: [
                    { label: "Pending", value: "PENDING" },
                    { label: "Advance paid", value: "ADVANCE_PAID" },
                    { label: "Picked up", value: "PICKED_UP" },
                    { label: "Returned", value: "RETURNED" },
                    { label: "Completed", value: "COMPLETED" },
                    { label: "Cancelled", value: "CANCELLED" },
                ],
            },
        ],
        [],
    );

    const filterValuesForTable = useMemo<DataTableFilterValues>(
        () => ({ status: filterValues.status }),
        [filterValues],
    );

    const handlePay = useCallback((booking: IBooking) => {
        setPayingBooking(booking);
        setPayModalOpen(true);
    }, []);

    // Pay Now: navigate to the payment page
    const handlePayNow = useCallback(
        async(booking: IBooking) => {
            const result = await createAdvancePaymentSession(booking.id);
            if(!result.success) {
                setPayModalOpen(false);
                toast.error(result.message);
                return;
            }
            router.push(result.data.sessionUrl);
            setPayModalOpen(false);
        },
        [router],
    );

    const handleCancel = useCallback((booking: IBooking) => {
        setCancelingBooking(booking);
        setCancelModalOpen(true);
    }, []);

    const handleView = useCallback((booking: IBooking) => {
        setViewingBooking(booking);
        setViewModalOpen(true);
    }, []);

    // Columns are built once — only rebuild if handlers change (they won't)
    const columns = useMemo(
        () =>
            MyBookingColumns({
                onPay: handlePay,
                onCancel: handleCancel,
                onView: handleView,
            }),
        [handlePay, handleCancel],
    );

    return (
        <>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                    My Bookings
                </h1>
                <p className="text-sm text-zinc-500 mt-1">
                    Track your vehicle rentals, payments, and rental history.
                </p>
            </div>

            <DataTable
                data={myBookings}
                columns={columns}
                isLoading={isLoading || isFetching || isRouteRefreshPending}
                emptyMessage="You have no bookings yet."
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
                    placeholder: "Search by vehicle, date…",
                    debounceMs: 700,
                    onDebouncedChange: handleDebouncedSearchChange,
                }}
                filters={{
                    configs: filterConfigs,
                    values: filterValuesForTable,
                    onFilterChange: handleFilterChange,
                    onClearAll: clearAllFilters,
                }}
                meta={meta}
            />

            {/* <ViewBookingDialog
                open={isViewDialogOpen}
                onOpenChange={(o) => onViewOpenChange(o)}
                booking={viewingItem}
            /> */}

            <CancelBookingDialog
                open={cancelModalOpen}
                onOpenChange={setCancelModalOpen}
                booking={cancelingBooking}
            />

            <PayModal
                open={payModalOpen}
                onClose={() => setPayModalOpen(false)}
                booking={payingBooking}
                onPayNow={handlePayNow}
            />
        </>
    );
}
