export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import ChangePassword from "../../../../components/modules/common/ChangePassword";

export const metadata: Metadata = {
    title: "Change Password | Vehiqo",
    description: "Manage your vehicle rental system from the admin dashboard.",
};

export default async function ChangePasswordPage() {
    return <ChangePassword />;
}
