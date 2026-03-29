"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStats } from "../../../../services/stats.services";
import { IAdminStats } from "../../../../types/stats.type";
import { motion, type Variants } from "framer-motion";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    RadialBarChart,
    RadialBar,
    Legend,
    AreaChart,
    Area,
    CartesianGrid,
} from "recharts";
import {
    Car,
    Users,
    CalendarCheck,
    CreditCard,
    Star,
    Layers,
    Fuel,
    TrendingUp,
    Activity,
    RefreshCcw,
    MoreHorizontal,
    ArrowUpRight,
    Zap,
    DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── CONSTANTS & UTILS ─────────────────────────────────────────────────────────

const BRAND = {
    primary: "#FF5100",
    primaryLight: "#FFF0E6", // Light orange background
    text: "#18181B", // Zinc 900
    muted: "#71717A", // Zinc 500
    border: "#E4E4E7", // Zinc 200
};

const PALETTE = {
    orange: "#FF5100",
    amber: "#F59E0B",
    emerald: "#10B981",
    blue: "#3B82F6",
    violet: "#8B5CF6",
    rose: "#F43F5E",
    cyan: "#06B6D4",
    zinc: "#71717A",
    slate: "#64748B",
    dark: "#1F2937",
};

const CHART_COLORS = [
    PALETTE.orange,
    PALETTE.blue,
    PALETTE.emerald,
    PALETTE.violet,
    PALETTE.amber,
    PALETTE.rose,
    PALETTE.cyan,
    PALETTE.zinc,
];

function fmt(n: number) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return new Intl.NumberFormat("en-US").format(n);
}

// ── ANIMATIONS ───────────────────────────────────────────────────────────────

const containerVar: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
    },
};

const itemVar: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

// ── SUB-COMPONENTS ────────────────────────────────────────────────────────────

// 1. Dashboard Header
const DashboardHeader = ({
    onRefresh,
    isRefetching,
}: {
    onRefresh: () => void;
    isRefetching: boolean;
}) => (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                Executive Overview
            </h1>
            <p className="text-zinc-500 mt-1">
                Real-time insights into fleet, bookings, and financial
                performance.
            </p>
        </div>
        <div className="flex items-center gap-2">
            <button
                onClick={onRefresh}
                disabled={isRefetching}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-orange-600 transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
            >
                <RefreshCcw
                    className={cn("h-4 w-4", isRefetching && "animate-spin")}
                />
                {isRefetching ? "Updating..." : "Refresh Data"}
            </button>
            <div className="px-4 py-2 bg-orange-50 text-orange-700 text-sm font-medium rounded-lg border border-orange-100">
                Live
            </div>
        </div>
    </div>
);

// 2. Kpi Card
const KpiCard = ({
    title,
    value,
    icon: Icon,
    trend,
    sub,
    color,
}: {
    title: string;
    value: string | number;
    icon: any;
    trend?: string;
    sub?: string;
    color: string;
}) => (
    <motion.div
        variants={itemVar}
        className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300"
    >
        <div className="flex justify-between items-start mb-4">
            <div
                className="p-3 rounded-xl transition-colors"
                style={{ backgroundColor: `${color}15`, color: color }}
            >
                <Icon className="h-6 w-6" />
            </div>
            {trend && (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <ArrowUpRight className="h-3 w-3" />
                    {trend}
                </span>
            )}
        </div>
        <div>
            <p className="text-sm font-medium text-zinc-500 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-zinc-900 tracking-tight">
                {fmt(Number(value))}
            </h3>
            {sub && <p className="text-xs text-zinc-400 mt-2">{sub}</p>}
        </div>
        {/* Decorative gradient blob */}
        <div
            className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl"
            style={{ backgroundColor: color }}
        />
    </motion.div>
);

// 3. Chart Container
const ChartCard = ({
    title,
    subtitle,
    children,
    action,
    className,
}: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}) => (
    <motion.div
        variants={itemVar}
        className={cn(
            "flex flex-col rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden",
            className,
        )}
    >
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/30">
            <div>
                <h3 className="text-base font-semibold text-zinc-800">
                    {title}
                </h3>
                {subtitle && (
                    <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>
                )}
            </div>
            {action || (
                <button className="text-zinc-400 hover:text-zinc-600">
                    <MoreHorizontal className="h-5 w-5" />
                </button>
            )}
        </div>
        <div className="p-6 flex-1 min-h-62.5">{children}</div>
    </motion.div>
);

