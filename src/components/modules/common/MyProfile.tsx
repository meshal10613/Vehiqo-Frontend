"use client";

import { IUser } from "../../../types/user.type";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    Car,
    CheckCircle2,
    IdCard,
    Mail,
    Pencil,
    Phone,
    ShieldCheck,
    User,
    XCircle,
} from "lucide-react";
import { Button } from "../../ui/button";
import EditMyProfileModal from "./EditMyProfileModal";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "../../../services/auth.services";
import LoadingSpinner from "../../shared/LoadingSpinner";

const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
};

const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

const InfoRow = ({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
}) => (
    <div className="group flex items-start gap-4 rounded-xl px-4 py-4 transition-colors duration-150 hover:bg-zinc-50">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-50 border border-orange-100 group-hover:bg-orange-100 transition-colors duration-150">
            <Icon className="h-3.5 w-3.5 text-[#FF5100]" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[11px] text-zinc-400 font-semibold uppercase tracking-widest">
                {label}
            </p>
            <div className="text-sm font-medium text-zinc-800 mt-0.5">
                {value ?? (
                    <span className="text-zinc-300 font-normal italic text-sm">
                        Not provided
                    </span>
                )}
            </div>
        </div>
    </div>
);

const SectionHeader = ({
    icon: Icon,
    title,
}: {
    icon: React.ElementType;
    title: string;
}) => (
    <div className="flex items-center gap-2.5 px-4 pb-2 pt-1">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FF5100]/10">
            <Icon className="h-3.5 w-3.5 text-[#FF5100]" />
        </div>
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            {title}
        </h2>
        <div className="flex-1 h-px bg-zinc-100" />
    </div>
);

export default function MyProfile() {
    const {
        data: userData,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ["user"],
        queryFn: () => getUserInfo(),
    });
    const user = userData as IUser;
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="relative min-h-screen px-4 py-8">
            {/* Dot grid */}
            <div
                className="fixed inset-0 opacity-[0.15] pointer-events-none"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, #FF510018 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                }}
            />

            {/* Glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none">
                <div className="w-125 h-125 rounded-full bg-orange-300/10 blur-3xl" />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="relative z-10 mx-auto w-full space-y-5"
            >
                {/* Hero card */}
                <motion.div variants={itemVariants}>
                    <Card className="overflow-hidden border-zinc-200 shadow-xl shadow-zinc-100 gap-0 py-0">
                        <div className="h-1 w-full bg-linear-to-r from-orange-400 via-[#FF5100] to-orange-400" />

                        {/* Cover strip */}
                        <div className="relative h-60 xl:h-98 overflow-hidden">
                            <Image
                                src="https://i.ibb.co.com/tMyfQxYJ/banner4.png"
                                alt="Profile cover"
                                fill
                                className="object-cover"
                                priority
                            />
                            {/* subtle overlay to keep contrast */}
                            <div className="absolute inset-0 bg-black/10" />
                        </div>

                        <CardContent className="px-6 pb-6 -mt-16 relative z-20">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                {/* Avatar */}
                                <div className="relative shrink-0 w-fit">
                                    {user.image ? (
                                        <div className="h-40 w-40 rounded-full border-[5px] border-white shadow-xl overflow-hidden ring-2 ring-orange-100">
                                            <Image
                                                src={user.image}
                                                alt={user.name}
                                                width={96}
                                                height={96}
                                                className="object-cover w-full h-full rounded-full"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-40 w-40 rounded-full border-4 border-white shadow-lg bg-linear-to-br from-orange-400 to-[#FF5100] flex items-center justify-center ring-2 ring-orange-100">
                                            <span className="text-3xl font-bold text-white tracking-tight">
                                                {initials}
                                            </span>
                                        </div>
                                    )}
                                    {/* Verified pip */}
                                    <div className="absolute bottom-1.5 right-0 rounded-full bg-white p-0.5 shadow-sm">
                                        {user.emailVerified ? (
                                            <CheckCircle2 className="h-7 w-7 text-emerald-500" />
                                        ) : (
                                            <XCircle className="h-7 w-7 text-zinc-300" />
                                        )}
                                    </div>
                                </div>

                                {/* Edit Profile link — right aligned */}
                                <div className="shrink-0 pb-1 self-end">
                                    <Button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="inline-flex items-center gap-1.5 px-3 rounded-lg border text-xs font-medium shadow-sm text-primary border-orange-200 bg-orange-50 hover:bg-orange-100 transition-all duration-200 cursor-pointer h-10"
                                    >
                                        <Pencil className="h-3 w-3" />
                                        Edit Profile
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Info grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Personal Info */}
                    <motion.div variants={itemVariants}>
                        <Card className="border-zinc-200 shadow-sm overflow-hidden gap-0 py-0 h-full">
                            <div className="h-0.5 w-full bg-linear-to-r from-orange-400 via-[#FF5100] to-orange-400" />
                            <CardContent className="px-1 py-4">
                                <SectionHeader
                                    icon={User}
                                    title="Personal Info"
                                />
                                <div className="mt-1 divide-y divide-zinc-50">
                                    <InfoRow
                                        icon={User}
                                        label="Full Name"
                                        value={user.name}
                                    />
                                    <InfoRow
                                        icon={Mail}
                                        label="Email"
                                        value={user.email}
                                    />
                                    <InfoRow
                                        icon={Phone}
                                        label="Mobile Number"
                                        value={user.mobileNumber}
                                    />
                                    <InfoRow
                                        icon={ShieldCheck}
                                        label="Gender"
                                        value={
                                            user.gender ? (
                                                <span className="capitalize">
                                                    {user.gender.toLowerCase()}
                                                </span>
                                            ) : null
                                        }
                                    />
                                    <InfoRow
                                        icon={Calendar}
                                        label="Member Since"
                                        value={formatDate(user.createdAt)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Documents & Verification */}
                    <motion.div variants={itemVariants}>
                        <Card className="border-zinc-200 shadow-sm overflow-hidden gap-0 py-0 h-full">
                            <div className="h-0.5 w-full bg-linear-to-r from-orange-400 via-[#FF5100] to-orange-400" />
                            <CardContent className="px-1 py-4">
                                <SectionHeader
                                    icon={IdCard}
                                    title="Documents & Verification"
                                />
                                <div className="mt-1 divide-y divide-zinc-50">
                                    <InfoRow
                                        icon={IdCard}
                                        label="NID Number"
                                        value={user.nidNumber}
                                    />
                                    <InfoRow
                                        icon={Car}
                                        label="License Number"
                                        value={user.licenseNumber}
                                    />
                                    <InfoRow
                                        icon={CheckCircle2}
                                        label="Email Verification"
                                        value={
                                            user.emailVerified ? (
                                                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold text-sm">
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-zinc-400 text-sm">
                                                    <XCircle className="h-3.5 w-3.5" />
                                                    Not Verified
                                                </span>
                                            )
                                        }
                                    />
                                    <InfoRow
                                        icon={ShieldCheck}
                                        label="Account Role"
                                        value={
                                            <Badge
                                                variant="outline"
                                                className="border-orange-200 text-[#FF5100] bg-orange-50 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5"
                                            >
                                                {user.role}
                                            </Badge>
                                        }
                                    />
                                    <InfoRow
                                        icon={Calendar}
                                        label="Last Updated"
                                        value={formatDate(user.updatedAt)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>

            <EditMyProfileModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                user={user}
            />
        </div>
    );
}
