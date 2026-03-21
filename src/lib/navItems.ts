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
        title: "Bookings",
        items: [
            {
                title: "My Bookings",
                href: "/dashboard/my-bookings",
                icon: "CalendarCheck",
            },
            {
                title: "My Payments",
                href: "/dashboard/my-payments",
                icon: "CreditCard",
            },
        ],
    },
    {
        title: "Reviews",
        items: [
            {
                title: "My Reviews",
                href: "/dashboard/my-reviews",
                icon: "Star",
            },
        ],
    },
];

export const adminNavItems: NavSection[] = [
    {
        title: "Vehicle Management",
        items: [
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
        ],
    },
    {
        title: "Booking & Payments",
        items: [
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
                title: "Fuel Price",
                href: "/admin/dashboard/fuel-price-management",
                icon: "Fuel",
            },
        ],
    },
    {
        title: "Reviews & Feedback",
        items: [
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
