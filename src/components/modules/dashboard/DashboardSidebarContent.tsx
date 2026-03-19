"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "../../ui/separator";
import { cn } from "../../../lib/utils";
import { ScrollArea } from "../../ui/scroll-area";
import Image from "next/image";
import { IUser } from "../../../types/user.type";
import { NavSection } from "../../../types/dashboard.type";
import { getIconComponent } from "../../../lib/iconMapper";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import LogoutConfirmDialog from "../../shared/LogoutConfirmDialog";
import { LogOut } from "lucide-react";
import { Button } from "../../ui/button";

interface DashboardSidebarContentProps {
    userInfo: IUser;
    navItems: NavSection[];
    dashboardHome: string;
}

export default function DashboardSidebarContent({
    dashboardHome,
    navItems,
    userInfo,
}: DashboardSidebarContentProps) {
    const pathname = usePathname();

    return (
        <div className="hidden md:flex h-full w-64 flex-col border-r bg-card overflow-y-auto">
            {/* Logo / Brand */}
            <div className="flex h-16 items-center border-b px-6">
                <Link
                    href={dashboardHome}
                    className="flex items-center gap-2 py-2"
                >
                    <Image
                        src="/logo.svg"
                        alt={userInfo.name}
                        width={190}
                        height={50}
                    />
                </Link>
            </div>

            {/* Navigation Area */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <ScrollArea className="flex-1 px-3 py-4">
                    <nav className="space-y-6">
                        {navItems.map((section, sectionId) => (
                            <div key={sectionId}>
                                {section.title && (
                                    <h4 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        {section.title}
                                    </h4>
                                )}

                                <div className="space-y-1">
                                    {section.items.map((item: any, id: any) => {
                                        const isActive = pathname === item.href;
                                        // Icon Mapper Function
                                        const Icon = getIconComponent(
                                            item.icon,
                                        );

                                        return (
                                            <Link
                                                href={item.href}
                                                key={id}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                                                    isActive
                                                        ? "bg-primary text-primary-foreground"
                                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                                )}
                                            >
                                                <Icon className="w-4 h-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        );
                                    })}
                                </div>

                                {sectionId < navItems.length - 1 && (
                                    <Separator className="my-4" />
                                )}
                            </div>
                        ))}
                    </nav>
                </ScrollArea>

                <div className="px-3 py-4 border-t">
                    <LogoutConfirmDialog
                        trigger={
                            <Button
                                variant={`destructive`}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all cursor-pointer w-full h-10 border-destructive bg-destructive hover:bg-destructive/80 group"
                            >
                                <LogOut className="mr-2 h-4 w-4 text-white" />
                                <span className="text-white">Logout</span>
                            </Button>
                        }
                    />
                </div>
            </div>
        </div>
    );
}
