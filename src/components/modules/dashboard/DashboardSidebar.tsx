import { getDefaultDashboardRoute } from "../../../lib/authUtils";
import { getNavItemsByRole } from "../../../lib/navItems";
import { NavSection } from "../../../types/dashboard.type";
import { UserRole } from "../../../types/enum.type";
import { IUser } from "../../../types/user.type";
import DashboardSidebarContent from "./DashboardSidebarContent";

export default async function DashboardSideBar({userInfo}: {userInfo: IUser}) {

    const navItems: NavSection[] = getNavItemsByRole(userInfo.role as UserRole);
    const dashboardHome = getDefaultDashboardRoute(userInfo.role as UserRole);

    return (
        <DashboardSidebarContent
            userInfo={userInfo}
            navItems={navItems}
            dashboardHome={dashboardHome}
        />
    );
}
