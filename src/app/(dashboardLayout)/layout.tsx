import React from "react";
import DashboardSidebar from "../../components/modules/dashboard/DashboardSidebar";
import DashboardNavbar from "../../components/modules/dashboard/DashboardNavbar";
import { getUserInfo } from "../../services/auth.services";

const RootDashboardLayout = async ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const userInfo = await getUserInfo();
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Dashboard Sidebar */}
            <DashboardSidebar userInfo={userInfo} />

            <div className="flex flex-1 flex-col overflow-hidden">
                {/* DashboardNavbar */}
                <DashboardNavbar userInfo={userInfo} />
                {/* Dashboard Content */}
                <main className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6">
                    <div>{children}</div>
                </main>
            </div>
        </div>
    );
};

export default RootDashboardLayout;
