"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IVehicleCategory } from "../../../types/vehicleCategory.type";
import { IVehicle } from "../../../types/vehicle.type";
import VehicleCard from "./VehicleCard";
import { LayoutGrid, ChevronRight } from "lucide-react";
import Link from "next/link";
import { VehicleStatusEnum } from "../../../types/enum.type";

const ALL_ID = "__all__";

function getVehiclesForCategory(category: IVehicleCategory): IVehicle[] {
    if (!category.types?.length) return [];
    const seen = new Set<string>();
    const vehicles: IVehicle[] = [];
    for (const type of category.types) {
        for (const v of type.vehicles ?? []) {
            if (
                !seen.has(v.id) 
                // && v?.status === ("AVAILABLE" as VehicleStatusEnum)
            ) {
                seen.add(v.id);
                vehicles.push(v);
            }
        }
    }
    return vehicles;
}

function getAllVehicles(categories: IVehicleCategory[]): IVehicle[] {
    const seen = new Set<string>();
    const vehicles: IVehicle[] = [];
    for (const cat of categories) {
        for (const v of getVehiclesForCategory(cat)) {
            if (!seen.has(v.id)) {
                seen.add(v.id);
                vehicles.push(v);
            }
        }
    }
    return vehicles;
}

function TabPill({
    label,
    count,
    active,
    onClick,
}: {
    label: string;
    count: number;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`
                relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0
                ${
                    active
                        ? "bg-[#FF5100] text-white shadow-md shadow-[#FF5100]/25"
                        : "bg-white border border-zinc-200 text-zinc-600 hover:border-[#FF5100]/30 hover:text-zinc-900 hover:bg-zinc-50"
                }
            `}
        >
            {label}
            <span
                className={`
                    text-xs font-bold px-1.5 py-0.5 rounded-md min-w-5 text-center
                    ${active ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"}
                `}
            >
                {count}
            </span>
        </button>
    );
}

function VehicleSection({
    vehicles,
    categoryId,
    categoryName,
    showViewAll,
}: {
    vehicles: IVehicle[];
    categoryId: string;
    categoryName: string;
    showViewAll: boolean;
}) {
    const displayed = vehicles.slice(0, 12);
    const remaining = vehicles.length - 12;

    return (
        <motion.div
            key={categoryId}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeOut" as const }}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayed.map((vehicle, i) => (
                    <motion.div
                        key={vehicle.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.3,
                            ease: "easeOut" as const,
                            delay: i * 0.04,
                        }}
                    >
                        <VehicleCard vehicle={vehicle} />
                    </motion.div>
                ))}
            </div>

            {/* View all CTA if more than 12 */}
            {showViewAll && remaining > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="mt-8 flex justify-center"
                >
                    <Link
                        href={`/vehicles?category=${categoryId}`}
                        className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-zinc-700 hover:border-[#FF5100]/30 hover:text-[#FF5100] hover:bg-[#FF5100]/5 transition-all duration-200 shadow-sm"
                    >
                        View all {vehicles.length} {categoryName} vehicles
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </motion.div>
            )}
        </motion.div>
    );
}

function EmptyState({ name }: { name: string }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 border-2 border-dashed border-zinc-200 rounded-2xl"
        >
            <LayoutGrid className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-zinc-700">
                No vehicles in {name}
            </h3>
            <p className="text-sm text-zinc-400 mt-1">
                Check back later — new vehicles are added regularly.
            </p>
        </motion.div>
    );
}

export default function VehicleCategory({
    vehicleCategory,
}: {
    vehicleCategory: IVehicleCategory[];
}) {
    if (!vehicleCategory.length) return null;

    const [activeId, setActiveId] = useState<string>(ALL_ID);

    // Pre-compute vehicle lists once
    const categoryVehicleMap = useMemo(() => {
        const map = new Map<string, IVehicle[]>();
        map.set(ALL_ID, getAllVehicles(vehicleCategory));
        for (const cat of vehicleCategory) {
            map.set(cat.id, getVehiclesForCategory(cat));
        }
        return map;
    }, [vehicleCategory]);

    const totalVehicles = categoryVehicleMap.get(ALL_ID)?.length ?? 0;

    const activeVehicles = categoryVehicleMap.get(activeId) ?? [];
    const activeName =
        activeId === ALL_ID
            ? "All"
            : (vehicleCategory.find((c) => c.id === activeId)?.name ?? "");

    return (
        <section className="relative py-20 overflow-hidden">
            {/* Dot grid background */}
            <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                // style={{
                //     backgroundImage:
                //         "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
                //     backgroundSize: "28px 28px",
                // }}
            />
            {/* <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#FF5100]/5 blur-3xl pointer-events-none" /> */}

            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
                {/* ── Section Header ── */}
                <motion.div
                    className="mb-10"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" as const }}
                >
                    <div className="flex items-center justify-center gap-2 bg-[#FF5100]/8 border border-[#FF5100]/15 text-[#FF5100] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4 w-fit mx-auto">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF5100] animate-pulse" />
                        Browse by Category
                    </div>
                    {/* <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"> */}
                    <div className="flex flex-col items-center justify-center">
                        <h2 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight">
                            Find your{" "}
                            <span className="text-[#FF5100]">perfect</span> ride
                        </h2>
                        <p className="mt-4 text-base text-zinc-500 leading-relaxed">
                            {totalVehicles} vehicles across{" "}
                            {vehicleCategory.length} categories — something for
                            every road.
                        </p>
                    </div>

                    {/* Active category label */}
                    {/* <div className="text-xs font-semibold text-zinc-400 hidden sm:block">
                            Showing:{" "}
                            <span className="text-zinc-700">{activeName}</span>
                            {" · "}
                            <span className="text-[#FF5100]">
                                {activeVehicles.length} vehicles
                            </span>
                        </div> */}
                    {/* </div> */}
                </motion.div>

                {/* ── Tab Pills ── */}
                <motion.div
                    className="flex items-center justify-center gap-2.5 overflow-x-auto pb-2 mb-8 scrollbar-none"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.4,
                        delay: 0.1,
                        ease: "easeOut" as const,
                    }}
                >
                    {/* All tab */}
                    <TabPill
                        label="All"
                        count={totalVehicles}
                        active={activeId === ALL_ID}
                        onClick={() => setActiveId(ALL_ID)}
                    />

                    {/* Per-category tabs */}
                    {vehicleCategory.map((cat) => (
                        <TabPill
                            key={cat.id}
                            label={cat.name}
                            count={categoryVehicleMap.get(cat.id)?.length ?? 0}
                            active={activeId === cat.id}
                            onClick={() => setActiveId(cat.id)}
                        />
                    ))}
                </motion.div>

                {/* ── Vehicles ── */}
                <AnimatePresence mode="wait">
                    {activeVehicles.length > 0 ? (
                        <VehicleSection
                            key={activeId}
                            vehicles={activeVehicles}
                            categoryId={activeId}
                            categoryName={activeName}
                            showViewAll={activeId !== ALL_ID}
                        />
                    ) : (
                        <EmptyState key="empty" name={activeName} />
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
