"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IUser } from "../../../../types/user.type";
import { Badge } from "../../../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";
import DateCell from "../../../shared/cell/DateCell";
import { CheckCircle, VerifiedIcon, XCircle } from "lucide-react";

export const userTypeColumn: ColumnDef<IUser>[] = [
    {
        id: "name",
        accessorKey: "name",
        header: "User",
        cell: ({ row }) => {
            const user = row.original;
            const initials = user.name
                .split(" ")
                .map((part) => part.charAt(0).toUpperCase())
                .join("")
                .slice(0, 2); // Limit to 2 characters
            return (
                <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                        <AvatarImage
                            src={user.image || undefined}
                            alt={user.name}
                        />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>{" "}
                    <div className="flex flex-col">
                        <span className="font-medium text-sm">{user.name}</span>
                        <span className="text-muted-foreground text-xs flex items-center gap-2">
                            {user.email}
                            {user.emailVerified ? (
                                <VerifiedIcon className="h-4 w-4" />
                            ) : (
                                <XCircle className="h-4 w-4" />
                            )}
                        </span>
                    </div>
                </div>
            );
        },
    },
    {
        id: "mobileNumber",
        accessorKey: "mobileNumber",
        header: "Mobile Number",
        cell: ({ row }) => {
            const mobileNumber = row.original.mobileNumber || "null";
            return <span className="text-sm">{mobileNumber}</span>;
        },
        enableSorting: false,
    },
    {
        id: "licenseNumber",
        accessorKey: "licenseNumber",
        header: "License Number",
        cell: ({ row }) => {
            const licenseNumber = row.original.licenseNumber || "null";
            return <span className="text-sm">{licenseNumber}</span>;
        },
        enableSorting: false,
    },
    {
        id: "nidNumber",
        accessorKey: "nidNumber",
        header: "Nid Number",
        cell: ({ row }) => {
            const nidNumber = row.original.nidNumber || "null";
            return <span className="text-sm">{nidNumber}</span>;
        },
        enableSorting: false,
    },
    {
        id: "role",
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            return <Badge className="capitalize">{row.original.role}</Badge>;
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
    // {
    //     id: "actions",
    //     cell: ({ row }) => (
    //         <TableRowActions
    //             row={row}
    //             onView={actions.onView}
    //             onEdit={actions.onEdit}
    //             onDelete={actions.onDelete}
    //         />
    //     ),
    // },
];
