"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../../../ui/dialog";
import { Badge } from "../../../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";
import { IUser } from "../../../../types/user.type";
import { format } from "date-fns";
import {
    Calendar,
    CalendarCheck,
    CheckCircle2,
    IdCard,
    Mail,
    Phone,
    Shield,
    Star,
    User,
    Users,
    XCircle,
    Venus,
    Mars,
    CircleHelp,
    CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── helpers ───────────────────────────────────────────────────────────────────

const formatDate = (date: string | Date) =>
    new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

const formatDateTime = (date: string | Date) =>
    format(new Date(date), "dd MMM yyyy, hh:mm a");

// ── InfoRow ───────────────────────────────────────────────────────────────────

const InfoRow = ({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
}) => (
    <div className="group flex items-start gap-3 rounded-xl px-4 py-3.5 transition-colors duration-150 hover:bg-zinc-50">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-50 border border-orange-100 group-hover:bg-orange-100 transition-colors duration-150">
            <Icon className="h-3.5 w-3.5 text-[#FF5100]" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[11px] text-zinc-400 font-semibold uppercase tracking-widest">
                {label}
            </p>
            <div className="text-sm font-medium text-zinc-800 mt-0.5 wrap-break-word">
                {value ?? (
                    <span className="text-zinc-300 font-normal italic text-sm">
                        Not provided
                    </span>
                )}
            </div>
        </div>
    </div>
);

// ── gender icon helper ────────────────────────────────────────────────────────

function GenderIcon({ gender }: { gender?: string | null }) {
    if (gender === "MALE")
        return <Mars className="h-3.5 w-3.5 text-[#FF5100]" />;
    if (gender === "FEMALE")
        return <Venus className="h-3.5 w-3.5 text-[#FF5100]" />;
    return <CircleHelp className="h-3.5 w-3.5 text-[#FF5100]" />;
}

// ── role badge config ─────────────────────────────────────────────────────────

const roleVariant: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
> = {
    ADMIN: "destructive",
    MODERATOR: "secondary",
    USER: "outline",
};

const roleColor: Record<string, string> = {
    ADMIN: "border-red-200 text-red-600 bg-red-50",
    MODERATOR: "border-violet-200 text-violet-600 bg-violet-50",
    USER: "border-zinc-200 text-zinc-500 bg-zinc-50",
};

// ── props ─────────────────────────────────────────────────────────────────────

interface ViewUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: IUser | null;
}

// ── component ─────────────────────────────────────────────────────────────────