// 4. Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white/95 backdrop-blur-md border border-zinc-200 p-3 rounded-xl shadow-xl text-sm z-50">
            {label && (
                <p className="font-semibold text-zinc-700 mb-2">{label}</p>
            )}
            <div className="space-y-1">
                {payload.map((entry: any, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{
                                backgroundColor: entry.color || entry.fill,
                            }}
                        />
                        <span className="text-zinc-500">{entry.name}:</span>
                        <span className="font-bold text-zinc-900">
                            {typeof entry.value === "number"
                                ? fmt(entry.value)
                                : entry.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ── SKELETON ──────────────────────────────────────────────────────────────────

const DashboardSkeleton = () => (
    <div className="space-y-8 animate-pulse">
        <div className="h-12 w-1/3 bg-zinc-200 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-40 bg-zinc-200 rounded-2xl" />
            ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
            <div className="lg:col-span-2 bg-zinc-200 rounded-2xl" />
            <div className="bg-zinc-200 rounded-2xl" />
        </div>
    </div>
);

export default function AdminDashboardStats() {
    const {
        data: statsData,
        isLoading,
        refetch,
        isRefetching,
    } = useQuery({
        queryKey: ["stats"],
        queryFn: () => getStats(),
    });

    const stats: IAdminStats = statsData?.data;

    // ── Data Transformation using useMemo for performance ──
    const chartData = useMemo(() => {
        if (!stats) return null;

        return {
            vehicleStatus: [
                {
                    name: "Available",
                    value: stats.vehicle.status.available,
                    color: PALETTE.emerald,
                },
                {
                    name: "Rented",
                    value: stats.vehicle.status.rented,
                    color: PALETTE.orange,
                },
                {
                    name: "Maintenance",
                    value: stats.vehicle.status.maintenance,
                    color: PALETTE.amber,
                },
                {
                    name: "Booked",
                    value: stats.vehicle.status.booked,
                    color: PALETTE.blue,
                },
                {
                    name: "Retired",
                    value: stats.vehicle.status.retired,
                    color: PALETTE.zinc,
                },
            ].filter((d) => d.value > 0),

            bookingStatus: [
                {
                    name: "Pending",
                    value: stats.booking.status.pending,
                    fill: PALETTE.amber,
                },
                {
                    name: "Confirmed",
                    value: stats.booking.status.advancePaid,
                    fill: PALETTE.blue,
                },
                {
                    name: "Active",
                    value: stats.booking.status.pickedUp,
                    fill: PALETTE.violet,
                },
                {
                    name: "Completed",
                    value: stats.booking.status.completed,
                    fill: PALETTE.emerald,
                },
                {
                    name: "Cancelled",
                    value: stats.booking.status.cancelled,
                    fill: PALETTE.rose,
                },
            ].filter((d) => d.value > 0),

            revenue: [
                {
                    name: "Stripe",
                    value: stats.payment.method.stripe,
                    fill: PALETTE.blue,
                },
                {
                    name: "SSLCommerz",
                    value: stats.payment.method.sslcommerz,
                    fill: PALETTE.dark,
                },
                {
                    name: "Cash",
                    value: stats.payment.method.cash,
                    fill: PALETTE.emerald,
                },
                {
                    name: "Mobile Money",
                    value:
                        stats.payment.method.bkash + stats.payment.method.nogod,
                    fill: PALETTE.rose,
                },
            ].filter((d) => d.value > 0),

            transmission: [
                {
                    name: "Auto",
                    value: stats.vehicle.transmission.automatic,
                    fill: PALETTE.orange,
                },
                {
                    name: "Manual",
                    value: stats.vehicle.transmission.manual,
                    fill: PALETTE.slate,
                },
            ].filter((d) => d.value > 0),
        };
    }, [stats]);

    if (isLoading) return <DashboardSkeleton />;
    if (!stats || !chartData) return null;

    return (
        <div className="bg-zinc-50/50 min-h-screen pb-10">
            <DashboardHeader onRefresh={refetch} isRefetching={isRefetching} />

            <motion.div
                variants={containerVar}
                initial="hidden"
                animate="visible"
                className="space-y-6"
            >
                {/* ── Section 1: Top Level Metrics ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard
                        title="Total Revenue"
                        value={stats.payment.total}
                        icon={DollarSign}
                        color={PALETTE.emerald}
                        sub={`${stats.payment.status.paid} successful transactions`}
                    />
                    <KpiCard
                        title="Total Bookings"
                        value={stats.booking.total}
                        icon={CalendarCheck}
                        color={PALETTE.blue}
                        // trend="12% vs last month"
                        sub={`${stats.booking.status.pending} pending approval`}
                    />
                    <KpiCard
                        title="Fleet Size"
                        value={stats.vehicle.total}
                        icon={Car}
                        color={PALETTE.orange}
                        sub={`${stats.vehicle.status.available} currently available`}
                    />
                    <KpiCard
                        title="Active Users"
                        value={stats.user.customer}
                        icon={Users}
                        color={PALETTE.violet}
                        sub="Registered customers"
                    />
                </div>

                {/* ── Section 2: Operational Overview (Bento Grid) ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Chart: Booking Pipeline */}
                    <ChartCard
                        title="Booking Pipeline"
                        subtitle="Distribution of current booking statuses"
                        className="lg:col-span-2 shadow-sm border-zinc-200"
                    >
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={chartData.bookingStatus}
                                layout="vertical"
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                                barSize={32}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    horizontal={false}
                                    stroke="#E4E4E7"
                                />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    tick={{
                                        fontSize: 12,
                                        fill: "#52525B",
                                        fontWeight: 500,
                                    }}
                                    width={100}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: "#F4F4F5", radius: 4 }}
                                    content={<CustomTooltip />}
                                />
                                <Bar
                                    dataKey="value"
                                    name="Bookings"
                                    radius={[0, 4, 4, 0]}
                                    animationDuration={1000}
                                >
                                    {chartData.bookingStatus.map(
                                        (entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.fill}
                                            />
                                        ),
                                    )}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* Secondary Chart: Vehicle Status */}
                    <ChartCard
                        title="Fleet Status"
                        subtitle="Real-time availability"
                    >
                        <div className="relative h-62.5 w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData.vehicleStatus}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={85}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.vehicleStatus.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                    strokeWidth={0}
                                                />
                                            ),
                                        )}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Text Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-bold text-zinc-800">
                                    {stats.vehicle.total}
                                </span>
                                <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                                    Vehicles
                                </span>
                            </div>
                        </div>
                        {/* Custom Legend below chart */}
                        <div className="flex flex-wrap justify-center gap-3 mt-4">
                            {chartData.vehicleStatus
                                .slice(0, 3)
                                .map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-1.5 text-xs text-zinc-600"
                                    >
                                        <div
                                            className="w-2.5 h-2.5 rounded-full"
                                            style={{ background: item.color }}
                                        />
                                        {item.name}
                                    </div>
                                ))}
                        </div>
                    </ChartCard>
                </div>

                {/* ── Section 3: Financials & Details ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Revenue Source */}
                    <ChartCard
                        title="Payment Methods"
                        subtitle="Transaction volume by provider"
                    >
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={chartData.revenue}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="value"
                                >
                                    {chartData.revenue.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.fill}
                                            stroke="white"
                                            strokeWidth={2}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    iconType="circle"
                                    layout="vertical"
                                    verticalAlign="middle"
                                    align="right"
                                    wrapperStyle={{
                                        fontSize: "12px",
                                        color: "#52525B",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* User Roles */}
                    <ChartCard
                        title="Platform Users"
                        subtitle="Role distribution"
                    >
                        <div className="space-y-4 mt-2">
                            {[
                                {
                                    label: "Customers",
                                    count: stats.user.customer,
                                    color: PALETTE.blue,
                                    icon: Users,
                                },
                                {
                                    label: "Admins",
                                    count: stats.user.admin,
                                    color: PALETTE.orange,
                                    icon: Star,
                                },
                                // {
                                //     label: "Staff",
                                //     count: stats.user.user,
                                //     color: PALETTE.zinc,
                                //     icon: Activity,
                                // },
                            ].map((role, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-100"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-white shadow-sm text-zinc-500">
                                            <role.icon className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-medium text-zinc-700">
                                            {role.label}
                                        </span>
                                    </div>
                                    <span className="text-lg font-bold text-zinc-900">
                                        {role.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </ChartCard>

                    {/* Fuel Market Watch */}
                    <ChartCard
                        title="Fuel Market"
                        subtitle="Current pricing rules"
                        action={
                            <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                                <Zap className="h-3 w-3" /> Live
                            </div>
                        }
                    >
                        <div className="overflow-y-auto max-h-55 pr-2 space-y-2 scrollbar-thin scrollbar-thumb-zinc-200">
                            {stats.fuelPrice.map((fp, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between py-3 border-b border-zinc-100 last:border-0 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-orange-100/50 flex items-center justify-center text-orange-600">
                                            <Fuel className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-800">
                                                {fp.fuelType}
                                            </p>
                                            <p className="text-[10px] uppercase text-zinc-400 font-bold tracking-wider">
                                                Per {fp.unit}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-zinc-900">
                                            ৳{fp.pricePerUnit}
                                        </p>
                                        <span className="text-[10px] text-emerald-500 flex items-center justify-end gap-0.5">
                                            <TrendingUp className="h-3 w-3" />{" "}
                                            Updated
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ChartCard>
                </div>
            </motion.div>
        </div>
    );
}
