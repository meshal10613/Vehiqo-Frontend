"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { LayoutDashboard, LogOut, Menu, Car, Home, Phone } from "lucide-react";
import Image from "next/image";
import { IUser } from "../../../types/user.type";
import LogoutConfirmDialog from "../../shared/LogoutConfirmDialog";

type NavbarProps = {
    user?: IUser;
    onLogout?: () => void;
};

// ── Nav links ──────────────────────────────────────────────────────────────
const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/vehicles", label: "Vehicles", icon: Car },
    { href: "/contact", label: "Contact Us", icon: Phone },
];

// ── Desktop nav link ───────────────────────────────────────────────────────
function NavLink({ href, label }: { href: string; label: string }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={cn(
                "relative text-sm font-medium transition-colors duration-200 py-1",
                "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:rounded-full",
                "after:transition-transform after:duration-200 after:origin-left",
                isActive
                    ? "text-zinc-900 after:bg-[#FF5100] after:scale-x-100"
                    : "text-zinc-500 hover:text-zinc-900 after:bg-[#FF5100] after:scale-x-0 hover:after:scale-x-100",
            )}
        >
            {label}
        </Link>
    );
}

// ── User dropdown ──────────────────────────────────────────────────────────
function UserMenu({
    user,
    onLogout,
}: {
    user: NonNullable<IUser>;
    onLogout?: () => void;
}) {
    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <span className="rounded-full ring-2 ring-transparent hover:ring-[#FF5100]/30 transition-all duration-200 focus:outline-none focus:ring-[#FF5100]/40 cursor-pointer">
                    <Avatar className="h-9 w-9">
                        <AvatarImage
                            src={user?.image || undefined}
                            alt={user.name}
                        />
                        <AvatarFallback className="bg-[#FF5100]/10 text-[#FF5100] text-sm font-semibold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-52 mt-1">
                {/* User info */}
                <div className="px-3 py-2.5">
                    <p className="text-sm font-semibold text-zinc-900 truncate">
                        {user.name}
                    </p>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">
                        {user.email}
                    </p>
                </div>
                <DropdownMenuSeparator />

                <DropdownMenuItem>
                    <Link
                        href={
                            user.role === "ADMIN"
                                ? `/admin/dashboard`
                                : `/dashboard`
                        }
                        className="flex items-center gap-2.5 cursor-pointer"
                    >
                        <LayoutDashboard className="w-4 h-4 text-zinc-500" />
                        <span>Dashboard</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <LogoutConfirmDialog
                    trigger={
                        <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()} // prevent dropdown closing before dialog opens
                            className="flex items-center cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    }
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// ── Mobile sidebar nav link ────────────────────────────────────────────────
function MobileNavLink({
    href,
    label,
    icon: Icon,
    onClick,
}: {
    href: string;
    label: string;
    icon: React.ElementType;
    onClick?: () => void;
}) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <SheetClose>
            <Link
                href={href}
                onClick={onClick}
                className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                        ? "bg-[#FF5100]/10 text-[#FF5100]"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                )}
            >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
                {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FF5100]" />
                )}
            </Link>
        </SheetClose>
    );
}

// ── Main Navbar ────────────────────────────────────────────────────────────
export default function Navbar({ user, onLogout }: NavbarProps) {
    const [sheetOpen, setSheetOpen] = useState(false);

    const initials =
        user?.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) ?? "";

    return (
        <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-zinc-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
                {/* Logo */}
                <Link href={`/`}>
                    <Image
                        src="/logo.svg"
                        alt="Vehiqo Logo"
                        width={190}
                        height={50}
                        className="object-contain"
                    />
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-7">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.href}
                            href={link.href}
                            label={link.label}
                        />
                    ))}
                </nav>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {/* Desktop: auth */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <UserMenu user={user} onLogout={onLogout} />
                        ) : (
                            <Button
                                asChild
                                size="sm"
                                className="bg-[#FF5100] hover:bg-[#e64800] text-white shadow-sm shadow-orange-200 transition-all duration-200 cursor-pointer h-10 px-5"
                            >
                                <Link href="/sign-in">Sign In</Link>
                            </Button>
                        )}
                    </div>

                    {/* Mobile: hamburger */}
                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                            >
                                <Menu className="w-5 h-5" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </SheetTrigger>

                        <SheetContent
                            side="left"
                            className="w-72 p-0 flex flex-col"
                        >
                            {/* Sidebar header */}
                            <div className="flex items-center px-5 h-16 border-b border-zinc-100">
                                <Image
                                    src="/logo.svg"
                                    alt="Vehiqo Logo"
                                    width={190}
                                    height={50}
                                    className="object-contain"
                                />
                            </div>

                            {/* Nav links */}
                            <nav className="flex flex-col gap-1 p-4 flex-1">
                                {navLinks.map((link) => (
                                    <MobileNavLink
                                        key={link.href}
                                        href={link.href}
                                        label={link.label}
                                        icon={link.icon}
                                        onClick={() => setSheetOpen(false)}
                                    />
                                ))}
                            </nav>

                            {/* Sidebar footer: user or sign in */}
                            <div className="p-4 border-t border-zinc-100">
                                {user ? (
                                    <div className="flex flex-col gap-1">
                                        {/* User info row */}
                                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl">
                                            <Avatar className="h-9 w-9 shrink-0">
                                                <AvatarImage
                                                    src={
                                                        user?.image || undefined
                                                    }
                                                    alt={user.name}
                                                />
                                                <AvatarFallback className="bg-[#FF5100]/10 text-[#FF5100] text-sm font-semibold">
                                                    {initials}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-zinc-900 truncate">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-zinc-500 truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>

                                        <SheetClose>
                                            <Link
                                                href={
                                                    user.role === "ADMIN"
                                                        ? `/admin/dashboard`
                                                        : `/dashboard`
                                                }
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-all duration-200"
                                            >
                                                <LayoutDashboard className="w-4 h-4 shrink-0" />
                                                Dashboard
                                            </Link>
                                        </SheetClose>

                                        <LogoutConfirmDialog
                                            trigger={
                                                <button
                                                    // onClick={() => {
                                                    //     setSheetOpen(false);
                                                    // }}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 transition-all duration-200 w-full text-left cursor-pointer"
                                                >
                                                    <LogOut className="w-4 h-4 shrink-0" />
                                                    Log out
                                                </button>
                                            }
                                        />
                                    </div>
                                ) : (
                                    <Button className="w-full bg-[#FF5100] hover:bg-[#e64800] text-white shadow-sm shadow-orange-200 h-10 cursor-pointer">
                                        <SheetClose>
                                            <Link href={`/sign-in`}>
                                                Sign In
                                            </Link>
                                        </SheetClose>
                                    </Button>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
