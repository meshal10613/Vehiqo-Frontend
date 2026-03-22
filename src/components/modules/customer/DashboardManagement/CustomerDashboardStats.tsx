"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ICustomerStats } from "../../../../types/stats.type";
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
    CartesianGrid,
    RadialBarChart,
    RadialBar,
} from "recharts";
import {
    CalendarCheck,
    CreditCard,
    Star,
    TrendingUp,
    RefreshCcw,
    MoreHorizontal,
    ArrowUpRight,
    DollarSign,
    Clock,
    CheckCircle2,
    XCircle,
    Wallet,
    Receipt,
    Banknote,
    BadgeCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getStats } from "../../../../services/stats.services";

// ── CONSTANTS & UTILS ─────────────────────────────────────────────────────────

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

function fmt(n: number) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return new Intl.NumberFormat("en-US").format(n);
}

function fmtCurrency(n: number) {
    return `৳${fmt(n)}`;
}

// ── ANIMATIONS ────────────────────────────────────────────────────────────────

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

// 1. Header
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
                My Dashboard
            </h1>
            <p className="text-zinc-500 mt-1">
                A summary of your bookings, payments, and activity.
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
                {isRefetching ? "Updating..." : "Refresh"}
            </button>
        </div>
    </div>
);

// 2. KPI Card
const KpiCard = ({
    title,
    value,
    icon: Icon,
    sub,
    color,
    trend,
}: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    sub?: string;
    color: string;
    trend?: string;
}) => (
    <motion.div
        variants={itemVar}
        className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300"
    >
        <div className="flex justify-between items-start mb-4">
            <div
                className="p-3 rounded-xl transition-colors"
                style={{ backgroundColor: `${color}15`, color }}
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
                {value}
            </h3>
            {sub && <p className="text-xs text-zinc-400 mt-2">{sub}</p>}
        </div>
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

// 5. Stat Row (used inside cards for labelled metric lists)
const StatRow = ({
    label,
    value,
    color,
    icon: Icon,
}: {
    label: string;
    value: number;
    color: string;
    icon?: React.ElementType;
}) => (
    <div className="flex items-center justify-between py-2.5 border-b border-zinc-100 last:border-0">
        <div className="flex items-center gap-2.5">
            <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: color }}
            />
            {Icon && <Icon className="h-3.5 w-3.5 text-zinc-400" />}
            <span className="text-sm text-zinc-600">{label}</span>
        </div>
        <span className="text-sm font-bold text-zinc-900">{fmt(value)}</span>
    </div>
);

