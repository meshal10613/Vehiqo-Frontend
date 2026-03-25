"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllVehicles } from "../../../services/vehicle.services";
import { PaginationMeta } from "../../../types/api.type";
import { useServerManagedDataTable } from "../../../hooks/useServerManagedDataTable";
import { useSearchParams } from "next/navigation";
import { IVehicle } from "../../../types/vehicle.type";
import { motion } from "framer-motion";
import {
    Users,
    Settings2,
    CarFront,
    Zap,
    IdCard,
    ChevronRight,
    ChevronLeft,
    Search,
} from "lucide-react";
import LoadingSpinner from "../../shared/LoadingSpinner";
import Link from "next/link";
import { Button } from "../../ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../ui/select";
import { Input } from "../../ui/input";
import { cn } from "../../../lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { VehicleStatusEnum } from "../../../types/enum.type";
import VehicleCard from "./VehicleCard";

const DEFAULT_PAGE_SIZES = [1, 5, 10, 20, 30, 50, 100];

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalRows: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    isLoading: boolean;
}

function Pagination({
    currentPage,
    totalPages,
    pageSize,
    totalRows,
    onPageChange,
    onPageSizeChange,
    isLoading,
}: PaginationProps) {
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customPageSize, setCustomPageSize] = useState("");

    const paginationItems = useMemo(() => {
        const items: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible + 2) {
            for (let i = 1; i <= totalPages; i++) items.push(i);
        } else {
            items.push(1);
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            if (start > 2) items.push("start-ellipsis");
            for (let i = start; i <= end; i++) {
                if (i !== 1 && i !== totalPages) items.push(i);
            }
            if (end < totalPages - 1) items.push("end-ellipsis");
            if (totalPages > 1) items.push(totalPages);
        }
        return items;
    }, [currentPage, totalPages]);

    const jumpBackwardTarget = Math.max(1, currentPage - 5);
    const jumpForwardTarget = Math.min(totalPages, currentPage + 5);

    return (
        <div className="flex flex-col gap-4 px-3 py-3 bg-white md:px-4 md:py-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage <= 1 || isLoading}
                        className="h-10 shrink-0 cursor-pointer"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Prev</span>
                    </Button>

                    {paginationItems.map((item: any, idx: any) => {
                        if (item === "start-ellipsis") {
                            return (
                                <Button
                                    key={`start-${idx}`}
                                    variant="ghost"
                                    size="sm"
                                    className="min-w-9 px-2 shrink-0"
                                    onClick={() =>
                                        onPageChange(jumpBackwardTarget)
                                    }
                                    disabled={isLoading}
                                >
                                    ...
                                </Button>
                            );
                        }
                        if (item === "end-ellipsis") {
                            return (
                                <Button
                                    key={`end-${idx}`}
                                    variant="ghost"
                                    size="sm"
                                    className="min-w-9 px-2 shrink-0"
                                    onClick={() =>
                                        onPageChange(jumpForwardTarget)
                                    }
                                    disabled={isLoading}
                                >
                                    ...
                                </Button>
                            );
                        }
                        const pageNum = item as number;
                        const isActive = pageNum === currentPage;
                        return (
                            <Button
                                key={pageNum}
                                variant={isActive ? "default" : "outline"}
                                size="sm"
                                className={cn(
                                    "min-w-10 h-10 shrink-0 cursor-pointer",
                                    isActive &&
                                        "pointer-events-none bg-primary text-white",
                                )}
                                onClick={() => onPageChange(pageNum)}
                                disabled={isLoading}
                            >
                                {pageNum}
                            </Button>
                        );
                    })}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages || isLoading}
                        className="h-10 shrink-0 cursor-pointer"
                    >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
                    <Select
                        value={showCustomInput ? "custom" : String(pageSize)}
                        onValueChange={(val) => {
                            if (val === "custom") setShowCustomInput(true);
                            else {
                                setShowCustomInput(false);
                                onPageSizeChange(Number(val));
                            }
                        }}
                    >
                        <SelectTrigger className="w-20 h-9">
                            <SelectValue placeholder="Limit" />
                        </SelectTrigger>
                        <SelectContent>
                            {DEFAULT_PAGE_SIZES.map((size: number) => (
                                <SelectItem key={size} value={String(size)}>
                                    {size}
                                </SelectItem>
                            ))}
                            <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                    </Select>
                    <span className="whitespace-nowrap">rows</span>

                    {showCustomInput && (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Input
                                type="number"
                                min={1}
                                className="h-9 w-full sm:w-24"
                                value={customPageSize}
                                onChange={(e) =>
                                    setCustomPageSize(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        const size = parseInt(customPageSize);
                                        if (size > 0) {
                                            onPageSizeChange(size);
                                            setShowCustomInput(false);
                                        }
                                    }
                                }}
                            />
                            <Button
                                size="sm"
                                variant="outline"
                                className="w-full sm:w-auto"
                                onClick={() => {
                                    const size = parseInt(customPageSize);
                                    if (size > 0) {
                                        onPageSizeChange(size);
                                        setShowCustomInput(false);
                                    }
                                }}
                                disabled={isLoading}
                            >
                                Apply
                            </Button>
                        </div>
                    )}

                    <span className="w-full text-xs sm:text-sm sm:w-auto sm:ml-2">
                        Total {totalRows ?? 0} items, {totalPages} pages
                    </span>
                </div>
            </div>
        </div>
    );
}

