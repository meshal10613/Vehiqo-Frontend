"use client";

import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { CalendarDays, CreditCard, Car, MoreHorizontal } from "lucide-react";
import { BookingStatus } from "../../../../types/enum.type";
import { IBooking } from "../../../../types/booking.type";
import DateCell from "../../../shared/cell/DateCell";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { Button } from "../../../ui/button";

const STATUS_MAP: Record<
    BookingStatus,
    { label: string; bg: string; text: string; dot: string }
> = {
    PENDING: {
        label: "Pending",
        bg: "bg-amber-50",
        text: "text-amber-700",
        dot: "bg-amber-400",
    },
    ADVANCE_PAID: {
        label: "Advance paid",
        bg: "bg-blue-50",
        text: "text-blue-700",
        dot: "bg-blue-500",
    },
    PICKED_UP: {
        label: "Picked up",
        bg: "bg-violet-50",
        text: "text-violet-700",
        dot: "bg-violet-500",
    },
    RETURNED: {
        label: "Returned",
        bg: "bg-orange-50",
        text: "text-orange-700",
        dot: "bg-orange-400",
    },
    COMPLETED: {
        label: "Completed",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        dot: "bg-emerald-500",
    },
    CANCELLED: {
        label: "Cancelled",
        bg: "bg-red-50",
        text: "text-red-600",
        dot: "bg-red-400",
    },
};

function StatusBadge({ status }: { status: BookingStatus }) {
    const s = STATUS_MAP[status] ?? STATUS_MAP.CANCELLED;
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap",
                s.bg,
                s.text,
            )}
        >
            <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", s.dot)} />
            {s.label}
        </span>
    );
}

function fmt(n: number) {
    return new Intl.NumberFormat("en-BD").format(n);
}

interface AllBookingColumnHandlers {
    onView: (booking: IBooking) => void;
    onCancel: (booking: IBooking) => void;
    // onPickup: (booking: IBooking) => void;
    // onReturn: (booking: IBooking) => void;
    // onReview: (booking: IBooking) => void;
}

// No actions column here — DataTable appends its own dropdown when the
// `actions` prop is passed. See MyBookingTable for the handlers.
export function AllBookingColumns(
    handlers: AllBookingColumnHandlers,
): ColumnDef<IBooking>[] {
    return [
        {
            id: "vehicle",
            header: "Vehicle",
            cell: ({ row }) => {
                const v = row.original.vehicle;
                return (
                    <div className="flex items-center gap-2.5 min-w-0">
                        {v?.image?.[0] ? (
                            <img
                                src={v.image[0]}
                                alt={`${v.brand} ${v.model}`}
                                className="w-10 h-8 rounded-lg object-cover shrink-0 border border-zinc-100"
                            />
                        ) : (
                            <div className="w-10 h-8 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                                <Car className="w-4 h-4 text-zinc-400" />
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-zinc-800 truncate">
                                {v?.brand} {v?.model}
                            </p>
                            <p className="text-xs text-zinc-400 truncate">
                                {v?.year} · {v?.plateNo}
                            </p>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => <StatusBadge status={row.original.status} />,
        },
        {
            id: "dates",
            header: "Rental period",
            cell: ({ row }) => {
                const b = row.original;
                return (
                    <div className="flex items-center gap-1.5 text-xs text-zinc-600 whitespace-nowrap">
                        <CalendarDays className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <DateCell
                            date={b.startDate}
                            formatString="MMM dd, yyyy"
                        />
                        <span className="text-zinc-300">→</span>
                        <DateCell
                            date={b.endDate}
                            formatString="MMM dd, yyyy"
                        />
                    </div>
                );
            },
        },
        {
            accessorKey: "totalDays",
            header: "Days",
            enableSorting: false,
            cell: ({ row }) => (
                <span className="text-sm font-medium text-zinc-700">
                    {row.original.totalDays}d
                </span>
            ),
        },
        {
            id: "cost",
            header: "Cost",
            cell: ({ row }) => {
                const b = row.original;
                return (
                    <div className="text-xs space-y-0.5">
                        <p className="font-semibold text-zinc-800 text-sm">
                            ৳{fmt(b.totalCost)}
                        </p>
                        <p className="text-zinc-400">
                            Adv. ৳{fmt(b.advanceAmount)}
                        </p>
                    </div>
                );
            },
        },
        {
            accessorKey: "remainingDue",
            header: "Remaining",
            cell: ({ row }) => {
                const due = row.original.remainingDue;
                return (
                    <span
                        className={cn(
                            "text-sm font-semibold",
                            due > 0 ? "text-[#FF5100]" : "text-emerald-600",
                        )}
                    >
                        {due > 0 ? `৳${fmt(due)}` : "Settled"}
                    </span>
                );
            },
        },
        {
            id: "payment",
            header: "Payment",
            cell: ({ row }) => {
                const payments = row.original.payments ?? [];
                const paid = payments.filter((p) => p.status === "PAID").length;
                const total = payments.length;
                if (total === 0)
                    return <span className="text-xs text-zinc-400">None</span>;
                return (
                    <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                        <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
                        {paid}/{total} paid
                    </div>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: "Booked on",
            cell: ({ row }) => (
                <DateCell
                    date={row.original.createdAt}
                    formatString="MMM dd, yyyy"
                />
            ),
        },
        {
            id: "actions",
            header: "Actions",
            enableSorting: false,
            cell: ({ row }) => {
                const booking = row.original;
                const canCancel = booking.status === "PENDING";

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open Menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => handlers.onView(booking)}
                            >
                                View
                            </DropdownMenuItem>
                            {canCancel && (
                                <DropdownMenuItem
                                    onClick={() => handlers.onCancel(booking)}
                                >
                                    Cancel
                                </DropdownMenuItem>
                            )}
                            {/* {canPickup && (
                                <DropdownMenuItem
                                    onClick={() => handlers.onPickup(booking)}
                                >
                                    Pick up
                                </DropdownMenuItem>
                            )}
                            {canReview && (
                                <DropdownMenuItem
                                    onClick={() => handlers.onReview(booking)}
                                >
                                    Review
                                </DropdownMenuItem>
                            )}
                            {canReturn && (
                                <DropdownMenuItem
                                    onClick={() => handlers.onReturn(booking)}
                                >
                                    Return
                                </DropdownMenuItem>
                            )} */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
}
