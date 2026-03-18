import { getDefaultDashboardRoute } from "../../../lib/authUtils";
import { getNavItemsByRole } from "../../../lib/navItems";
import { NavSection } from "../../../types/dashboard.type";
import { IUser } from "../../../types/user.type";
import DashboardNavbarContent from "./DashboardNavbarContent";

export default function DashboardNavbar({ userInfo }: { userInfo: IUser }) {
    const navItems: NavSection[] = getNavItemsByRole(userInfo.role);

    const dashboardHome = getDefaultDashboardRoute(userInfo.role);
    return (
        <DashboardNavbarContent
            userInfo={userInfo}
            navItems={navItems}
            dashboardHome={dashboardHome}
        />
    );
}
