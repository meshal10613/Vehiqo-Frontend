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
import { getAllBooking } from "../../../../services/booking.services";
import { PaginationMeta } from "../../../../types/api.type";
import DataTable, { RowAction } from "../../../shared/table/DataTable";
import {
	DataTableFilterConfig,
	DataTableFilterValues,
} from "../../../shared/table/DataTableFilters";
import { Eye, XCircle, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import {
	createAdvancePaymentSession,
	createRemainingPaymentSession,
} from "../../../../services/payment.services";
import { toast } from "sonner";
import { AllBookingColumns } from "./AllBookingColumn";
import ViewBookingDialog from "../../customer/MyBookingManagement/ViewBookingDialog";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const BOOKING_FILTER_DEFINITIONS = [serverManagedFilter.single("status")];

export default function AllBookingTable({
	initialQueryString,
}: {
	initialQueryString: string;
}) {

	const [cancelModalOpen, setCancelModalOpen] = useState(false);
	const [cancelingBooking, setCancelingBooking] = useState<IBooking | null>(
		null,
	);

	const [viewModalOpen, setViewModalOpen] = useState(false);
	const [viewingBooking, setViewingBooking] = useState<IBooking | null>(null);

	// const [pickupModalOpen, setPickupModalOpen] = useState(false);
	// const [pickupingBooking, setPickupingBooking] = useState<IBooking | null>(
	// 	null,
	// );

	// const [reviewModalOpen, setReviewModalOpen] = useState(false);
	// const [reviewingBooking, setReviewingBooking] = useState<IBooking | null>(
	// 	null,
	// );

	// const [returnModalOpen, setReturnModalOpen] = useState(false);
	// const [returningBooking, setReturningBooking] = useState<IBooking | null>(
	// 	null,
	// );

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
		data: BookingsData,
		isLoading,
		isFetching,
	} = useQuery({
		queryKey: ["bookings", queryString],
		queryFn: () => getAllBooking(queryString),
	});

	const Bookings: IBooking[] = BookingsData?.data ?? [];
	const meta: PaginationMeta | undefined = BookingsData?.meta;

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

	// const handlePay = useCallback((booking: IBooking) => {
	// 	setPayingBooking(booking);
	// 	setPayModalOpen(true);
	// }, []);

	// Pay Now: navigate to the payment page
	// const handlePayNow = useCallback(
	// 	async (booking: IBooking) => {
	// 		if (booking.status === BookingStatusEnum.PENDING) {
	// 			const result = await createAdvancePaymentSession(booking.id);
	// 			if (!result.success) {
	// 				setPayModalOpen(false);
	// 				toast.error(result.message);
	// 				return;
	// 			}

	// 			router.push(result.data.sessionUrl);
	// 			setPayModalOpen(false);
	// 		}

	// 		if (booking.status === BookingStatusEnum.RETURNED) {
	// 			const result = await createRemainingPaymentSession(booking.id);
	// 			if (!result.success) {
	// 				setPayModalOpen(false);
	// 				toast.error(result.message);
	// 				return;
	// 			}

	// 			router.push(result.data.sessionUrl);
	// 			setPayModalOpen(false);
	// 		}
	// 	},
	// 	[router],
	// );

	const handleCancel = useCallback((booking: IBooking) => {
		setCancelingBooking(booking);
		setCancelModalOpen(true);
	}, []);

	const handleView = useCallback((booking: IBooking) => {
		setViewingBooking(booking);
		setViewModalOpen(true);
	}, []);

	// const handlePickup = useCallback((booking: IBooking) => {
	// 	setPickupModalOpen(true);
	// 	setPickupingBooking(booking);
	// }, []);

	// const handleReview = useCallback((booking: IBooking) => {
	// 	setReviewingBooking(booking);
	// 	setReviewModalOpen(true);
	// }, []);

	// const handleReturn = useCallback((booking: IBooking) => {
	// 	setReturnModalOpen(true);
	// 	setReturningBooking(booking);
	// }, []);

	// Columns are built once — only rebuild if handlers change (they won't)
	const columns = useMemo(
		() =>
			AllBookingColumns({
				// onPay: handlePay,
				onCancel: handleCancel,
				onView: handleView,
				// onReview: handleReview,
				// onReturn: handleReturn,
				// onPickup: handlePickup,
			}),
		[handleCancel],
	);

	return (
		<>
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
					All Bookings
				</h1>
				<p className="text-sm text-zinc-500 mt-1 max-w-xl">
					Manage every booking made across the platform. View customer details, monitor booking statuses, track rental periods, and take action on any booking when needed.
				</p>
			</div>

			<DataTable
				data={Bookings}
				columns={columns}
				isLoading={isLoading || isFetching || isRouteRefreshPending}
				emptyMessage="There are no bookings yet."
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

			<ViewBookingDialog
				open={viewModalOpen}
				onOpenChange={setViewModalOpen}
				booking={viewingBooking}
			/>

			{/* <CancelBookingDialog
				open={cancelModalOpen}
				onOpenChange={setCancelModalOpen}
				booking={cancelingBooking}
			/> */}

			{/* <PayModal
				open={payModalOpen}
				onClose={() => setPayModalOpen(false)}
				booking={payingBooking}
				onPayNow={handlePayNow}
			/>

			<PickupModal
				open={pickupModalOpen}
				onOpenChange={setPickupModalOpen}
				booking={pickupingBooking}
			/>

			<ReturnModal
				open={returnModalOpen}
				onOpenChange={setReturnModalOpen}
				booking={returningBooking}
			/>

			<ReviewModal
				open={reviewModalOpen}
				onOpenChange={setReviewModalOpen}
				booking={reviewingBooking}
			/> */}
		</>
	);
}