// 6. Progress Bar Row (used in payment type breakdown)
const ProgressRow = ({
    label,
    value,
    total,
    color,
}: {
    label: string;
    value: number;
    total: number;
    color: string;
}) => {
    const pct = total > 0 ? Math.round((value / total) * 100) : 0;
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
                <span className="text-zinc-600 font-medium">{label}</span>
                <span className="text-zinc-400">
                    {fmtCurrency(value)}{" "}
                    <span className="text-zinc-300">·</span>{" "}
                    <span style={{ color }}>{pct}%</span>
                </span>
            </div>
            <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                />
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-80 bg-zinc-200 rounded-2xl" />
            <div className="h-80 bg-zinc-200 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-zinc-200 rounded-2xl" />
            ))}
        </div>
    </div>
);

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function CustomerDashboardStats() {
    const {
        data: statsData,
        isLoading,
        refetch,
        isRefetching,
    } = useQuery({
        queryKey: ["stats"],
        queryFn: () => getStats(),
    });

    const stats: ICustomerStats = statsData?.data;

    const chartData = useMemo(() => {
        if (!stats) return null;

        return {
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
                    name: "Returned",
                    value: stats.booking.status.returned,
                    fill: PALETTE.cyan,
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

            paymentStatus: [
                {
                    name: "Paid",
                    value: stats.payment.status.paid,
                    color: PALETTE.emerald,
                },
                {
                    name: "Pending",
                    value: stats.payment.status.pending,
                    color: PALETTE.amber,
                },
                {
                    name: "Unpaid",
                    value: stats.payment.status.unpaid,
                    color: PALETTE.zinc,
                },
                {
                    name: "Failed",
                    value: stats.payment.status.failed,
                    color: PALETTE.rose,
                },
                {
                    name: "Refunded",
                    value: stats.payment.status.refunded,
                    color: PALETTE.cyan,
                },
            ].filter((d) => d.value > 0),

            paymentMethods: [
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
                    name: "bKash",
                    value: stats.payment.method.bkash,
                    fill: PALETTE.rose,
                },
                {
                    name: "Nagad",
                    value: stats.payment.method.nogod,
                    fill: PALETTE.orange,
                },
            ].filter((d) => d.value > 0),
        };
    }, [stats]);

    if (isLoading) return <DashboardSkeleton />;
    if (!stats || !chartData) return null;

    // Active booking = picked up
    const activeBookings = stats.booking.status.pickedUp;
    const completionRate =
        stats.booking.total > 0
            ? Math.round(
                  (stats.booking.status.completed / stats.booking.total) * 100,
              )
            : 0;

    return (
        <div className="bg-zinc-50/50 min-h-screen pb-10">
            <DashboardHeader onRefresh={refetch} isRefetching={isRefetching} />

            <motion.div
                variants={containerVar}
                initial="hidden"
                animate="visible"
                className="space-y-6"
            >
                {/* ── Section 1: Top KPIs ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard
                        title="Total Spent"
                        value={fmtCurrency(stats.payment.totalSpent)}
                        icon={DollarSign}
                        color={PALETTE.emerald}
                        sub={`${stats.payment.status.paid} paid transactions`}
                    />
                    <KpiCard
                        title="Total Bookings"
                        value={fmt(stats.booking.total)}
                        icon={CalendarCheck}
                        color={PALETTE.blue}
                        sub={`${stats.booking.status.pending} pending approval`}
                    />
                    <KpiCard
                        title="Active Rentals"
                        value={fmt(activeBookings)}
                        icon={TrendingUp}
                        color={PALETTE.orange}
                        sub="Currently on the road"
                    />
                    <KpiCard
                        title="Reviews Given"
                        value={fmt(stats.review.total)}
                        icon={Star}
                        color={PALETTE.violet}
                        sub="Feedback submitted"
                    />
                </div>

                {/* ── Section 2: Booking Pipeline + Payment Status Donut ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Booking pipeline bar */}
                    <ChartCard
                        title="Booking History"
                        subtitle="All-time booking status breakdown"
                        className="lg:col-span-2"
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

                    {/* Payment Status Donut */}
                    <ChartCard
                        title="Payment Status"
                        subtitle="Transaction outcomes"
                    >
                        <div className="relative h-52 w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData.paymentStatus}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={78}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {chartData.paymentStatus.map(
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
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-bold text-zinc-800">
                                    {completionRate}%
                                </span>
                                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                                    Success
                                </span>
                            </div>
                        </div>
                        <div className="space-y-0.5 mt-2">
                            {chartData.paymentStatus.map((item, i) => (
                                <StatRow
                                    key={i}
                                    label={item.name}
                                    value={item.value}
                                    color={item.color}
                                />
                            ))}
                        </div>
                    </ChartCard>
                </div>

                {/* ── Section 3: Payment Details ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Payment Methods Pie */}
                    <ChartCard
                        title="Payment Methods"
                        subtitle="How you pay"
                    >
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={chartData.paymentMethods}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={75}
                                    dataKey="value"
                                >
                                    {chartData.paymentMethods.map(
                                        (entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.fill}
                                                stroke="white"
                                                strokeWidth={2}
                                            />
                                        ),
                                    )}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-wrap justify-center gap-3 mt-2">
                            {chartData.paymentMethods.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-1.5 text-xs text-zinc-600"
                                >
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ background: item.fill }}
                                    />
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    </ChartCard>

                    {/* Payment Type Breakdown */}
                    <ChartCard
                        title="Payment Breakdown"
                        subtitle="By transaction type"
                    >
                        <div className="space-y-4 mt-1">
                            <ProgressRow
                                label="Advance Payments"
                                value={stats.payment.type.advance}
                                total={stats.payment.total}
                                color={PALETTE.blue}
                            />
                            <ProgressRow
                                label="Final Payments"
                                value={stats.payment.type.final}
                                total={stats.payment.total}
                                color={PALETTE.emerald}
                            />
                            <ProgressRow
                                label="Full Payments"
                                value={stats.payment.type.full}
                                total={stats.payment.total}
                                color={PALETTE.violet}
                            />
                            <ProgressRow
                                label="Refunds"
                                value={stats.payment.type.refund}
                                total={stats.payment.total}
                                color={PALETTE.rose}
                            />
                        </div>
                        <div className="mt-5 pt-4 border-t border-zinc-100 flex justify-between items-center">
                            <span className="text-xs text-zinc-500 font-medium">
                                Total Transactions
                            </span>
                            <span className="text-sm font-bold text-zinc-900">
                                {fmtCurrency(stats.payment.total)}
                            </span>
                        </div>
                    </ChartCard>

                    {/* Quick Stats Summary */}
                    <ChartCard
                        title="Quick Summary"
                        subtitle="At a glance"
                        action={
                            <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                                <BadgeCheck className="h-3 w-3" /> Verified
                            </div>
                        }
                    >
                        <div className="space-y-1 mt-1">
                            <StatRow
                                label="Completed Rentals"
                                value={stats.booking.status.completed}
                                color={PALETTE.emerald}
                                icon={CheckCircle2}
                            />
                            <StatRow
                                label="Confirmed Bookings"
                                value={stats.booking.status.advancePaid}
                                color={PALETTE.blue}
                                icon={CalendarCheck}
                            />
                            <StatRow
                                label="Pending Bookings"
                                value={stats.booking.status.pending}
                                color={PALETTE.amber}
                                icon={Clock}
                            />
                            <StatRow
                                label="Cancelled"
                                value={stats.booking.status.cancelled}
                                color={PALETTE.rose}
                                icon={XCircle}
                            />
                            <StatRow
                                label="Refunds Received"
                                value={stats.payment.status.refunded}
                                color={PALETTE.cyan}
                                icon={Wallet}
                            />
                            <StatRow
                                label="Reviews Given"
                                value={stats.review.total}
                                color={PALETTE.violet}
                                icon={Star}
                            />
                        </div>
                    </ChartCard>
                </div>
            </motion.div>
        </div>
    );
}