export function ImageSlider({
    images,
    alt,
}: {
    images: string[];
    alt: string;
}) {
    const [current, setCurrent] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const total = images.length;

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % total);
    }, [total]);

    const prev = useCallback(() => {
        setCurrent((prev) => (prev - 1 + total) % total);
    }, [total]);

    // Auto-advance only while not hovered
    useEffect(() => {
        if (isHovered) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }
        intervalRef.current = setInterval(next, 3000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isHovered, next]);

    return (
        <div
            className="relative w-full h-full overflow-hidden group/slider"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Slides */}
            <div
                className="flex h-full transition-transform duration-500 ease-in-out will-change-transform"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {images.map((src, i) => (
                    <img
                        key={i}
                        src={src}
                        alt={`${alt} — photo ${i + 1}`}
                        className="w-full h-full object-cover shrink-0"
                        draggable={false}
                    />
                ))}
            </div>

            {/* Prev / Next arrows — visible on hover */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    prev();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-200 backdrop-blur-sm cursor-pointer"
                aria-label="Previous image"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    next();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-200 backdrop-blur-sm cursor-pointer"
                aria-label="Next image"
            >
                <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrent(i);
                        }}
                        className={cn(
                            "rounded-full transition-all duration-300 cursor-pointer",
                            i === current
                                ? "bg-white w-4 h-1.5"
                                : "bg-white/50 w-1.5 h-1.5 hover:bg-white/75",
                        )}
                        aria-label={`Go to image ${i + 1}`}
                    />
                ))}
            </div>

            {/* Image count badge */}
            <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full z-10">
                {current + 1} / {total}
            </div>
        </div>
    );
}

