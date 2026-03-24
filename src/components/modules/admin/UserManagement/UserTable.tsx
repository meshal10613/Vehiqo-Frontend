"use client";

import { useSearchParams } from "next/navigation";
import { useRowActionModalState } from "../../../../hooks/useRowActionModalState";
import { IUser } from "../../../../types/user.type";
import { useServerManagedDataTable } from "../../../../hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "../../../../hooks/useServerManagedDataTableSearch";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../../../services/user.services";
import { PaginationMeta } from "../../../../types/api.type";
import DataTable from "../../../shared/table/DataTable";
import { userTypeColumn } from "./UserColumn";
import {
    serverManagedFilter,
    useServerManagedDataTableFilters,
} from "../../../../hooks/useServerManagedDataTableFilters";
import {
    DataTableFilterConfig,
    DataTableFilterValues,
} from "../../../shared/table/DataTableFilters";
import { useMemo } from "react";
import ViewUserDialog from "./ViewUserDialog";
import EditUserFormModal from "./EditUserFormModal";
import DeleteUserFormModal from "./DeleteUserFormModal";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const USER_FILTER_DEFINITIONS = [serverManagedFilter.single("role")];

export default function UserManagementTable({
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
    } = useRowActionModalState<IUser>();

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
            definitions: USER_FILTER_DEFINITIONS,
            updateParams,
        });

    const queryString = queryStringFromUrl || initialQueryString;

    const { searchTermFromUrl, handleDebouncedSearchChange } =
        useServerManagedDataTableSearch({
            searchParams,
            updateParams,
        });

    const {
        data: usersData,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ["users", queryString],
        queryFn: () => getAllUsers(queryString),
    });

    const users = usersData?.data ?? [];
    const meta: PaginationMeta | undefined = usersData?.meta;

    const filterConfigs = useMemo<DataTableFilterConfig[]>(
        () => [
            {
                id: "role",
                label: "Role",
                type: "single-select",
                options: [
                    { label: "Admin", value: "ADMIN" },
                    { label: "Customer", value: "CUSTOMER" },
                ],
            },
        ],
        [],
    );

    const filterValuesForTable = useMemo<DataTableFilterValues>(
        () => ({
            role: filterValues.role,
            status: filterValues.status,
            isEmailVerified: filterValues.isEmailVerified,
        }),
        [filterValues],
    );

    return (
        <>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                    User Management
                </h1>
                <p className="text-sm text-zinc-500 mt-1">
                    View and manage all registered users, their roles, and
                    account statuses.
                </p>
            </div>

            <DataTable
                data={users}
                columns={userTypeColumn}
                isLoading={isLoading || isFetching || isRouteRefreshPending}
                emptyMessage="No users found."
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
                    placeholder: "Search by name, email…",
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
                actions={tableActions}
            />

            <EditUserFormModal
                open={isEditModalOpen}
                onOpenChange={onEditOpenChange}
                user={editingItem}
            />

            <DeleteUserFormModal
                open={isDeleteDialogOpen}
                onOpenChange={onDeleteOpenChange}
                user={deletingItem}
            />

            <ViewUserDialog
                open={isViewDialogOpen}
                onOpenChange={onViewOpenChange}
                user={viewingItem}
            />
        </>
    );
}
