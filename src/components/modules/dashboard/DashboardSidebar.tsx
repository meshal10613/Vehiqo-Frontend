import { getDefaultDashboardRoute } from "../../../lib/authUtils";
import { getNavItemsByRole } from "../../../lib/navItems";
import { getUserInfo } from "../../../services/auth.services";
import { NavSection } from "../../../types/dashboard.type";
import DashboardSidebarContent from "./DashboardSidebarContent";

export default async function DashboardSideBar() {
    const userInfo = await getUserInfo();
    const navItems: NavSection[] = getNavItemsByRole(userInfo.role);
    const dashboardHome = getDefaultDashboardRoute(userInfo.role);

    return (
        <DashboardSidebarContent
            userInfo={userInfo}
            navItems={navItems}
            dashboardHome={dashboardHome}
        />
    );
}
