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
        title: "User Management",
        items: [
            {
                title: "Admins",
                href: "/admin/dashboard/admins-management",
                icon: "Shield",
            },
            {
                title: "Doctors",
                href: "/admin/dashboard/doctors-management",
                icon: "Stethoscope",
            },
            {
                title: "Patients",
                href: "/admin/dashboard/patients-management",
                icon: "Users",
            },
        ],
    },
    {
        title: "Hospital Management",
        items: [
            {
                title: "Appointments",
                href: "/admin/dashboard/appointments-management",
                icon: "Calendar",
            },
            {
                title: "Schedules",
                href: "/admin/dashboard/schedules-management",
                icon: "Clock",
            },
            {
                title: "Specialties",
                href: "/admin/dashboard/specialties-management",
                icon: "Hospital",
            },
            {
                title: "Doctor Schedules",
                href: "/admin/dashboard/doctor-schedules-managament",
                icon: "CalendarClock",
            },
            {
                title: "Doctor Specialties",
                href: "/admin/dashboard/doctor-specialties-management",
                icon: "Stethoscope",
            },
            {
                title: "Payments",
                href: "/admin/dashboard/payments-management",
                icon: "CreditCard",
            },
            {
                title: "Prescriptions",
                href: "/admin/dashboard/prescriptions-management",
                icon: "FileText",
            },
            {
                title: "Reviews",
                href: "/admin/dashboard/reviews-management",
                icon: "Star",
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
