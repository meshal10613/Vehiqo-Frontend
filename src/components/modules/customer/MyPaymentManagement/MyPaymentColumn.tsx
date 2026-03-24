"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IPayment } from "../../../../types/payment.type";
import {
    PaymentStatus,
    PaymentType,
    PaymentMethod,
} from "../../../../types/enum.type";
import { Badge } from "../../../ui/badge";
import { cn } from "../../../../lib/utils";
import {
    Calendar,
    CreditCard,
    FileText,
    Hash,
    VerifiedIcon,
    XCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";
import DateCell from "../../../shared/cell/DateCell";

// ── Status styling ─────────────────────────────────────────────────────────────

const getStatusStyle = (status: PaymentStatus) => {
    switch (status) {
        case "PAID":
            return "border-green-200 text-green-600 bg-green-50";
        case "PENDING":
            return "border-amber-200 text-amber-600 bg-amber-50";
        case "FAILED":
            return "border-red-200 text-red-600 bg-red-50";
        case "REFUNDED":
            return "border-zinc-200 text-zinc-500 bg-zinc-50";
        default:
            return "border-zinc-200 text-zinc-500 bg-zinc-50";
    }
};

const getTypeStyle = (type: PaymentType) => {
    switch (type) {
        case "ADVANCE":
            return "border-blue-200 text-blue-600 bg-blue-50";
        case "FINAL":
            return "border-purple-200 text-purple-600 bg-purple-50";
        case "FULL":
            return "border-green-200 text-green-600 bg-green-50";
        case "REFUND":
            return "border-zinc-200 text-zinc-500 bg-zinc-50";
        default:
            return "border-zinc-200 text-zinc-500 bg-zinc-50";
    }
};

// ── Helper functions ───────────────────────────────────────────────────────────

const formatDate = (date?: Date | string | null) => {
    if (!date) return "—";
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "BDT",
        minimumFractionDigits: 0,
    }).format(amount);
};

export const MyPaymentColumns: ColumnDef<IPayment>[] = [
    // {
    //     id: "booking.customer.name",
    //     accessorKey: "booking.customer.name",
    //     header: "Customer",
    //     cell: ({ row }) => {
    //         const user = row.original.booking?.customer;

    //         if (!user) {
    //             return <span className="text-xs text-zinc-400">—</span>;
    //         }

    //         const initials = user.name
    //             .split(" ")
    //             .map((part) => part.charAt(0).toUpperCase())
    //             .join("")
    //             .slice(0, 2);

    //         return (
    //             <div className="flex items-center gap-2">
    //                 <Avatar className="h-10 w-10">
    //                     <AvatarImage
    //                         src={user.image || undefined}
    //                         alt={user.name}
    //                     />
    //                     <AvatarFallback>{initials}</AvatarFallback>
    //                 </Avatar>{" "}
    //                 <div className="flex flex-col">
    //                     <span className="font-medium text-sm">{user.name}</span>
    //                     <span className="text-muted-foreground text-xs flex items-center gap-2">
    //                         {user.email}
    //                         {user.emailVerified ? (
    //                             <VerifiedIcon className="h-4 w-4" />
    //                         ) : (
    //                             <XCircle className="h-4 w-4" />
    //                         )}
    //                     </span>
    //                 </div>
    //             </div>
    //         );
    //     },
    // },
    {
        id: "booking.vehicle.brand",
        accessorKey: "booking",
        header: "Vehicle",
        cell: ({ row }) => {
            const booking = row.original.booking;
            const vehicle = booking?.vehicle;

            if (!booking) {
                return <span className="text-xs text-zinc-400">—</span>;
            }

            return (
                <div className="flex flex-col">
                    {vehicle && (
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-zinc-900">
                                {vehicle.brand} {vehicle.model}
                            </span>
                            <span className="text-xs text-zinc-500">
                                {vehicle.plateNo}
                            </span>
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        id: "type",
        accessorKey: "type",
        header: "Payment Type",
        cell: ({ row }) => {
            const type = row.original.type;
            return (
                <Badge
                    variant="outline"
                    className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5",
                        getTypeStyle(type),
                    )}
                >
                    {type.replace(/_/g, " ")}
                </Badge>
            );
        },
    },
    {
        id: "amount",
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
            <span className="text-sm font-bold text-primary">
                {formatCurrency(row.original.amount)}
            </span>
        ),
    },
    {
        id: "method",
        accessorKey: "method",
        header: "Method",
        cell: ({ row }) => {
            const method = row.original.method;
            const Icon = CreditCard;
            return (
                <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 border border-orange-100">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm text-zinc-700 capitalize">
                        {method.replace(/_/g, " ").toLowerCase()}
                    </span>
                </div>
            );
        },
    },
    {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
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
    {
        id: "transactionId",
        accessorKey: "transactionId",
        header: "Transaction ID",
        cell: ({ row }) => {
            const txId = row.original.transactionId;
            if (!txId) {
                return <span className="text-xs text-zinc-400">—</span>;
            }
            return (
                <div className="flex items-center gap-1.5">
                    <Hash className="h-3 w-3 text-zinc-400" />
                    <span className="text-xs font-mono text-zinc-600">
                        {txId.slice(0, 12)}...
                    </span>
                </div>
            );
        },
    },
    {
        // id: "paidAt",
        accessorKey: "paidAt",
        header: "Paid At",
        cell: ({ row }) => {
            const paidAt = row.original.paidAt;

            return paidAt ? (
                <DateCell date={paidAt} formatString="MMM dd, yyyy" />
            ) : (
                <span className="text-xs text-zinc-400">—</span>
            );
        },
    },
    {
        id: "invoice",
        accessorKey: "invoiceUrl",
        header: "Invoice",
        enableSorting: false,
        cell: ({ row }) => {
            const invoiceUrl = row.original.invoiceUrl;

            if (!invoiceUrl) {
                return <span className="text-xs text-zinc-400">—</span>;
            }

            return (
                <a
                    href={invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-primary hover:text-orange-600 transition-colors"
                >
                    <FileText className="h-3 w-3" />
                    View
                </a>
            );
        },
    },
];