export default function Vehicles({
    initialQueryString,
}: {
    initialQueryString: string;
}) {
    const searchParams = useSearchParams();
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

    const {
        data: vehicleData,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ["vehicle", queryString],
        queryFn: () => getAllVehicles(queryString),
        refetchOnWindowFocus: true,
    });

    const vehicles: IVehicle[] = vehicleData?.data ?? [];
    // const vehicles: IVehicle[] = v.filter(
    //     (vehicle: IVehicle) => vehicle.status === VehicleStatusEnum.AVAILABLE,
    // );
    const meta: PaginationMeta | undefined = vehicleData?.meta;

    // Search state
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearch = useDebounce(searchInput, 500);

    // Sync search input with URL on mount
    useEffect(() => {
        const currentSearch = searchParams.get("searchTerm") || "";
        setSearchInput(currentSearch);
    }, [searchParams]);

    // Update URL when debounced search changes
    useEffect(() => {
        const currentSearch = searchParams.get("searchTerm") || "";
        if (debouncedSearch !== currentSearch) {
            // updateParams expects a FUNCTION, not an object
            updateParams(
                (params) => {
                    if (debouncedSearch) {
                        params.set("searchTerm", debouncedSearch);
                    } else {
                        params.delete("searchTerm");
                    }
                },
                { resetPage: true }, // Reset to page 1 when searching
            );
        }
    }, [debouncedSearch, searchParams, updateParams]);

    // Get current sort value for Select
    const currentSortValue = useMemo(() => {
        if (!optimisticSortingState?.length) return "createdAt:desc";
        const sort = optimisticSortingState[0];
        return `${sort.id}:${sort.desc ? "desc" : "asc"}`;
    }, [optimisticSortingState]);

    // Handle sort change from Select
    const handleSortSelectChange = (value: string) => {
        const [id, order] = value.split(":");
        // handleSortingChange expects SortingState format
        handleSortingChange([{ id, desc: order === "desc" }]);
    };

    // Pagination handlers
    const handlePageChange = (page: number) => {
        handlePaginationChange({
            pageIndex: page - 1,
            pageSize: optimisticPaginationState.pageSize,
        });
    };

    const handlePageSizeChange = (size: number) => {
        handlePaginationChange({
            pageIndex: 0,
            pageSize: size,
        });
    };

    const currentPage = (optimisticPaginationState?.pageIndex ?? 0) + 1;
    const pageSize = optimisticPaginationState?.pageSize ?? 10;
    const totalPages = meta?.totalPages ?? 0;
    const totalRows = meta?.total ?? 0;
    const isLoadingOrRefreshing =
        isLoading || isFetching || isRouteRefreshPending;

    return (
        <div className="pb-10 container mx-auto px-4 my-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" as const }}
                className="max-w-2xl mx-auto"
            >
                {/* Pill badge */}
                <div className="flex items-center justify-center gap-2 bg-[#FF5100]/15 border border-[#FF5100]/25 text-[#FF5100] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5 text-center w-fit mx-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF5100] animate-pulse" />
                    Available Vehicles
                </div>

                <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight mb-4 text-center">
                    Choose. <span className="text-[#FF5100]">Book.</span> Drive.
                </h1>
                <p className="text-base text-zinc-400 leading-relaxed text-center">
                    Every vehicle in our fleet is verified, maintained, and
                    ready to hit the road — just pick your dates.
                </p>
            </motion.div>

            <div className="flex flex-row items-center justify-between gap-3 mb-8">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                    <Input
                        placeholder="Search vehicles by name"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="pl-10 w-full sm:w-64 h-10 focus:border-none"
                    />
                </div>

                {/* Sort Select */}
                <Select
                    value={currentSortValue}
                    onValueChange={handleSortSelectChange}
                >
                    <SelectTrigger className="w-fit sm:w-48 h-10!">
                        <SelectValue placeholder="Sort by" className="h-10" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pricePerDay:asc">
                            Price: Low to High
                        </SelectItem>
                        <SelectItem value="pricePerDay:desc">
                            Price: High to Low
                        </SelectItem>
                        <SelectItem value="year:desc">
                            Year: Newest First
                        </SelectItem>
                        <SelectItem value="year:asc">
                            Year: Oldest First
                        </SelectItem>
                        <SelectItem value="brand:asc">Brand: A-Z</SelectItem>
                        <SelectItem value="brand:desc">Brand: Z-A</SelectItem>
                        <SelectItem value="createdAt:desc">
                            Newest Added
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                {isLoadingOrRefreshing && vehicles.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <div
                                key={n}
                                className="w-full h-112.5 bg-zinc-100 animate-pulse rounded-2xl"
                            ></div>
                        ))}
                    </div>
                ) : vehicles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {vehicles.map((vehicle) => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-zinc-200 rounded-2xl">
                        <CarFront className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-zinc-900">
                            No vehicles found
                        </h3>
                        <p className="text-zinc-500 text-sm mt-1">
                            Try adjusting your search filters.
                        </p>
                    </div>
                )}
            </div>

            {totalPages > 0 && (
                <div className="mt-6 border border-zinc-200 rounded-2xl bg-white shadow-sm overflow-hidden">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        pageSize={pageSize}
                        totalRows={totalRows}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        isLoading={isLoadingOrRefreshing}
                    />
                </div>
            )}
        </div>
    );
}
