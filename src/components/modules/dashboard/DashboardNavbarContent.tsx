"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { IUser } from "../../../types/user.type";
import { NavSection } from "../../../types/dashboard.type";
import { useEffect, useState } from "react";
import { Menu, Search } from "lucide-react";
import DashboardMobileSidebar from "./DashboardMobileSidebar";
import UserDropdown from "./UserDropdown";
import { usePathname } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "../../ui/breadcrumb";

interface DashboardNavbarProps {
    userInfo: IUser;
    navItems: NavSection[];
    dashboardHome: string;
}

const DashboardNavbarContent = ({
    dashboardHome,
    navItems,
    userInfo,
}: DashboardNavbarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();

    const homeSegments = dashboardHome.split("/").filter(Boolean);

    // Replace the segments and pageLabel logic with this
    const segments = pathname.split("/").filter(Boolean);

    // Build breadcrumb items with cumulative hrefs
    const breadcrumbSegments = segments.map((segment, index) => ({
        label: segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase()),
        href: "/" + segments.slice(0, index + 1).join("/"),
    }));

    // Check if current path starts with dashboardHome
    const isInsideDashboard = homeSegments.every(
        (seg, i) => segments[i] === seg,
    );

    // If inside dashboard, skip home segments. If not, show all segments.
    const pageSegments = isInsideDashboard
        ? breadcrumbSegments.slice(homeSegments.length)
        : breadcrumbSegments;

    const homeLabel = homeSegments
        .map((s) =>
            s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        )
        .join(" ");

    useEffect(() => {
        const checkSmallerScreen = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkSmallerScreen();
        window.addEventListener("resize", checkSmallerScreen);

        return () => {
            window.removeEventListener("resize", checkSmallerScreen);
        };
    }, []);

    return (
        <div className="flex items-center gap-4 w-full px-4 py-3 border-b bg-background">
            {/* Mobile Menu Toggle Button And Menu */}
            <Sheet open={isOpen && isMobile} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant={"outline"}
                        size={"icon"}
                        className="md:hidden cursor-pointer"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>

                <SheetContent side="left" className="w-64 p-0">
                    <DashboardMobileSidebar
                        userInfo={userInfo}
                        dashboardHome={dashboardHome}
                        navItems={navItems}
                        setIsOpen={setIsOpen}
                    />
                </SheetContent>
            </Sheet>

            {/* Breadcrumb */}
            <div className="flex-1">
                <Breadcrumb>
                    <BreadcrumbList>
                        {/* Home */}
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                href={dashboardHome}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {homeLabel}
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        {/* Page segments beyond home */}
                        {pageSegments.map((segment, index) => {
                            const isLast = index === pageSegments.length - 1;
                            return (
                                <span
                                    key={segment.href}
                                    className="flex items-center gap-1.5"
                                >
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <BreadcrumbPage className="font-medium text-foreground">
                                                {segment.label}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink
                                                href={segment.href}
                                                className="text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {segment.label}
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                </span>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
                {/* Notification */}
                {/* <NotificationDropdown /> */}

                {/* User Dropdown  */}
                <UserDropdown userInfo={userInfo} />
            </div>
        </div>
    );
};

export default DashboardNavbarContent;