export default function ViewUserDialog({
    open,
    onOpenChange,
    user,
}: ViewUserDialogProps) {
    if (!user) return null;

    const initials = user.name
        .split(" ")
        .map((p) => p.charAt(0).toUpperCase())
        .join("")
        .slice(0, 2);

    const isAdmin = user.role === "ADMIN";
    const bookingCount = user.bookings?.length ?? 0;
    const reviewCount = user.reviews?.length ?? 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100vw-1.5rem)] max-w-md gap-0 overflow-hidden p-0">
                {/* Top accent bar */}
                <div className="h-1 w-full bg-linear-to-r from-orange-400 via-[#FF5100] to-orange-400" />

                <DialogHeader className="border-b px-6 py-5">
                    <DialogTitle className="text-base font-bold text-zinc-900">
                        User Details
                    </DialogTitle>
                    <DialogDescription className="text-sm text-zinc-400">
                        Detailed information about this user.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-5 space-y-4 max-h-[calc(90vh-9rem)] overflow-y-auto">
                    {/* ── Avatar + name + badges ── */}
                    <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                            <Avatar className="h-20 w-20 border-2 border-orange-100 shadow-md">
                                <AvatarImage
                                    src={user.image ?? undefined}
                                    alt={initials}
                                />
                                <AvatarFallback className="text-2xl font-bold bg-orange-50 text-[#FF5100]">
                                    {initials || "U"}
                                </AvatarFallback>
                            </Avatar>
                            {/* email verified dot */}
                            <span
                                className={cn(
                                    "absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full border-2 border-white flex items-center justify-center",
                                    user.emailVerified
                                        ? "bg-emerald-500"
                                        : "bg-zinc-300",
                                )}
                                title={
                                    user.emailVerified
                                        ? "Email verified"
                                        : "Email not verified"
                                }
                            >
                                {user.emailVerified ? (
                                    <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                                ) : (
                                    <XCircle className="h-2.5 w-2.5 text-white" />
                                )}
                            </span>
                        </div>

                        <div className="space-y-1.5 min-w-0">
                            <h2 className="text-lg font-bold text-zinc-900 truncate">
                                {user.name}
                            </h2>
                            <p className="text-sm text-zinc-400 truncate">
                                {user.email}
                            </p>
                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5",
                                        roleColor[user.role],
                                    )}
                                >
                                    {user.role}
                                </Badge>
                                {user.gender && (
                                    <Badge
                                        variant="outline"
                                        className="border-zinc-200 text-zinc-500 bg-zinc-50 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5"
                                    >
                                        {user.gender}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Stats row (non-admin only) ── */}
                    {!isAdmin && (
                        <div className="flex gap-2">
                            {[
                                {
                                    label: "Bookings",
                                    value: bookingCount,
                                    icon: CalendarCheck,
                                },
                                {
                                    label: "Reviews",
                                    value: reviewCount,
                                    icon: Star,
                                },
                            ].map(({ label, value, icon: Icon }) => (
                                <div
                                    key={label}
                                    className="flex-1 flex flex-col items-center justify-center gap-1 rounded-xl border border-zinc-100 bg-zinc-50 py-3"
                                >
                                    <Icon className="h-4 w-4 text-[#FF5100]" />
                                    <p className="text-base font-bold text-zinc-800">
                                        {value}
                                    </p>
                                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                                        {label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="h-px bg-zinc-100" />

                    {/* ── Info rows ── */}
                    <div className="divide-y divide-zinc-50 -mx-2">
                        <InfoRow
                            icon={User}
                            label="Full Name"
                            value={user.name}
                        />
                        <InfoRow
                            icon={Mail}
                            label="Email"
                            value={
                                <span className="flex items-center gap-1.5">
                                    {user.email}
                                    {user.emailVerified ? (
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                    ) : (
                                        <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                                    )}
                                </span>
                            }
                        />
                        <InfoRow
                            icon={Phone}
                            label="Mobile"
                            value={user.mobileNumber}
                        />
                        <InfoRow
                            icon={() => <GenderIcon gender={user.gender} />}
                            label="Gender"
                            value={
                                user.gender ? (
                                    <span className="capitalize">
                                        {user.gender.charAt(0) +
                                            user.gender.slice(1).toLowerCase()}
                                    </span>
                                ) : null
                            }
                        />
                        <InfoRow
                            icon={Shield}
                            label="Role"
                            value={
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5",
                                        roleColor[user.role],
                                    )}
                                >
                                    {user.role}
                                </Badge>
                            }
                        />

                        {/* License — show only if present */}
                        {user.licenseNumber && (
                            <InfoRow
                                icon={IdCard}
                                label="License No."
                                value={user.licenseNumber}
                            />
                        )}

                        {/* NID — show only if present */}
                        {user.nidNumber && (
                            <InfoRow
                                icon={CreditCard}
                                label="NID Number"
                                value={user.nidNumber}
                            />
                        )}

                        <InfoRow
                            icon={Calendar}
                            label="Joined"
                            value={formatDateTime(user.createdAt)}
                        />
                        <InfoRow
                            icon={Calendar}
                            label="Last Updated"
                            value={formatDate(user.updatedAt)}
                        />
                    </div>

                    {/* ── Admin note ── */}
                    {isAdmin && (
                        <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                            <Shield className="h-4 w-4 text-red-400 shrink-0" />
                            <p className="text-xs text-red-500 font-medium">
                                Admin accounts do not have booking or review
                                activity.
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
