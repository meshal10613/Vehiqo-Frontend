import { getDefaultDashboardRoute } from "./authUtils";
import { UserRole } from "../types/enum.type";
import { NavSection } from "../types/dashboard.type";

export const getCommonTopNavItems = (role: UserRole) => {
    const defaultDashboard = getDefaultDashboardRoute(role);

    return [
        {
            title: "Dashboard",
            items: [
                {
                    title: "Home",
                    href: "/",
                    icon: "Home",
                },
                {
                    title: "Dashboard",
                    href: defaultDashboard,
                    icon: "LayoutDashboard",
                },
                {
                    title: "My Profile",
                    href: "/my-profile",
                    icon: "User",
                },
            ],
        },
    ];
};

export const getCommonBottomNavItems = () => {
    return [
        {
            title: "Settings",
            items: [
                {
                    title: "Change Password",
                    href: "/change-password",
                    icon: "Settings",
                },
            ],
        },
    ];
};

export const customerNavItems: NavSection[] = [
    {
        title: "Appointments",
        items: [
            {
                title: "My Appointments",
                href: "/dashboard/my-appointments",
                icon: "Calendar",
            },
            {
                title: "Book Appointment",
                href: "/dashboard/book-appointments",
                icon: "ClipboardList",
            },
        ],
    },
    {
        title: "Medical Records",
        items: [
            {
                title: "My Prescriptions",
                href: "/dashboard/my-prescriptions",
                icon: "FileText",
            },
            {
                title: "Health Records",
                href: "/dashboard/health-records",
                icon: "Activity",
            },
        ],
    },
];

export const adminNavItems: NavSection[] = [
    {
        title: "Vehicle Management",
        items: [
            {
                title: "Fuel Price",
                href: "/admin/dashboard/fuel-price-management",
                icon: "Fuel",
            },
            {
                title: "Vehicle Category",
                href: "/admin/dashboard/vehicle-category-management",
                icon: "Layers",
            },
            {
                title: "Vehicle Type",
                href: "/admin/dashboard/vehicle-type-management",
                icon: "Car",
            },
            {
                title: "Vehicles",
                href: "/admin/dashboard/vehicles-management",
                icon: "CarFront",
            },
            {
                title: "Bookings",
                href: "/admin/dashboard/bookings-management",
                icon: "BookOpen",
            },
            {
                title: "Payments",
                href: "/admin/dashboard/payments-management",
                icon: "CreditCard",
            },
            {
                title: "Reviews",
                href: "/admin/dashboard/reviews-management",
                icon: "Star",
            },
        ],
    },
    {
        title: "User Management",
        items: [
            {
                title: "Users",
                href: "/admin/dashboard/users-management",
                icon: "Users",
            },
        ],
    },
];

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
    const commonNavItems = getCommonTopNavItems(role);
    const commonBottomNavItems = getCommonBottomNavItems();

    switch (role) {
        case "ADMIN":
            return [
                ...commonNavItems,
                ...adminNavItems,
                ...commonBottomNavItems,
            ];

        case "CUSTOMER":
            return [
                ...commonNavItems,
                ...customerNavItems,
                ...commonBottomNavItems,
            ];
    }
};
